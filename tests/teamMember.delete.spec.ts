import { getPayingUser } from './setup/getPayingUser';
import { isTestEnvironment } from './setup/isTestEnvironment';
import { tearDownDatabase } from './setup/tearDownDatabase';
import { getFriend } from './setup/getFriend';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
import { Mongoose } from 'mongoose';
import { StreakoidSDK } from '@streakoid/streakoid-sdk/lib/streakoidSDKFactory';
import { setupDatabase } from './setup/setupDatabase';
import { streakoidTestSDK } from './setup/streakoidTestSDK';
import { disconnectDatabase } from './setup/disconnectDatabase';
import { correctTeamMemberStreakKeys } from '../src/testHelpers/correctTeamMemberStreakKeys';
import { correctPopulatedTeamStreakKeys } from '../src/testHelpers/correctPopulatedTeamStreakKeys';
import { teamStreakModel } from '../src/Models/TeamStreak';

jest.setTimeout(120000);

const testName = 'DELETE-team-members';

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

    test(`deletes member from team streak`, async () => {
        expect.assertions(28);

        const user = await getPayingUser({ testName });

        const streakName = 'Daily Spanish';
        const userId = user._id;

        const friend = await getFriend({ testName });
        const friendId = friend._id;

        const members = [{ memberId: userId }];

        const originalTeamStreak = await SDK.teamStreaks.create({
            creatorId: userId,
            streakName,
            members,
        });

        await SDK.teamStreaks.teamMembers.create({
            userId: friendId,
            teamStreakId: originalTeamStreak._id,
        });

        await SDK.teamStreaks.teamMembers.deleteOne({
            teamStreakId: originalTeamStreak._id,
            memberId: friendId,
        });

        const teamStreak = await SDK.teamStreaks.getOne(originalTeamStreak._id);

        expect(teamStreak.streakName).toEqual(expect.any(String));
        expect(teamStreak.status).toEqual(StreakStatus.live);
        expect(teamStreak.creatorId).toBeDefined();
        expect(teamStreak.timezone).toEqual(expect.any(String));
        expect(teamStreak.active).toEqual(false);
        expect(teamStreak.completedToday).toEqual(false);
        expect(teamStreak.currentStreak.numberOfDaysInARow).toEqual(0);
        expect(Object.keys(teamStreak.currentStreak).sort()).toEqual(['numberOfDaysInARow'].sort());
        expect(teamStreak.pastStreaks.length).toEqual(0);
        expect(Object.keys(teamStreak).sort()).toEqual(correctPopulatedTeamStreakKeys);

        const { creator } = teamStreak;
        expect(creator._id).toBeDefined();
        expect(creator.username).toBeDefined();
        expect(Object.keys(creator).sort()).toEqual(['_id', 'username'].sort());

        expect(teamStreak.members.length).toEqual(1);

        const member = teamStreak.members[0];
        expect(member._id).toBeDefined();
        expect(member.username).toBeDefined();
        expect(member.profileImage).toBeDefined();
        expect(Object.keys(member)).toEqual(['_id', 'username', 'profileImage', 'teamMemberStreak']);

        expect(member.teamMemberStreak._id).toEqual(expect.any(String));
        expect(member.teamMemberStreak.completedToday).toEqual(false);
        expect(member.teamMemberStreak.active).toEqual(false);
        expect(member.teamMemberStreak.pastStreaks).toEqual([]);
        expect(member.teamMemberStreak.userId).toBeDefined();
        expect(member.teamMemberStreak.teamStreakId).toEqual(originalTeamStreak._id);
        expect(member.teamMemberStreak.timezone).toBeDefined();
        expect(member.teamMemberStreak.createdAt).toEqual(expect.any(String));
        expect(member.teamMemberStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(member.teamMemberStreak).sort()).toEqual(correctTeamMemberStreakKeys);
    });

    test(`when team member is deleted it sets the team member streak status to deleted.`, async () => {
        expect.assertions(2);

        const user = await getPayingUser({ testName });

        const streakName = 'Daily Spanish';
        const userId = user._id;

        const friend = await getFriend({ testName });
        const friendId = friend._id;

        const members = [{ memberId: userId }];

        const originalTeamStreak = await SDK.teamStreaks.create({
            creatorId: userId,
            streakName,
            members,
        });

        await SDK.teamStreaks.teamMembers.create({
            userId: friendId,
            teamStreakId: originalTeamStreak._id,
        });

        await SDK.teamStreaks.teamMembers.deleteOne({
            teamStreakId: originalTeamStreak._id,
            memberId: friendId,
        });

        const updatedTeamMemberStreaks = await SDK.teamMemberStreaks.getAll({
            userId,
            teamStreakId: originalTeamStreak._id,
        });
        const updatedTeamMemberStreak = updatedTeamMemberStreaks[0];

        expect(updatedTeamMemberStreak.status).toEqual(StreakStatus.archived);
        expect(Object.keys(updatedTeamMemberStreak).sort()).toEqual(correctTeamMemberStreakKeys);
    });

    test(`throws error if a user who is not a member of the team streak tries to delete someone.`, async () => {
        expect.assertions(2);

        const user = await getPayingUser({ testName });

        const streakName = 'Daily Spanish';
        const userId = user._id;

        const friend = await getFriend({ testName });
        const friendId = friend._id;

        const members = [{ memberId: userId }];

        const originalTeamStreak = await SDK.teamStreaks.create({
            creatorId: userId,
            streakName,
            members,
        });

        await SDK.teamStreaks.teamMembers.create({
            userId: friendId,
            teamStreakId: originalTeamStreak._id,
        });

        await teamStreakModel.findByIdAndUpdate(originalTeamStreak._id, {
            $set: { members: originalTeamStreak.members.filter(member => member._id !== user._id) },
        });

        try {
            await SDK.teamStreaks.teamMembers.deleteOne({
                teamStreakId: originalTeamStreak._id,
                memberId: friendId,
            });
        } catch (err) {
            const error = JSON.parse(err.text);
            const { message } = error;
            expect(err.status).toEqual(400);
            expect(message).toEqual('Cannot delete team member user is not apart of team streak.');
        }
    });
});
