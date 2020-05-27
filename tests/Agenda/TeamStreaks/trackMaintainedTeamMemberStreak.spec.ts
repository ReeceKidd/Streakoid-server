import { trackMaintainedTeamMemberStreaks } from '../../../src/Agenda/TeamStreaks/trackMaintainedTeamMemberStreaks';
import { isTestEnvironment } from '../../../tests/setup/isTestEnvironment';
import { getPayingUser } from '../../setup/getPayingUser';
import { setupDatabase } from '../../setup/setupDatabase';
import { tearDownDatabase } from '../../../tests/setup/tearDownDatabase';
import StreakTrackingEventTypes from '@streakoid/streakoid-models/lib/Types/StreakTrackingEventTypes';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
import { Mongoose } from 'mongoose';
import { disconnectDatabase } from '../../setup/disconnectDatabase';
import { StreakoidSDK } from '../../../src/SDK/streakoidSDKFactory';
import { streakoidTestSDKFactory } from '../../../src/SDK/streakoidTestSDKFactory';

jest.setTimeout(120000);

const testName = 'trackMaintainedTeamMemberStreak';

describe(testName, () => {
    let database: Mongoose;
    let SDK: StreakoidSDK;
    beforeAll(async () => {
        if (isTestEnvironment()) {
            database = await setupDatabase({ testName });
            SDK = streakoidTestSDKFactory({ testName });
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

    test('updates teamMember streak activity and creates a streak maintained tracking event', async () => {
        expect.assertions(30);

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

        const completeTeamMemberStreakTask = await SDK.completeTeamMemberStreakTasks.create({
            userId,
            teamStreakId,
            teamMemberStreakId: teamMemberStreakId,
        });

        expect(completeTeamMemberStreakTask._id).toBeDefined();
        expect(completeTeamMemberStreakTask.teamMemberStreakId).toEqual(teamMemberStreakId);
        expect(completeTeamMemberStreakTask.teamStreakId).toEqual(teamStreakId);
        expect(completeTeamMemberStreakTask.userId).toBeDefined();
        expect(completeTeamMemberStreakTask.taskCompleteTime).toEqual(expect.any(String));
        expect(completeTeamMemberStreakTask.taskCompleteDay).toEqual(expect.any(String));
        expect(completeTeamMemberStreakTask.createdAt).toEqual(expect.any(String));
        expect(completeTeamMemberStreakTask.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(completeTeamMemberStreakTask).sort()).toEqual(
            [
                '_id',
                'teamMemberStreakId',
                'teamStreakId',
                'taskCompleteTime',
                'taskCompleteDay',
                'createdAt',
                'updatedAt',
                'userId',
                '__v',
            ].sort(),
        );

        const maintainedTeamMemberStreaks = await SDK.teamMemberStreaks.getAll({
            completedToday: true,
        });

        await trackMaintainedTeamMemberStreaks(maintainedTeamMemberStreaks);

        const teamMemberStreak = await SDK.teamMemberStreaks.getOne(teamMemberStreakId);

        expect(teamMemberStreak._id).toEqual(expect.any(String));
        expect(teamMemberStreak.currentStreak.startDate).toEqual(expect.any(String));
        expect(teamMemberStreak.currentStreak.numberOfDaysInARow).toEqual(1);
        expect(Object.keys(teamMemberStreak.currentStreak).sort()).toEqual(['numberOfDaysInARow', 'startDate'].sort());
        expect(teamMemberStreak.completedToday).toEqual(false);
        expect(teamMemberStreak.active).toEqual(true);
        expect(teamMemberStreak.pastStreaks).toEqual([]);
        expect(teamMemberStreak.userId).toEqual(expect.any(String));
        expect(teamMemberStreak.teamStreakId).toEqual(teamStreakId);
        expect(teamMemberStreak.timezone).toEqual('Europe/London');
        expect(teamMemberStreak.createdAt).toEqual(expect.any(String));
        expect(teamMemberStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(teamMemberStreak).sort()).toEqual(
            [
                '_id',
                'currentStreak',
                'completedToday',
                'active',
                'pastStreaks',
                'userId',
                'teamStreakId',
                'timezone',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );

        const streakTrackingEvents = await SDK.streakTrackingEvents.getAll({
            streakId: teamMemberStreakId,
        });
        const streakTrackingEvent = streakTrackingEvents[0];

        expect(streakTrackingEvent.type).toEqual(StreakTrackingEventTypes.maintainedStreak);
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
