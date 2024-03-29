import { getPayingUser } from './setup/getPayingUser';
import { isTestEnvironment } from './setup/isTestEnvironment';
import { setupDatabase } from './setup/setupDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
import ActivityFeedItemTypes from '@streakoid/streakoid-models/lib/Types/ActivityFeedItemTypes';
import { OneHundredDaySoloStreakAchievement } from '@streakoid/streakoid-models/lib/Models/Achievement';
import AchievementTypes from '@streakoid/streakoid-models/lib/Types/AchievementTypes';
import { Mongoose } from 'mongoose';
import { StreakoidSDK } from '@streakoid/streakoid-sdk/lib/streakoidSDKFactory';
import { streakoidTestSDK } from './setup/streakoidTestSDK';
import { disconnectDatabase } from './setup/disconnectDatabase';
import { oidXpValues } from '../src/helpers/oidXpValues';
import { OidXpSourcesTypes } from '@streakoid/streakoid-models/lib/Types/OidXpSourcesTypes';
import { coinTransactionModel } from '../src/Models/CoinTransaction';
import CoinTransactionTypes from '@streakoid/streakoid-models/lib/Types/CoinTransactionTypes';
import { oidXpTransactionModel } from '../src/Models/OidXpTransaction';
import OidXpTransactionTypes from '@streakoid/streakoid-models/lib/Types/OidXpTransactionTypes';
import { coinCreditValues } from '../src/helpers/coinCreditValues';
import { CoinCredits } from '@streakoid/streakoid-models/lib/Types/CoinCredits';
import { correctSoloStreakKeys } from '../src/testHelpers/correctSoloStreakKeys';

jest.setTimeout(120000);

const testName = 'POST-complete-solo-streak-tasks';

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

    describe('POST /v1/complete-solo-streak-tasks', () => {
        test('user can complete a solo streak task with a new current streak', async () => {
            expect.assertions(21);

            const user = await getPayingUser({ testName });
            const userId = user._id;

            const soloStreak = await SDK.soloStreaks.create({ userId, streakName: 'Reading' });
            const soloStreakId = soloStreak._id;

            const completeSoloStreakTask = await SDK.completeSoloStreakTasks.create({
                userId,
                soloStreakId,
            });

            expect(completeSoloStreakTask._id).toBeDefined();
            expect(completeSoloStreakTask.userId).toBeDefined();
            expect(completeSoloStreakTask.streakId).toEqual(soloStreakId);
            expect(completeSoloStreakTask.taskCompleteTime).toEqual(expect.any(String));
            expect(completeSoloStreakTask.taskCompleteDay).toEqual(expect.any(String));
            expect(completeSoloStreakTask.createdAt).toEqual(expect.any(String));
            expect(completeSoloStreakTask.updatedAt).toEqual(expect.any(String));
            expect(Object.keys(completeSoloStreakTask).sort()).toEqual(
                [
                    '_id',
                    'userId',
                    'streakId',
                    'taskCompleteTime',
                    'taskCompleteDay',
                    'createdAt',
                    'updatedAt',
                    '__v',
                ].sort(),
            );

            const updatedSoloStreak = await SDK.soloStreaks.getOne(soloStreakId);

            expect(updatedSoloStreak.streakName).toEqual(expect.any(String));
            expect(updatedSoloStreak.status).toEqual(StreakStatus.live);
            expect(updatedSoloStreak.userId).toBeDefined();
            expect(updatedSoloStreak._id).toBeDefined();
            expect(Object.keys(updatedSoloStreak.currentStreak).sort()).toEqual(
                ['numberOfDaysInARow', 'startDate'].sort(),
            );
            expect(updatedSoloStreak.currentStreak.numberOfDaysInARow).toEqual(1);
            expect(updatedSoloStreak.currentStreak.startDate).toEqual(expect.any(String));
            expect(updatedSoloStreak.completedToday).toEqual(true);
            expect(updatedSoloStreak.active).toEqual(true);
            expect(updatedSoloStreak.pastStreaks).toEqual([]);
            expect(updatedSoloStreak.createdAt).toBeDefined();
            expect(updatedSoloStreak.updatedAt).toBeDefined();
            expect(Object.keys(updatedSoloStreak).sort()).toEqual(correctSoloStreakKeys);
        });

        test('user can complete a solo streak task with an existing current streak', async () => {
            expect.assertions(21);

            const user = await getPayingUser({ testName });
            const userId = user._id;

            const newSoloStreak = await SDK.soloStreaks.create({
                userId,
                streakName: 'Reading',
            });

            const numberOfDaysInARow = 2;

            const soloStreakWithExistingCurrentStreak = await SDK.soloStreaks.update({
                soloStreakId: newSoloStreak._id,
                updateData: {
                    active: true,
                    currentStreak: {
                        startDate: new Date().toString(),
                        numberOfDaysInARow,
                    },
                },
            });

            const completeSoloStreakTask = await SDK.completeSoloStreakTasks.create({
                userId,
                soloStreakId: soloStreakWithExistingCurrentStreak._id,
            });

            expect(completeSoloStreakTask._id).toBeDefined();
            expect(completeSoloStreakTask.userId).toBeDefined();
            expect(completeSoloStreakTask.streakId).toEqual(soloStreakWithExistingCurrentStreak._id);
            expect(completeSoloStreakTask.taskCompleteTime).toEqual(expect.any(String));
            expect(completeSoloStreakTask.taskCompleteDay).toEqual(expect.any(String));
            expect(completeSoloStreakTask.createdAt).toEqual(expect.any(String));
            expect(completeSoloStreakTask.updatedAt).toEqual(expect.any(String));
            expect(Object.keys(completeSoloStreakTask).sort()).toEqual(
                [
                    '_id',
                    'userId',
                    'streakId',
                    'taskCompleteTime',
                    'taskCompleteDay',
                    'createdAt',
                    'updatedAt',
                    '__v',
                ].sort(),
            );

            const updatedSoloStreak = await SDK.soloStreaks.getOne(soloStreakWithExistingCurrentStreak._id);

            expect(updatedSoloStreak.streakName).toEqual(expect.any(String));
            expect(updatedSoloStreak.status).toEqual(StreakStatus.live);
            expect(updatedSoloStreak.userId).toBeDefined();
            expect(updatedSoloStreak._id).toBeDefined();
            expect(Object.keys(updatedSoloStreak.currentStreak).sort()).toEqual(
                ['numberOfDaysInARow', 'startDate'].sort(),
            );
            expect(updatedSoloStreak.currentStreak.numberOfDaysInARow).toEqual(numberOfDaysInARow + 1);
            expect(updatedSoloStreak.currentStreak.startDate).toEqual(expect.any(String));
            expect(updatedSoloStreak.completedToday).toEqual(true);
            expect(updatedSoloStreak.active).toEqual(true);
            expect(updatedSoloStreak.pastStreaks).toEqual([]);
            expect(updatedSoloStreak.createdAt).toBeDefined();
            expect(updatedSoloStreak.updatedAt).toBeDefined();
            expect(Object.keys(updatedSoloStreak).sort()).toEqual(correctSoloStreakKeys);
        });

        test('user can complete, incomplete and complete a solo streak with a new current streak', async () => {
            expect.assertions(21);

            const user = await getPayingUser({ testName });
            const userId = user._id;

            const soloStreakForCompletion = await SDK.soloStreaks.create({
                userId,
                streakName: 'Reading',
            });

            await SDK.completeSoloStreakTasks.create({
                userId,
                soloStreakId: soloStreakForCompletion._id,
            });

            await SDK.incompleteSoloStreakTasks.create({
                userId,
                soloStreakId: soloStreakForCompletion._id,
            });

            const completeSoloStreakTask = await SDK.completeSoloStreakTasks.create({
                userId,
                soloStreakId: soloStreakForCompletion._id,
            });

            expect(completeSoloStreakTask._id).toBeDefined();
            expect(completeSoloStreakTask.userId).toBeDefined();
            expect(completeSoloStreakTask.streakId).toEqual(soloStreakForCompletion._id);
            expect(completeSoloStreakTask.taskCompleteTime).toEqual(expect.any(String));
            expect(completeSoloStreakTask.taskCompleteDay).toEqual(expect.any(String));
            expect(completeSoloStreakTask.createdAt).toEqual(expect.any(String));
            expect(completeSoloStreakTask.updatedAt).toEqual(expect.any(String));
            expect(Object.keys(completeSoloStreakTask).sort()).toEqual(
                [
                    '_id',
                    'userId',
                    'streakId',
                    'taskCompleteTime',
                    'taskCompleteDay',
                    'createdAt',
                    'updatedAt',
                    '__v',
                ].sort(),
            );

            const updatedSoloStreak = await SDK.soloStreaks.getOne(soloStreakForCompletion._id);

            expect(updatedSoloStreak.streakName).toEqual(expect.any(String));
            expect(updatedSoloStreak.status).toEqual(StreakStatus.live);
            expect(updatedSoloStreak.userId).toBeDefined();
            expect(updatedSoloStreak._id).toBeDefined();
            expect(Object.keys(updatedSoloStreak.currentStreak).sort()).toEqual(
                ['numberOfDaysInARow', 'startDate'].sort(),
            );
            expect(updatedSoloStreak.currentStreak.numberOfDaysInARow).toEqual(1);
            expect(updatedSoloStreak.currentStreak.startDate).toEqual(expect.any(String));
            expect(updatedSoloStreak.completedToday).toEqual(true);
            expect(updatedSoloStreak.active).toEqual(true);
            expect(updatedSoloStreak.pastStreaks).toEqual([]);
            expect(updatedSoloStreak.createdAt).toBeDefined();
            expect(updatedSoloStreak.updatedAt).toBeDefined();
            expect(Object.keys(updatedSoloStreak).sort()).toEqual(correctSoloStreakKeys);
        });

        test('user can complete, incomplete and complete a solo streak with an existing current streak', async () => {
            expect.assertions(21);

            const user = await getPayingUser({ testName });
            const userId = user._id;

            const newSoloStreak = await SDK.soloStreaks.create({
                userId,
                streakName: 'Reading',
            });

            const numberOfDaysInARow = 2;

            const soloStreakForCompletion = await SDK.soloStreaks.update({
                soloStreakId: newSoloStreak._id,
                updateData: {
                    active: true,
                    currentStreak: {
                        startDate: new Date().toString(),
                        numberOfDaysInARow,
                    },
                },
            });

            await SDK.completeSoloStreakTasks.create({
                userId,
                soloStreakId: soloStreakForCompletion._id,
            });

            await SDK.incompleteSoloStreakTasks.create({
                userId,
                soloStreakId: soloStreakForCompletion._id,
            });

            const completeSoloStreakTask = await SDK.completeSoloStreakTasks.create({
                userId,
                soloStreakId: soloStreakForCompletion._id,
            });

            expect(completeSoloStreakTask._id).toBeDefined();
            expect(completeSoloStreakTask.userId).toBeDefined();
            expect(completeSoloStreakTask.streakId).toEqual(soloStreakForCompletion._id);
            expect(completeSoloStreakTask.taskCompleteTime).toEqual(expect.any(String));
            expect(completeSoloStreakTask.taskCompleteDay).toEqual(expect.any(String));
            expect(completeSoloStreakTask.createdAt).toEqual(expect.any(String));
            expect(completeSoloStreakTask.updatedAt).toEqual(expect.any(String));
            expect(Object.keys(completeSoloStreakTask).sort()).toEqual(
                [
                    '_id',
                    'userId',
                    'streakId',
                    'taskCompleteTime',
                    'taskCompleteDay',
                    'createdAt',
                    'updatedAt',
                    '__v',
                ].sort(),
            );

            const updatedSoloStreak = await SDK.soloStreaks.getOne(soloStreakForCompletion._id);

            expect(updatedSoloStreak.streakName).toEqual(expect.any(String));
            expect(updatedSoloStreak.status).toEqual(StreakStatus.live);
            expect(updatedSoloStreak.userId).toBeDefined();
            expect(updatedSoloStreak._id).toBeDefined();
            expect(Object.keys(updatedSoloStreak.currentStreak).sort()).toEqual(
                ['numberOfDaysInARow', 'startDate'].sort(),
            );
            expect(updatedSoloStreak.currentStreak.numberOfDaysInARow).toEqual(numberOfDaysInARow + 1);
            expect(updatedSoloStreak.currentStreak.startDate).toEqual(expect.any(String));
            expect(updatedSoloStreak.completedToday).toEqual(true);
            expect(updatedSoloStreak.active).toEqual(true);
            expect(updatedSoloStreak.pastStreaks).toEqual([]);
            expect(updatedSoloStreak.createdAt).toBeDefined();
            expect(updatedSoloStreak.updatedAt).toBeDefined();
            expect(Object.keys(updatedSoloStreak).sort()).toEqual(correctSoloStreakKeys);
        });

        test('when a user completes a task their totalStreakCompletes increases by one.', async () => {
            expect.assertions(1);

            const user = await getPayingUser({ testName });
            const userId = user._id;

            const soloStreak = await SDK.soloStreaks.create({ userId, streakName: 'Reading' });
            const soloStreakId = soloStreak._id;

            await SDK.completeSoloStreakTasks.create({
                userId,
                soloStreakId,
            });

            const updatedUser = await SDK.users.getOne(userId);
            expect(updatedUser.totalStreakCompletes).toEqual(1);
        });

        test('when a user completes a task the solo streaks total times tracked increases by one.', async () => {
            expect.assertions(1);

            const user = await getPayingUser({ testName });
            const userId = user._id;

            const soloStreak = await SDK.soloStreaks.create({ userId, streakName: 'Reading' });
            const soloStreakId = soloStreak._id;

            await SDK.completeSoloStreakTasks.create({
                userId,
                soloStreakId,
            });

            const updatedSoloStreak = await SDK.soloStreaks.getOne(soloStreak._id);
            expect(updatedSoloStreak.totalTimesTracked).toEqual(1);
        });

        test('when a user completes a solo streak task they are credited with coins.', async () => {
            expect.assertions(4);

            const user = await getPayingUser({ testName });
            const userId = user._id;

            const soloStreak = await SDK.soloStreaks.create({ userId, streakName: 'Reading' });
            const soloStreakId = soloStreak._id;

            await SDK.completeSoloStreakTasks.create({
                userId,
                soloStreakId,
            });

            const updatedUser = await SDK.user.getCurrentUser();
            expect(updatedUser.coins).toEqual(coinCreditValues[CoinCredits.completeSoloStreak]);

            const coinReceipt = await coinTransactionModel.findOne({ userId });
            if (coinReceipt) {
                expect(coinReceipt.userId).toEqual(String(userId));
                expect(coinReceipt.transactionType).toEqual(CoinTransactionTypes.credit);
                expect(coinReceipt.coins).toEqual(coinCreditValues[CoinCredits.completeSoloStreak]);
            }
        });

        test('when a user completes a solo streak task they are credited with oidXp.', async () => {
            expect.assertions(4);

            const user = await getPayingUser({ testName });
            const userId = user._id;

            const soloStreak = await SDK.soloStreaks.create({ userId, streakName: 'Reading' });
            const soloStreakId = soloStreak._id;

            await SDK.completeSoloStreakTasks.create({
                userId,
                soloStreakId,
            });

            const updatedUser = await SDK.user.getCurrentUser();
            expect(updatedUser.oidXp).toEqual(oidXpValues[OidXpSourcesTypes.soloStreakComplete]);

            const oidXpReceipt = await oidXpTransactionModel.findOne({ userId });
            if (oidXpReceipt) {
                expect(oidXpReceipt.userId).toEqual(String(userId));
                expect(oidXpReceipt.transactionType).toEqual(OidXpTransactionTypes.credit);
                expect(oidXpReceipt.oidXp).toEqual(coinCreditValues[CoinCredits.completeSoloStreak]);
            }
        });

        test('user cannot complete the same solo streak task in the same day', async () => {
            expect.assertions(3);
            const user = await getPayingUser({ testName });
            const userId = user._id;
            const secondSoloStreak = await SDK.soloStreaks.create({
                userId,
                streakName: 'Reading',
            });
            const secondSoloStreakId = secondSoloStreak._id;
            try {
                await SDK.completeSoloStreakTasks.create({
                    userId,
                    soloStreakId: secondSoloStreakId,
                });
                await SDK.completeSoloStreakTasks.create({
                    userId,
                    soloStreakId: secondSoloStreakId,
                });
            } catch (err) {
                const error = JSON.parse(err.text);
                const { code, message } = error;
                expect(err.status).toEqual(422);
                expect(message).toEqual('Solo streak task already completed today.');
                expect(code).toEqual('422-01');
            }
        });

        test('when user completes a task a CompletedSoloStreakActivityItem is created', async () => {
            expect.assertions(6);
            const user = await getPayingUser({ testName });
            const userId = user._id;
            const soloStreak = await SDK.soloStreaks.create({ userId, streakName: 'Reading' });
            const soloStreakId = soloStreak._id;

            await SDK.completeSoloStreakTasks.create({
                userId,
                soloStreakId,
            });

            const { activityFeedItems } = await SDK.activityFeedItems.getAll({
                soloStreakId: soloStreak._id,
            });
            const activityFeedItem = activityFeedItems.find(
                item => item.activityFeedItemType === ActivityFeedItemTypes.completedSoloStreak,
            );
            if (
                activityFeedItem &&
                activityFeedItem.activityFeedItemType === ActivityFeedItemTypes.completedSoloStreak
            ) {
                expect(activityFeedItem.soloStreakId).toEqual(String(soloStreak._id));
                expect(activityFeedItem.soloStreakName).toEqual(String(soloStreak.streakName));
                expect(activityFeedItem.userId).toEqual(String(soloStreak.userId));
                expect(activityFeedItem.username).toEqual(user.username);
                expect(activityFeedItem.userProfileImage).toEqual(user.profileImages.originalImageUrl);
                expect(Object.keys(activityFeedItem).sort()).toEqual(
                    [
                        '_id',
                        'activityFeedItemType',
                        'userId',
                        'username',
                        'userProfileImage',
                        'soloStreakId',
                        'soloStreakName',
                        'createdAt',
                        'updatedAt',
                        '__v',
                    ].sort(),
                );
            }
        });

        test('when user completes a task on the 100th day and they do not already have the OneHundredDaySoloStreak achievement they unlock the OneHundredDaySoloStreak achievement ', async () => {
            expect.assertions(8);

            const user = await getPayingUser({ testName });
            const userId = user._id;

            const achievementToCreate: OneHundredDaySoloStreakAchievement = {
                achievementType: AchievementTypes.oneHundredDaySoloStreak,
                name: '100 Hundred Days',
                description: '100 Day solo streak',
            };
            await SDK.achievements.create(achievementToCreate);
            const soloStreak = await SDK.soloStreaks.create({ userId, streakName: 'Reading' });
            const soloStreakId = soloStreak._id;

            await SDK.soloStreaks.update({
                soloStreakId,
                updateData: {
                    currentStreak: {
                        ...soloStreak.currentStreak,
                        numberOfDaysInARow: 99,
                    },
                },
            });

            await SDK.completeSoloStreakTasks.create({
                userId,
                soloStreakId,
            });

            const updatedUser = await SDK.users.getOne(userId);
            expect(updatedUser.achievements.length).toEqual(1);
            const oneHundredDaySoloStreakAchievement = updatedUser.achievements[0];
            expect(oneHundredDaySoloStreakAchievement.achievementType).toEqual(
                AchievementTypes.oneHundredDaySoloStreak,
            );
            expect(oneHundredDaySoloStreakAchievement.name).toEqual(achievementToCreate.name);
            expect(oneHundredDaySoloStreakAchievement.description).toEqual(achievementToCreate.description);
            expect(oneHundredDaySoloStreakAchievement._id).toEqual(expect.any(String));
            expect(oneHundredDaySoloStreakAchievement.createdAt).toEqual(expect.any(String));
            expect(oneHundredDaySoloStreakAchievement.updatedAt).toEqual(expect.any(String));
            expect(Object.keys(oneHundredDaySoloStreakAchievement).sort()).toEqual(
                ['__v', 'createdAt', 'updatedAt', 'achievementType', '_id', 'description', 'name'].sort(),
            );
        });

        test('when user completes a task on the 100th day but they already have the OneHundredDaySoloStreak achievement nothing happens', async () => {
            expect.assertions(8);

            const user = await getPayingUser({ testName });
            const userId = user._id;

            const achievementToCreate: OneHundredDaySoloStreakAchievement = {
                achievementType: AchievementTypes.oneHundredDaySoloStreak,
                name: '100 Hundred Days',
                description: '100 Day solo streak',
            };
            await SDK.achievements.create(achievementToCreate);

            const soloStreak = await SDK.soloStreaks.create({ userId, streakName: 'Reading' });
            const soloStreakId = soloStreak._id;

            await SDK.soloStreaks.update({
                soloStreakId,
                updateData: {
                    currentStreak: {
                        ...soloStreak.currentStreak,
                        numberOfDaysInARow: 99,
                    },
                },
            });

            await SDK.completeSoloStreakTasks.create({
                userId,
                soloStreakId,
            });

            await SDK.incompleteSoloStreakTasks.create({ userId, soloStreakId });

            await SDK.completeSoloStreakTasks.create({
                userId,
                soloStreakId,
            });

            const updatedUser = await SDK.users.getOne(userId);
            expect(updatedUser.achievements.length).toEqual(1);
            const oneHundredDaySoloStreakAchievement = updatedUser.achievements[0];
            expect(oneHundredDaySoloStreakAchievement.achievementType).toEqual(
                AchievementTypes.oneHundredDaySoloStreak,
            );
            expect(oneHundredDaySoloStreakAchievement.name).toEqual(achievementToCreate.name);
            expect(oneHundredDaySoloStreakAchievement.description).toEqual(achievementToCreate.description);
            expect(oneHundredDaySoloStreakAchievement._id).toEqual(expect.any(String));
            expect(oneHundredDaySoloStreakAchievement.createdAt).toEqual(expect.any(String));
            expect(oneHundredDaySoloStreakAchievement.updatedAt).toEqual(expect.any(String));
            expect(Object.keys(oneHundredDaySoloStreakAchievement).sort()).toEqual(
                ['__v', 'createdAt', 'updatedAt', 'achievementType', '_id', 'description', 'name'].sort(),
            );
        });

        test('if currentStreak number of days does not equal 100 no OneHundredDaySoloStreak us unlocked.', async () => {
            expect.assertions(1);

            const user = await getPayingUser({ testName });
            const userId = user._id;

            await SDK.achievements.create({
                achievementType: AchievementTypes.oneHundredDaySoloStreak,
                name: '100 Hundred Days',
                description: '100 Day solo streak',
            });

            const soloStreak = await SDK.soloStreaks.create({ userId, streakName: 'Reading' });
            const soloStreakId = soloStreak._id;

            await SDK.soloStreaks.update({
                soloStreakId,
                updateData: {
                    currentStreak: {
                        ...soloStreak.currentStreak,
                        numberOfDaysInARow: 70,
                    },
                },
            });

            await SDK.completeSoloStreakTasks.create({
                userId,
                soloStreakId,
            });

            const updatedUser = await SDK.users.getOne(userId);
            expect(updatedUser.achievements.length).toEqual(0);
        });
    });
});
