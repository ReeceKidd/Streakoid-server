import { trackMaintainedSoloStreaks } from '.../../../src/Agenda/SoloStreaks/trackMaintainedSoloStreaks';
import { isTestEnvironment } from '../../../tests/setup/isTestEnvironment';
import { setupDatabase } from '../../setup/setupDatabase';
import { tearDownDatabase } from '../../../tests/setup/tearDownDatabase';
import { getPayingUser } from '../../setup/getPayingUser';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
import StreakTrackingEventTypes from '@streakoid/streakoid-models/lib/Types/StreakTrackingEventTypes';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
import { disconnectDatabase } from '../../setup/disconnectDatabase';
import { Mongoose } from 'mongoose';
import { StreakoidSDK } from '@streakoid/streakoid-sdk/lib/streakoidSDKFactory';
import { streakoidTestSDK } from '../../setup/streakoidTestSDK';
import { correctSoloStreakKeys } from '../../../src/testHelpers/correctSoloStreakKeys';
import { LongestEverSoloStreak } from '@streakoid/streakoid-models/lib/Models/LongestEverSoloStreak';
import { LongestCurrentSoloStreak } from '@streakoid/streakoid-models/lib/Models/LongestCurrentSoloStreak';

jest.setTimeout(120000);

const testName = 'trackMaintainedSoloStreak';

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

    test('updates solo streak completedToday field', async () => {
        expect.assertions(15);

        const user = await getPayingUser({ testName });
        const userId = user._id;
        const streakName = 'Daily Spanish';
        const streakDescription = 'Everyday I must study Spanish';

        const soloStreak = await SDK.soloStreaks.create({ userId, streakName, streakDescription });
        const soloStreakId = soloStreak._id;

        await SDK.completeSoloStreakTasks.create({
            userId,
            soloStreakId,
        });

        const maintainedSoloStreaks = await SDK.soloStreaks.getAll({
            completedToday: true,
            userId,
        });

        await trackMaintainedSoloStreaks(maintainedSoloStreaks);

        const updatedSoloStreak = await SDK.soloStreaks.getOne(soloStreakId);

        expect(updatedSoloStreak.streakName).toEqual(streakName);
        expect(updatedSoloStreak.status).toEqual(StreakStatus.live);
        expect(updatedSoloStreak.streakDescription).toEqual(streakDescription);
        expect(updatedSoloStreak.userId).toBeDefined();
        expect(updatedSoloStreak.completedToday).toEqual(false);
        expect(updatedSoloStreak.active).toEqual(true);
        expect(updatedSoloStreak.pastStreaks.length).toEqual(0);
        expect(updatedSoloStreak.timezone).toEqual(expect.any(String));
        const currentStreak = updatedSoloStreak.currentStreak;
        expect(currentStreak.numberOfDaysInARow).toEqual(1);
        expect(currentStreak.startDate).toEqual(expect.any(String));
        expect(Object.keys(currentStreak)).toEqual(['startDate', 'numberOfDaysInARow']);
        expect(updatedSoloStreak._id).toEqual(expect.any(String));
        expect(updatedSoloStreak.createdAt).toEqual(expect.any(String));
        expect(updatedSoloStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(updatedSoloStreak).sort()).toEqual(correctSoloStreakKeys);
    });

    test('if solo streak current streak is longer than the soloStreaks longestSoloStreak update the users longestSoloStreak to be the current solo streak.', async () => {
        expect.assertions(5);

        const user = await getPayingUser({ testName });
        const userId = user._id;
        const streakName = 'Daily Spanish';
        const streakDescription = 'Everyday I must study Spanish';

        const soloStreak = await SDK.soloStreaks.create({ userId, streakName, streakDescription });
        const soloStreakId = soloStreak._id;

        await SDK.completeSoloStreakTasks.create({
            userId,
            soloStreakId,
        });

        const maintainedSoloStreaks = await SDK.soloStreaks.getAll({
            completedToday: true,
            userId,
        });

        await trackMaintainedSoloStreaks(maintainedSoloStreaks);

        const updatedSoloStreak = await SDK.soloStreaks.getOne(soloStreak._id);

        const longestSoloStreak = updatedSoloStreak.longestSoloStreak as LongestEverSoloStreak;

        expect(longestSoloStreak.soloStreakId).toEqual(soloStreak._id);
        expect(longestSoloStreak.soloStreakName).toEqual(soloStreak.streakName);
        expect(longestSoloStreak.numberOfDays).toEqual(updatedSoloStreak.currentStreak.numberOfDaysInARow);
        expect(longestSoloStreak.startDate).toEqual(updatedSoloStreak.currentStreak.startDate);
        expect(longestSoloStreak.streakType).toEqual(StreakTypes.solo);
    });

    test('if solo streak current streak is longer than the users longest ever streak update the users longest ever streak to be the current solo streak.', async () => {
        expect.assertions(5);

        const user = await getPayingUser({ testName });
        const userId = user._id;
        const streakName = 'Daily Spanish';
        const streakDescription = 'Everyday I must study Spanish';

        const soloStreak = await SDK.soloStreaks.create({ userId, streakName, streakDescription });
        const soloStreakId = soloStreak._id;

        await SDK.completeSoloStreakTasks.create({
            userId,
            soloStreakId,
        });

        const maintainedSoloStreaks = await SDK.soloStreaks.getAll({
            completedToday: true,
            userId,
        });

        await trackMaintainedSoloStreaks(maintainedSoloStreaks);

        const updatedUser = await SDK.user.getCurrentUser();
        const updatedSoloStreak = await SDK.soloStreaks.getOne(soloStreak._id);

        const longestEverStreak = updatedUser.longestEverStreak as LongestEverSoloStreak;

        expect(longestEverStreak.soloStreakId).toEqual(soloStreak._id);
        expect(longestEverStreak.soloStreakName).toEqual(soloStreak.streakName);
        expect(longestEverStreak.numberOfDays).toEqual(updatedSoloStreak.currentStreak.numberOfDaysInARow);
        expect(longestEverStreak.startDate).toEqual(updatedSoloStreak.currentStreak.startDate);
        expect(longestEverStreak.streakType).toEqual(StreakTypes.solo);
    });

    test('if solo streak current streak is longer than the users longest current streak update the users longest current streak to be the current solo streak.', async () => {
        expect.assertions(5);

        const user = await getPayingUser({ testName });
        const userId = user._id;
        const streakName = 'Daily Spanish';
        const streakDescription = 'Everyday I must study Spanish';

        const soloStreak = await SDK.soloStreaks.create({ userId, streakName, streakDescription });
        const soloStreakId = soloStreak._id;

        await SDK.completeSoloStreakTasks.create({
            userId,
            soloStreakId,
        });

        const maintainedSoloStreaks = await SDK.soloStreaks.getAll({
            completedToday: true,
            userId,
        });

        await trackMaintainedSoloStreaks(maintainedSoloStreaks);

        const updatedUser = await SDK.user.getCurrentUser();
        const updatedSoloStreak = await SDK.soloStreaks.getOne(soloStreak._id);

        const longestCurrentStreak = updatedUser.longestCurrentStreak as LongestCurrentSoloStreak;

        expect(longestCurrentStreak.soloStreakId).toEqual(soloStreak._id);
        expect(longestCurrentStreak.soloStreakName).toEqual(soloStreak.streakName);
        expect(longestCurrentStreak.numberOfDays).toEqual(updatedSoloStreak.currentStreak.numberOfDaysInARow);
        expect(longestCurrentStreak.startDate).toEqual(updatedSoloStreak.currentStreak.startDate);
        expect(longestCurrentStreak.streakType).toEqual(StreakTypes.solo);
    });

    test('if solo streak current streak is longer than the users longest solo streak update the users longest solo streak to be the current solo streak.', async () => {
        expect.assertions(5);

        const user = await getPayingUser({ testName });
        const userId = user._id;
        const streakName = 'Daily Spanish';
        const streakDescription = 'Everyday I must study Spanish';

        const soloStreak = await SDK.soloStreaks.create({ userId, streakName, streakDescription });
        const soloStreakId = soloStreak._id;

        await SDK.completeSoloStreakTasks.create({
            userId,
            soloStreakId,
        });

        const maintainedSoloStreaks = await SDK.soloStreaks.getAll({
            completedToday: true,
            userId,
        });

        await trackMaintainedSoloStreaks(maintainedSoloStreaks);

        const updatedUser = await SDK.user.getCurrentUser();
        const updatedSoloStreak = await SDK.soloStreaks.getOne(soloStreak._id);

        const longestSoloStreak = updatedUser.longestSoloStreak as LongestEverSoloStreak;

        expect(longestSoloStreak.soloStreakId).toEqual(soloStreak._id);
        expect(longestSoloStreak.soloStreakName).toEqual(soloStreak.streakName);
        expect(longestSoloStreak.numberOfDays).toEqual(updatedSoloStreak.currentStreak.numberOfDaysInARow);
        expect(longestSoloStreak.startDate).toEqual(updatedSoloStreak.currentStreak.startDate);
        expect(longestSoloStreak.streakType).toEqual(StreakTypes.solo);
    });

    test('creates a maintainedStreak streak tracking event', async () => {
        expect.assertions(8);

        const user = await getPayingUser({ testName });
        const userId = user._id;
        const streakName = 'Daily Spanish';
        const streakDescription = 'Everyday I must study Spanish';

        const soloStreak = await SDK.soloStreaks.create({ userId, streakName, streakDescription });
        const soloStreakId = soloStreak._id;

        await SDK.completeSoloStreakTasks.create({
            userId,
            soloStreakId,
        });

        const maintainedSoloStreaks = await SDK.soloStreaks.getAll({
            completedToday: true,
            userId,
        });

        await trackMaintainedSoloStreaks(maintainedSoloStreaks);

        const streakTrackingEvents = await SDK.streakTrackingEvents.getAll({
            userId,
        });
        const streakTrackingEvent = streakTrackingEvents[0];

        expect(streakTrackingEvent.type).toEqual(StreakTrackingEventTypes.maintainedStreak);
        expect(streakTrackingEvent.userId).toBeDefined();
        expect(streakTrackingEvent.streakId).toBeDefined();
        expect(streakTrackingEvent.streakType).toEqual(StreakTypes.solo);
        expect(streakTrackingEvent._id).toEqual(expect.any(String));
        expect(streakTrackingEvent.createdAt).toEqual(expect.any(String));
        expect(streakTrackingEvent.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(streakTrackingEvent).sort()).toEqual(
            ['_id', 'type', 'streakId', 'streakType', 'userId', 'createdAt', 'updatedAt', '__v'].sort(),
        );
    });
});
