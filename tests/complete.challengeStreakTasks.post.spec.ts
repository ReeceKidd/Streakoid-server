import { getPayingUser } from './setup/getPayingUser';
import { isTestEnvironment } from './setup/isTestEnvironment';
import { setupDatabase } from './setup/setupDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
import ActivityFeedItemTypes from '@streakoid/streakoid-models/lib/Types/ActivityFeedItemTypes';
import { Mongoose } from 'mongoose';
import { StreakoidSDK } from '../src/SDK/streakoidSDKFactory';
import { streakoidTestSDKFactory } from '../src/SDK/streakoidTestSDKFactory';
import { disconnectDatabase } from './setup/disconnectDatabase';

jest.setTimeout(120000);

const testName = 'GET-complete-challenge-streak-tasks';

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

    describe('POST /v1/complete-challenge-streak-tasks', () => {
        test('user can complete a challenge streak task with a new current streak', async () => {
            expect.assertions(21);

            const user = await getPayingUser({ testName });
            const userId = user._id;

            const name = 'Duolingo';
            const description = 'Everyday I must complete a duolingo lesson';
            const icon = 'duolingo';
            const { challenge } = await SDK.challenges.create({ name, description, icon });
            const challengeId = challenge._id;
            const challengeStreak = await SDK.challengeStreaks.create({ userId, challengeId });
            const challengeStreakId = challengeStreak._id;

            const completeChallengeStreakTask = await SDK.completeChallengeStreakTasks.create({
                userId,
                challengeStreakId,
            });

            expect(completeChallengeStreakTask._id).toBeDefined();
            expect(completeChallengeStreakTask.userId).toBeDefined();
            expect(completeChallengeStreakTask.challengeStreakId).toEqual(challengeStreakId);
            expect(completeChallengeStreakTask.taskCompleteTime).toEqual(expect.any(String));
            expect(completeChallengeStreakTask.taskCompleteDay).toEqual(expect.any(String));
            expect(completeChallengeStreakTask.createdAt).toEqual(expect.any(String));
            expect(completeChallengeStreakTask.updatedAt).toEqual(expect.any(String));
            expect(Object.keys(completeChallengeStreakTask).sort()).toEqual(
                [
                    '_id',
                    'userId',
                    'challengeStreakId',
                    'taskCompleteTime',
                    'taskCompleteDay',
                    'createdAt',
                    'updatedAt',
                    '__v',
                ].sort(),
            );

            const updatedChallengeStreak = await SDK.challengeStreaks.getOne({ challengeStreakId });

            expect(updatedChallengeStreak.status).toEqual(StreakStatus.live);
            expect(updatedChallengeStreak.userId).toBeDefined();
            expect(updatedChallengeStreak.challengeId).toBeDefined();
            expect(updatedChallengeStreak._id).toBeDefined();
            expect(Object.keys(updatedChallengeStreak.currentStreak).sort()).toEqual(
                ['numberOfDaysInARow', 'startDate'].sort(),
            );
            expect(updatedChallengeStreak.currentStreak.numberOfDaysInARow).toEqual(1);
            expect(updatedChallengeStreak.currentStreak.startDate).toEqual(expect.any(String));
            expect(updatedChallengeStreak.completedToday).toEqual(true);
            expect(updatedChallengeStreak.active).toEqual(true);
            expect(updatedChallengeStreak.pastStreaks).toEqual([]);
            expect(updatedChallengeStreak.createdAt).toBeDefined();
            expect(updatedChallengeStreak.updatedAt).toBeDefined();
            expect(Object.keys(updatedChallengeStreak).sort()).toEqual(
                [
                    'currentStreak',
                    'status',
                    'completedToday',
                    'active',
                    'pastStreaks',
                    '_id',
                    'userId',
                    'username',
                    'userProfileImage',
                    'challengeId',
                    'challengeName',
                    'timezone',
                    'createdAt',
                    'updatedAt',
                    '__v',
                ].sort(),
            );
        });

        test('user can complete a challenge streak task with an existing current streak', async () => {
            expect.assertions(20);

            const user = await getPayingUser({ testName });
            const userId = user._id;

            const name = 'Duolingo';
            const description = 'Everyday I must complete a duolingo lesson';
            const icon = 'duolingo';
            const { challenge } = await SDK.challenges.create({ name, description, icon });
            const challengeId = challenge._id;

            const newChallengeStreak = await SDK.challengeStreaks.create({
                userId,
                challengeId,
            });

            const numberOfDaysInARow = 2;

            const challengeStreakWithExistingCurrentStreak = await SDK.challengeStreaks.update({
                challengeStreakId: newChallengeStreak._id,
                updateData: {
                    active: true,
                    currentStreak: {
                        startDate: new Date().toString(),
                        numberOfDaysInARow,
                    },
                },
            });

            const completeChallengeStreakTask = await SDK.completeChallengeStreakTasks.create({
                userId,
                challengeStreakId: challengeStreakWithExistingCurrentStreak._id,
            });

            expect(completeChallengeStreakTask._id).toBeDefined();
            expect(completeChallengeStreakTask.userId).toBeDefined();
            expect(completeChallengeStreakTask.challengeStreakId).toEqual(challengeStreakWithExistingCurrentStreak._id);
            expect(completeChallengeStreakTask.taskCompleteTime).toEqual(expect.any(String));
            expect(completeChallengeStreakTask.taskCompleteDay).toEqual(expect.any(String));
            expect(completeChallengeStreakTask.createdAt).toEqual(expect.any(String));
            expect(completeChallengeStreakTask.updatedAt).toEqual(expect.any(String));
            expect(Object.keys(completeChallengeStreakTask).sort()).toEqual(
                [
                    '_id',
                    'userId',
                    'challengeStreakId',
                    'taskCompleteTime',
                    'taskCompleteDay',
                    'createdAt',
                    'updatedAt',
                    '__v',
                ].sort(),
            );

            const updatedChallengeStreak = await SDK.challengeStreaks.getOne({
                challengeStreakId: challengeStreakWithExistingCurrentStreak._id,
            });

            expect(updatedChallengeStreak.status).toEqual(StreakStatus.live);
            expect(updatedChallengeStreak.userId).toBeDefined();
            expect(updatedChallengeStreak._id).toBeDefined();
            expect(Object.keys(updatedChallengeStreak.currentStreak).sort()).toEqual(
                ['numberOfDaysInARow', 'startDate'].sort(),
            );
            expect(updatedChallengeStreak.currentStreak.numberOfDaysInARow).toEqual(numberOfDaysInARow + 1);
            expect(updatedChallengeStreak.currentStreak.startDate).toEqual(expect.any(String));
            expect(updatedChallengeStreak.completedToday).toEqual(true);
            expect(updatedChallengeStreak.active).toEqual(true);
            expect(updatedChallengeStreak.pastStreaks).toEqual([]);
            expect(updatedChallengeStreak.createdAt).toBeDefined();
            expect(updatedChallengeStreak.updatedAt).toBeDefined();
            expect(Object.keys(updatedChallengeStreak).sort()).toEqual(
                [
                    'currentStreak',
                    'status',
                    'completedToday',
                    'active',
                    'pastStreaks',
                    '_id',
                    'userId',
                    'username',
                    'userProfileImage',
                    'challengeId',
                    'challengeName',
                    'timezone',
                    'createdAt',
                    'updatedAt',
                    '__v',
                ].sort(),
            );
        });

        test('user can complete, incomplete and recomplete a challenge streak with a new current streak', async () => {
            expect.assertions(20);

            const user = await getPayingUser({ testName });
            const userId = user._id;

            const name = 'Duolingo';
            const description = 'Everyday I must complete a duolingo lesson';
            const icon = 'duolingo';
            const { challenge } = await SDK.challenges.create({ name, description, icon });
            const challengeId = challenge._id;

            const challengeStreakForRecompletion = await SDK.challengeStreaks.create({
                userId,
                challengeId,
            });

            await SDK.completeChallengeStreakTasks.create({
                userId,
                challengeStreakId: challengeStreakForRecompletion._id,
            });

            await SDK.incompleteChallengeStreakTasks.create({
                userId,
                challengeStreakId: challengeStreakForRecompletion._id,
            });

            const recompleteChallengeStreakTask = await SDK.completeChallengeStreakTasks.create({
                userId,
                challengeStreakId: challengeStreakForRecompletion._id,
            });

            expect(recompleteChallengeStreakTask._id).toBeDefined();
            expect(recompleteChallengeStreakTask.userId).toBeDefined();
            expect(recompleteChallengeStreakTask.challengeStreakId).toEqual(challengeStreakForRecompletion._id);
            expect(recompleteChallengeStreakTask.taskCompleteTime).toEqual(expect.any(String));
            expect(recompleteChallengeStreakTask.taskCompleteDay).toEqual(expect.any(String));
            expect(recompleteChallengeStreakTask.createdAt).toEqual(expect.any(String));
            expect(recompleteChallengeStreakTask.updatedAt).toEqual(expect.any(String));
            expect(Object.keys(recompleteChallengeStreakTask).sort()).toEqual(
                [
                    '_id',
                    'userId',
                    'challengeStreakId',
                    'taskCompleteTime',
                    'taskCompleteDay',
                    'createdAt',
                    'updatedAt',
                    '__v',
                ].sort(),
            );

            const updatedChallengeStreak = await SDK.challengeStreaks.getOne({
                challengeStreakId: challengeStreakForRecompletion._id,
            });

            expect(updatedChallengeStreak.status).toEqual(StreakStatus.live);
            expect(updatedChallengeStreak.userId).toBeDefined();
            expect(updatedChallengeStreak._id).toBeDefined();
            expect(Object.keys(updatedChallengeStreak.currentStreak).sort()).toEqual(
                ['numberOfDaysInARow', 'startDate'].sort(),
            );
            expect(updatedChallengeStreak.currentStreak.numberOfDaysInARow).toEqual(1);
            expect(updatedChallengeStreak.currentStreak.startDate).toEqual(expect.any(String));
            expect(updatedChallengeStreak.completedToday).toEqual(true);
            expect(updatedChallengeStreak.active).toEqual(true);
            expect(updatedChallengeStreak.pastStreaks).toEqual([]);
            expect(updatedChallengeStreak.createdAt).toBeDefined();
            expect(updatedChallengeStreak.updatedAt).toBeDefined();
            expect(Object.keys(updatedChallengeStreak).sort()).toEqual(
                [
                    'currentStreak',
                    'status',
                    'completedToday',
                    'active',
                    'pastStreaks',
                    '_id',
                    'userId',
                    'username',
                    'userProfileImage',
                    'challengeId',
                    'challengeName',
                    'timezone',
                    'createdAt',
                    'updatedAt',
                    '__v',
                ].sort(),
            );
        });

        test('user can complete, incomplete and recomplete a challenge streak with an existing current streak', async () => {
            expect.assertions(21);

            const user = await getPayingUser({ testName });
            const userId = user._id;

            const name = 'Duolingo';
            const description = 'Everyday I must complete a duolingo lesson';
            const icon = 'duolingo';
            const { challenge } = await SDK.challenges.create({ name, description, icon });
            const challengeId = challenge._id;

            const newChallengeStreak = await SDK.challengeStreaks.create({
                userId,
                challengeId,
            });

            const numberOfDaysInARow = 2;

            const challengeStreakForRecompletion = await SDK.challengeStreaks.update({
                challengeStreakId: newChallengeStreak._id,
                updateData: {
                    active: true,
                    currentStreak: {
                        startDate: new Date().toString(),
                        numberOfDaysInARow,
                    },
                },
            });

            await SDK.completeChallengeStreakTasks.create({
                userId,
                challengeStreakId: challengeStreakForRecompletion._id,
            });

            await SDK.incompleteChallengeStreakTasks.create({
                userId,
                challengeStreakId: challengeStreakForRecompletion._id,
            });

            const recompleteChallengeStreakTask = await SDK.completeChallengeStreakTasks.create({
                userId,
                challengeStreakId: challengeStreakForRecompletion._id,
            });

            expect(recompleteChallengeStreakTask._id).toBeDefined();
            expect(recompleteChallengeStreakTask.userId).toBeDefined();
            expect(recompleteChallengeStreakTask.challengeStreakId).toEqual(challengeStreakForRecompletion._id);
            expect(recompleteChallengeStreakTask.taskCompleteTime).toEqual(expect.any(String));
            expect(recompleteChallengeStreakTask.taskCompleteDay).toEqual(expect.any(String));
            expect(recompleteChallengeStreakTask.createdAt).toEqual(expect.any(String));
            expect(recompleteChallengeStreakTask.updatedAt).toEqual(expect.any(String));
            expect(Object.keys(recompleteChallengeStreakTask).sort()).toEqual(
                [
                    '_id',
                    'userId',
                    'challengeStreakId',
                    'taskCompleteTime',
                    'taskCompleteDay',
                    'createdAt',
                    'updatedAt',
                    '__v',
                ].sort(),
            );

            const updatedChallengeStreak = await SDK.challengeStreaks.getOne({
                challengeStreakId: challengeStreakForRecompletion._id,
            });

            expect(updatedChallengeStreak.status).toEqual(StreakStatus.live);
            expect(updatedChallengeStreak.userId).toBeDefined();
            expect(updatedChallengeStreak.challengeId).toBeDefined();
            expect(updatedChallengeStreak._id).toBeDefined();
            expect(Object.keys(updatedChallengeStreak.currentStreak).sort()).toEqual(
                ['numberOfDaysInARow', 'startDate'].sort(),
            );
            expect(updatedChallengeStreak.currentStreak.numberOfDaysInARow).toEqual(numberOfDaysInARow + 1);
            expect(updatedChallengeStreak.currentStreak.startDate).toEqual(expect.any(String));
            expect(updatedChallengeStreak.completedToday).toEqual(true);
            expect(updatedChallengeStreak.active).toEqual(true);
            expect(updatedChallengeStreak.pastStreaks).toEqual([]);
            expect(updatedChallengeStreak.createdAt).toBeDefined();
            expect(updatedChallengeStreak.updatedAt).toBeDefined();
            expect(Object.keys(updatedChallengeStreak).sort()).toEqual(
                [
                    'currentStreak',
                    'status',
                    'completedToday',
                    'active',
                    'pastStreaks',
                    '_id',
                    'userId',
                    'username',
                    'userProfileImage',
                    'challengeId',
                    'challengeName',
                    'timezone',
                    'createdAt',
                    'updatedAt',
                    '__v',
                ].sort(),
            );
        });

        test('user cannot complete the same challenge streak task in the same day', async () => {
            expect.assertions(3);

            const user = await getPayingUser({ testName });
            const userId = user._id;

            const name = 'Duolingo';
            const description = 'Everyday I must complete a duolingo lesson';
            const icon = 'duolingo';
            const { challenge } = await SDK.challenges.create({ name, description, icon });
            const challengeId = challenge._id;

            const secondChallengeStreak = await SDK.challengeStreaks.create({
                userId,
                challengeId,
            });
            const secondChallengeStreakId = secondChallengeStreak._id;
            try {
                await SDK.completeChallengeStreakTasks.create({
                    userId,
                    challengeStreakId: secondChallengeStreakId,
                });
                await SDK.completeChallengeStreakTasks.create({
                    userId,
                    challengeStreakId: secondChallengeStreakId,
                });
            } catch (err) {
                const error = JSON.parse(err.text);
                const { code, message } = error;
                expect(err.status).toEqual(422);
                expect(message).toEqual('Challenge streak task already completed today.');
                expect(code).toEqual('422-06');
            }
        });

        test('when a user completes a challenge streak their totalStreakCompletes increases by one.', async () => {
            expect.assertions(1);

            const user = await getPayingUser({ testName });
            const userId = user._id;

            const name = 'Duolingo';
            const description = 'Everyday I must complete a duolingo lesson';
            const icon = 'duolingo';
            const { challenge } = await SDK.challenges.create({ name, description, icon });
            const challengeId = challenge._id;
            const challengeStreak = await SDK.challengeStreaks.create({ userId, challengeId });
            const challengeStreakId = challengeStreak._id;

            await SDK.completeChallengeStreakTasks.create({
                userId,
                challengeStreakId,
            });

            const updatedUser = await SDK.users.getOne(userId);
            expect(updatedUser.totalStreakCompletes).toEqual(1);
        });

        test('when user completes a task a CompletedChallengeStreakActivityItem is created', async () => {
            expect.assertions(7);

            const user = await getPayingUser({ testName });
            const userId = user._id;

            const name = 'Duolingo';
            const description = 'Everyday I must complete a duolingo lesson';
            const icon = 'duolingo';
            const { challenge } = await SDK.challenges.create({ name, description, icon });
            const challengeId = challenge._id;

            const challengeStreak = await SDK.challengeStreaks.create({
                userId,
                challengeId,
            });

            await SDK.completeChallengeStreakTasks.create({
                userId,
                challengeStreakId: challengeStreak._id,
            });

            const { activityFeedItems } = await SDK.activityFeedItems.getAll({
                activityFeedItemType: ActivityFeedItemTypes.completedChallengeStreak,
            });
            const completedChallengeStreakActivityFeedItem = activityFeedItems.find(
                item => item.activityFeedItemType === ActivityFeedItemTypes.completedChallengeStreak,
            );
            if (
                completedChallengeStreakActivityFeedItem &&
                completedChallengeStreakActivityFeedItem.activityFeedItemType ===
                    ActivityFeedItemTypes.completedChallengeStreak
            ) {
                expect(completedChallengeStreakActivityFeedItem.challengeStreakId).toEqual(String(challengeStreak._id));
                expect(completedChallengeStreakActivityFeedItem.challengeId).toEqual(String(challenge._id));
                expect(completedChallengeStreakActivityFeedItem.challengeName).toEqual(String(challenge.name));
                expect(completedChallengeStreakActivityFeedItem.userId).toEqual(String(userId));
                expect(completedChallengeStreakActivityFeedItem.userProfileImage).toEqual(
                    String(user.profileImages.originalImageUrl),
                );
                expect(completedChallengeStreakActivityFeedItem.username).toEqual(user.username);
                expect(Object.keys(completedChallengeStreakActivityFeedItem).sort()).toEqual(
                    [
                        '_id',
                        'activityFeedItemType',
                        'userId',
                        'username',
                        'userProfileImage',
                        'challengeStreakId',
                        'challengeId',
                        'challengeName',
                        'createdAt',
                        'updatedAt',
                        '__v',
                    ].sort(),
                );
            }
        });
    });
});