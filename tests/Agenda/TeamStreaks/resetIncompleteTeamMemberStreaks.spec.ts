import { resetIncompleteTeamMemberStreaks } from '../../../src/Agenda/TeamStreaks/resetIncompleteTeamMemberStreaks';
import { resetIncompleteTeamStreaks } from '../../../src/Agenda/TeamStreaks/resetIncompleteTeamStreaks';
import { originalImageUrl } from '../../../src/Models/User';
import { isTestEnvironment } from '../../../tests/setup/isTestEnvironment';
import { setupDatabase } from '../../setup/setupDatabase';
import { getPayingUser } from '../../setup/getPayingUser';
import { tearDownDatabase } from '../../../tests/setup/tearDownDatabase';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
import StreakTrackingEventTypes from '@streakoid/streakoid-models/lib/Types/StreakTrackingEventTypes';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
import ActivityFeedItemTypes from '@streakoid/streakoid-models/lib/Types/ActivityFeedItemTypes';
import { testSDK } from '../../testSDK/testSDK';

jest.setTimeout(120000);

describe('resetIncompleteTeamMemberStreaks', () => {
    let userId: string;
    let username: string;
    let userProfileImage: string;
    const streakName = 'Daily Spanish';

    beforeEach(async () => {
        if (isTestEnvironment()) {
            await setupDatabase();
            const user = await getPayingUser();
            userId = user._id;
            username = user.username || '';
            userProfileImage = user.profileImages.originalImageUrl;
        }
    });

    afterEach(async () => {
        if (isTestEnvironment()) {
            await tearDownDatabase();
        }
    });

    test('adds current team member streak to past streak, resets the current streak and create a lost streak tracking event. Sets teamStreak completedToday to false', async () => {
        expect.assertions(42);

        const creatorId = userId;
        const members = [{ memberId: userId }];
        const teamStreak = await testSDK.teamStreaks.create({ creatorId, streakName, members });
        const teamStreakId = teamStreak._id;

        //Emulate team streak being active so the incomplete team member streak can reset it.
        await testSDK.teamStreaks.update({
            teamStreakId,
            updateData: { active: true, currentStreak: { startDate: new Date().toString(), numberOfDaysInARow: 1 } },
        });

        const teamMemberStreaks = await testSDK.teamMemberStreaks.getAll({
            userId,
            teamStreakId,
        });
        const teamMemberStreak = teamMemberStreaks[0];
        const teamMemberStreakId = teamMemberStreak._id;

        // Emulate team member streak being active
        await testSDK.teamMemberStreaks.update({
            teamMemberStreakId: teamMemberStreakId,
            updateData: { active: true, currentStreak: { startDate: new Date().toString(), numberOfDaysInARow: 1 } },
        });

        const incompleteTeamMemberStreaks = await testSDK.teamMemberStreaks.getAll({
            completedToday: false,
            active: true,
        });

        const endDate = new Date();

        await resetIncompleteTeamMemberStreaks(incompleteTeamMemberStreaks, endDate.toString());

        const incompleteTeamStreaks = await testSDK.teamStreaks.getAll({
            completedToday: false,
            active: true,
        });

        await resetIncompleteTeamStreaks(incompleteTeamStreaks, endDate.toString());

        const updatedTeamStreak = await testSDK.teamStreaks.getOne(teamStreakId);

        expect(updatedTeamStreak.streakName).toEqual(streakName);
        expect(updatedTeamStreak.status).toEqual(StreakStatus.live);
        expect(updatedTeamStreak.completedToday).toEqual(false);
        expect(updatedTeamStreak.active).toEqual(false);
        expect(updatedTeamStreak.pastStreaks.length).toEqual(1);
        const pastStreak = updatedTeamStreak.pastStreaks[0];
        expect(pastStreak.endDate).toEqual(expect.any(String));
        expect(pastStreak.numberOfDaysInARow).toEqual(1);
        expect(pastStreak.startDate).toEqual(expect.any(String));
        expect(Object.keys(pastStreak).sort()).toEqual(['endDate', 'numberOfDaysInARow', 'startDate'].sort());
        const currentStreak = updatedTeamStreak.currentStreak;
        expect(currentStreak.numberOfDaysInARow).toEqual(0);
        expect(currentStreak.startDate).toEqual(null);
        expect(Object.keys(currentStreak)).toEqual(['startDate', 'numberOfDaysInARow']);
        expect(updatedTeamStreak._id).toEqual(expect.any(String));
        expect(updatedTeamStreak.creatorId).toEqual(expect.any(String));
        expect(updatedTeamStreak.creator._id).toBeDefined();
        expect(updatedTeamStreak.creator.username).toBeDefined();
        expect(Object.keys(updatedTeamStreak.creator).sort()).toEqual(['_id', 'username'].sort());
        expect(updatedTeamStreak.members.length).toEqual(1);
        const member = updatedTeamStreak.members[0];
        expect(member._id).toBeDefined();
        expect(member.teamMemberStreak).toEqual(expect.any(Object));
        expect(member.username).toBeDefined();
        expect(member.profileImage).toEqual(originalImageUrl);
        expect(Object.keys(member).sort()).toEqual(['_id', 'teamMemberStreak', 'profileImage', 'username'].sort());
        expect(updatedTeamStreak.createdAt).toEqual(expect.any(String));
        expect(updatedTeamStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(updatedTeamStreak).sort()).toEqual(
            [
                '_id',
                'status',
                'currentStreak',
                'completedToday',
                'active',
                'pastStreaks',
                'streakName',
                'timezone',
                'creator',
                'creatorId',
                'members',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );

        const streakTrackingEvents = await testSDK.streakTrackingEvents.getAll({
            streakId: teamMemberStreakId,
        });
        const streakTrackingEvent = streakTrackingEvents[0];

        expect(streakTrackingEvent.type).toEqual(StreakTrackingEventTypes.lostStreak);
        expect(streakTrackingEvent.streakId).toBeDefined();
        expect(streakTrackingEvent.streakType).toEqual(StreakTypes.teamMember);
        expect(streakTrackingEvent.userId).toBeDefined();
        expect(streakTrackingEvent._id).toEqual(expect.any(String));
        expect(streakTrackingEvent.createdAt).toEqual(expect.any(String));
        expect(streakTrackingEvent.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(streakTrackingEvent).sort()).toEqual(
            ['_id', 'type', 'streakId', 'streakType', 'userId', 'createdAt', 'updatedAt', '__v'].sort(),
        );

        const lostTeamMemberStreakItems = await testSDK.activityFeedItems.getAll({
            activityFeedItemType: ActivityFeedItemTypes.lostTeamStreak,
        });
        const lostTeamMemberStreakItem = lostTeamMemberStreakItems.activityFeedItems[0];
        if (lostTeamMemberStreakItem.activityFeedItemType === ActivityFeedItemTypes.lostTeamStreak) {
            expect(lostTeamMemberStreakItem.activityFeedItemType).toEqual(ActivityFeedItemTypes.lostTeamStreak);
            expect(lostTeamMemberStreakItem.userId).toEqual(String(userId));
            expect(lostTeamMemberStreakItem.username).toEqual(String(username));
            expect(lostTeamMemberStreakItem.userProfileImage).toEqual(String(userProfileImage));
            expect(lostTeamMemberStreakItem.teamStreakId).toEqual(String(teamStreak._id));
            expect(lostTeamMemberStreakItem.teamStreakName).toEqual(String(teamStreak.streakName));
            expect(lostTeamMemberStreakItem.numberOfDaysLost).toEqual(expect.any(Number));
            expect(Object.keys(lostTeamMemberStreakItem).sort()).toEqual(
                [
                    '_id',
                    'activityFeedItemType',
                    'teamStreakId',
                    'teamStreakName',
                    'userId',
                    'username',
                    'userProfileImage',
                    'numberOfDaysLost',
                    'createdAt',
                    'updatedAt',
                    '__v',
                ].sort(),
            );
        }
    });
});
