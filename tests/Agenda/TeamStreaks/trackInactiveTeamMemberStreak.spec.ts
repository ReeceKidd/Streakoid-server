import { trackInactiveTeamMemberStreaks } from '../../../src/Agenda/TeamStreaks/trackInactiveTeamMemberStreaks';
import { isTestEnvironment } from '../../../tests/setup/isTestEnvironment';
import { setupDatabase } from '../../setup/setupDatabase';
import { getPayingUser } from '../../setup/getPayingUser';
import { tearDownDatabase } from '../../../tests/setup/tearDownDatabase';
import StreakTrackingEventTypes from '@streakoid/streakoid-models/lib/Types/StreakTrackingEventTypes';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
import { Mongoose } from 'mongoose';
import { disconnectDatabase } from '../../setup/disconnectDatabase';
import { StreakoidSDK } from '@streakoid/streakoid-sdk/lib/streakoidSDKFactory';
import { streakoidTestSDK } from '../../setup/streakoidTestSDK';
import { correctTeamMemberStreakKeys } from '../../../src/testHelpers/correctTeamMemberStreakKeys';

jest.setTimeout(120000);

const testName = 'trackInactiveTeamMemberStreak';

describe(testName, () => {
    let database: Mongoose;
    let SDK: StreakoidSDK;
    beforeAll(async () => {
        if (isTestEnvironment()) {
            database = await setupDatabase({ testName });
            SDK = streakoidTestSDK({ testName });
        }
    });

    afterEach(async () => {
        if (isTestEnvironment()) {
            await tearDownDatabase({ database });
        }
    });

    afterAll(async () => {
        if (isTestEnvironment()) {
            await disconnectDatabase({ database });
        }
    });

    test('updates teamMember streak activity and creates a streak inactive tracking event', async () => {
        expect.assertions(21);

        const user = await getPayingUser({ testName });
        const userId = user._id;
        const streakName = 'Daily Spanish';

        const creatorId = userId;
        const members = [{ memberId: userId }];
        const teamStreak = await SDK.teamStreaks.create({ creatorId, streakName, members });
        const teamStreakId = teamStreak._id;

        const teamMemberStreaks = await SDK.teamMemberStreaks.getAll({
            userId,
            teamStreakId,
        });
        const teamMemberStreakId = teamMemberStreaks[0]._id;

        const inactiveTeamMemberStreaks = await SDK.teamMemberStreaks.getAll({
            completedToday: false,
            active: false,
        });

        await trackInactiveTeamMemberStreaks(inactiveTeamMemberStreaks);

        const teamMemberStreak = await SDK.teamMemberStreaks.getOne(teamMemberStreakId);

        expect(teamMemberStreak._id).toEqual(expect.any(String));
        expect(teamMemberStreak.currentStreak.startDate).toBeUndefined();
        expect(teamMemberStreak.currentStreak.numberOfDaysInARow).toEqual(0);
        expect(Object.keys(teamMemberStreak.currentStreak).sort()).toEqual(['numberOfDaysInARow'].sort());
        expect(teamMemberStreak.completedToday).toEqual(false);
        expect(teamMemberStreak.active).toEqual(false);
        expect(teamMemberStreak.pastStreaks).toEqual([]);
        expect(teamMemberStreak.userId).toBeDefined();
        expect(teamMemberStreak.teamStreakId).toEqual(teamStreakId);
        expect(teamMemberStreak.timezone).toEqual(`Europe/London`);
        expect(teamMemberStreak.createdAt).toEqual(expect.any(String));
        expect(teamMemberStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(teamMemberStreak).sort()).toEqual(correctTeamMemberStreakKeys);

        const streakTrackingEvents = await SDK.streakTrackingEvents.getAll({
            streakId: teamMemberStreakId,
        });

        const streakTrackingEvent = streakTrackingEvents[0];

        expect(streakTrackingEvent.type).toEqual(StreakTrackingEventTypes.inactiveStreak);
        expect(streakTrackingEvent.streakId).toBeDefined();
        expect(streakTrackingEvent.streakType).toEqual(StreakTypes.teamMember);
        expect(streakTrackingEvent._id).toEqual(expect.any(String));
        expect(streakTrackingEvent.userId).toBeDefined();
        expect(streakTrackingEvent.createdAt).toEqual(expect.any(String));
        expect(streakTrackingEvent.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(streakTrackingEvent).sort()).toEqual(
            ['_id', 'type', 'streakId', 'streakType', 'userId', 'createdAt', 'updatedAt', '__v'].sort(),
        );
    });
});
