import { trackMaintainedChallengeStreaks } from '.../../../src/Agenda/ChallengeStreaks/trackMaintainedChallengeStreaks';
import { isTestEnvironment } from '../../../tests/setup/isTestEnvironment';
import { setupDatabase } from '../../setup/setupDatabase';
import { tearDownDatabase } from '../../../tests/setup/tearDownDatabase';
import { getPayingUser } from '../../setup/getPayingUser';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
import StreakTrackingEventTypes from '@streakoid/streakoid-models/lib/Types/StreakTrackingEventTypes';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
import { Mongoose } from 'mongoose';
import { disconnectDatabase } from '../../setup/disconnectDatabase';
import { StreakoidSDK } from '@streakoid/streakoid-sdk/lib/streakoidSDKFactory';
import { streakoidTestSDK } from '../../setup/streakoidTestSDK';
import { correctChallengeStreakKeys } from '../../../src/testHelpers/correctChallengeStreakKeys';
import { LongestEverChallengeStreak } from '@streakoid/streakoid-models/lib/Models/LongestEverChallengeStreak';
import { LongestCurrentChallengeStreak } from '@streakoid/streakoid-models/lib/Models/LongestCurrentChallengeStreak';

jest.setTimeout(120000);

const testName = 'trackMaintainedChallengeStreak';

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

    test('updates challenge streak completedToday field.', async () => {
        expect.assertions(14);

        const user = await getPayingUser({ testName });
        const userId = user._id;
        const name = 'Duolingo';
        const description = 'Everyday I must complete a duolingo lesson';
        const icon = 'duolingo';
        const { challenge } = await SDK.challenges.create({
            name,
            description,
            icon,
        });
        const challengeStreak = await SDK.challengeStreaks.create({
            userId,
            challengeId: challenge._id,
        });
        const challengeStreakId = challengeStreak._id;

        await SDK.completeChallengeStreakTasks.create({
            userId,
            challengeStreakId,
        });

        const maintainedChallengeStreaks = await SDK.challengeStreaks.getAll({
            completedToday: true,
        });

        await trackMaintainedChallengeStreaks(maintainedChallengeStreaks);

        const updatedChallengeStreak = await SDK.challengeStreaks.getOne({ challengeStreakId });

        expect(updatedChallengeStreak.status).toEqual(StreakStatus.live);
        expect(updatedChallengeStreak.userId).toBeDefined();
        expect(updatedChallengeStreak.challengeId).toBeDefined();
        expect(updatedChallengeStreak.completedToday).toEqual(false);
        expect(updatedChallengeStreak.active).toEqual(true);
        expect(updatedChallengeStreak.pastStreaks.length).toEqual(0);
        expect(updatedChallengeStreak.timezone).toEqual(expect.any(String));
        const currentStreak = updatedChallengeStreak.currentStreak;
        expect(currentStreak.numberOfDaysInARow).toEqual(1);
        expect(currentStreak.startDate).toEqual(expect.any(String));
        expect(Object.keys(currentStreak)).toEqual(['startDate', 'numberOfDaysInARow']);
        expect(updatedChallengeStreak._id).toEqual(expect.any(String));
        expect(updatedChallengeStreak.createdAt).toEqual(expect.any(String));
        expect(updatedChallengeStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(updatedChallengeStreak).sort()).toEqual(correctChallengeStreakKeys);
    });

    test('if challenge streak current streak is longer than the challenge streaks longest challenge streak it updates the challenge streaks longest challenge streak to be the current challenge streak.', async () => {
        expect.assertions(6);

        const user = await getPayingUser({ testName });
        const userId = user._id;

        const name = 'Duolingo';
        const description = 'Everyday I must complete a duolingo lesson';
        const icon = 'duolingo';
        const { challenge } = await SDK.challenges.create({
            name,
            description,
            icon,
        });

        const challengeStreak = await SDK.challengeStreaks.create({ userId, challengeId: challenge._id });
        const challengeStreakId = challengeStreak._id;

        await SDK.completeChallengeStreakTasks.create({
            userId,
            challengeStreakId,
        });

        const maintainedChallengeStreaks = await SDK.challengeStreaks.getAll({
            completedToday: true,
            userId,
        });

        await trackMaintainedChallengeStreaks(maintainedChallengeStreaks);

        const updatedChallengeStreak = await SDK.challengeStreaks.getOne({ challengeStreakId: challengeStreak._id });

        const longestChallengeStreak = updatedChallengeStreak.longestChallengeStreak as LongestEverChallengeStreak;

        expect(longestChallengeStreak.challengeStreakId).toEqual(challengeStreak._id);
        expect(longestChallengeStreak.challengeId).toEqual(challengeStreak.challengeId);
        expect(longestChallengeStreak.challengeName).toEqual(challengeStreak.challengeName);
        expect(longestChallengeStreak.numberOfDays).toEqual(updatedChallengeStreak.currentStreak.numberOfDaysInARow);
        expect(longestChallengeStreak.startDate).toEqual(updatedChallengeStreak.currentStreak.startDate);
        expect(longestChallengeStreak.streakType).toEqual(StreakTypes.challenge);
    });

    test('if challenge streak current streak is longer than the users longest ever streak update the users longest ever streak to be the current challenge streak.', async () => {
        expect.assertions(6);

        const user = await getPayingUser({ testName });
        const userId = user._id;

        const name = 'Duolingo';
        const description = 'Everyday I must complete a duolingo lesson';
        const icon = 'duolingo';
        const { challenge } = await SDK.challenges.create({
            name,
            description,
            icon,
        });

        const challengeStreak = await SDK.challengeStreaks.create({ userId, challengeId: challenge._id });
        const challengeStreakId = challengeStreak._id;

        await SDK.completeChallengeStreakTasks.create({
            userId,
            challengeStreakId,
        });

        const maintainedChallengeStreaks = await SDK.challengeStreaks.getAll({
            completedToday: true,
            userId,
        });

        await trackMaintainedChallengeStreaks(maintainedChallengeStreaks);

        const updatedUser = await SDK.user.getCurrentUser();
        const updatedChallengeStreak = await SDK.challengeStreaks.getOne({ challengeStreakId: challengeStreak._id });

        const longestEverStreak = updatedUser.longestEverStreak as LongestEverChallengeStreak;

        expect(longestEverStreak.challengeStreakId).toEqual(challengeStreak._id);
        expect(longestEverStreak.challengeId).toEqual(challengeStreak.challengeId);
        expect(longestEverStreak.challengeName).toEqual(challengeStreak.challengeName);
        expect(longestEverStreak.numberOfDays).toEqual(updatedChallengeStreak.currentStreak.numberOfDaysInARow);
        expect(longestEverStreak.startDate).toEqual(updatedChallengeStreak.currentStreak.startDate);
        expect(longestEverStreak.streakType).toEqual(StreakTypes.challenge);
    });

    test('if challenge streak current streak is longer than the users longest current streak it update the users longest current streak to be the current challenge streak.', async () => {
        expect.assertions(5);

        const user = await getPayingUser({ testName });
        const userId = user._id;

        const name = 'Duolingo';
        const description = 'Everyday I must complete a duolingo lesson';
        const icon = 'duolingo';
        const { challenge } = await SDK.challenges.create({
            name,
            description,
            icon,
        });

        const challengeStreak = await SDK.challengeStreaks.create({ userId, challengeId: challenge._id });
        const challengeStreakId = challengeStreak._id;

        await SDK.completeChallengeStreakTasks.create({
            userId,
            challengeStreakId,
        });

        const maintainedChallengeStreaks = await SDK.challengeStreaks.getAll({
            completedToday: true,
            userId,
        });

        await trackMaintainedChallengeStreaks(maintainedChallengeStreaks);

        const updatedUser = await SDK.user.getCurrentUser();
        const updatedChallengeStreak = await SDK.challengeStreaks.getOne({ challengeStreakId: challengeStreak._id });

        const longestCurrentStreak = updatedUser.longestCurrentStreak as LongestCurrentChallengeStreak;

        expect(longestCurrentStreak.challengeStreakId).toEqual(challengeStreak._id);
        expect(longestCurrentStreak.challengeId).toEqual(challengeStreak.challengeId);
        expect(longestCurrentStreak.challengeName).toEqual(challengeStreak.challengeName);
        expect(longestCurrentStreak.numberOfDays).toEqual(updatedChallengeStreak.currentStreak.numberOfDaysInARow);
        expect(longestCurrentStreak.startDate).toEqual(updatedChallengeStreak.currentStreak.startDate);
    });

    test('if challenge streak current streak is longer than the users longest challenge streak it update the users longest challenge streak to be the current challenge streak.', async () => {
        expect.assertions(5);

        const user = await getPayingUser({ testName });
        const userId = user._id;

        const name = 'Duolingo';
        const description = 'Everyday I must complete a duolingo lesson';
        const icon = 'duolingo';
        const { challenge } = await SDK.challenges.create({
            name,
            description,
            icon,
        });

        const challengeStreak = await SDK.challengeStreaks.create({ userId, challengeId: challenge._id });
        const challengeStreakId = challengeStreak._id;

        await SDK.completeChallengeStreakTasks.create({
            userId,
            challengeStreakId,
        });

        const maintainedChallengeStreaks = await SDK.challengeStreaks.getAll({
            completedToday: true,
            userId,
        });

        await trackMaintainedChallengeStreaks(maintainedChallengeStreaks);

        const updatedUser = await SDK.user.getCurrentUser();
        const updatedChallengeStreak = await SDK.challengeStreaks.getOne({ challengeStreakId: challengeStreak._id });

        const longestChallengeStreak = updatedUser.longestCurrentStreak as LongestCurrentChallengeStreak;

        expect(longestChallengeStreak.challengeStreakId).toEqual(challengeStreak._id);
        expect(longestChallengeStreak.challengeId).toEqual(challengeStreak.challengeId);
        expect(longestChallengeStreak.challengeName).toEqual(challengeStreak.challengeName);
        expect(longestChallengeStreak.numberOfDays).toEqual(updatedChallengeStreak.currentStreak.numberOfDaysInARow);
        expect(longestChallengeStreak.startDate).toEqual(updatedChallengeStreak.currentStreak.startDate);
    });

    test('creates a maintained streak tracking event.', async () => {
        expect.assertions(8);

        const user = await getPayingUser({ testName });
        const userId = user._id;
        const name = 'Duolingo';
        const description = 'Everyday I must complete a duolingo lesson';
        const icon = 'duolingo';
        const { challenge } = await SDK.challenges.create({
            name,
            description,
            icon,
        });
        const challengeStreak = await SDK.challengeStreaks.create({
            userId,
            challengeId: challenge._id,
        });
        const challengeStreakId = challengeStreak._id;

        await SDK.completeChallengeStreakTasks.create({
            userId,
            challengeStreakId,
        });

        const maintainedChallengeStreaks = await SDK.challengeStreaks.getAll({
            completedToday: true,
        });

        await trackMaintainedChallengeStreaks(maintainedChallengeStreaks);

        const streakTrackingEvents = await SDK.streakTrackingEvents.getAll({
            userId,
        });
        const streakTrackingEvent = streakTrackingEvents[0];

        expect(streakTrackingEvent.type).toEqual(StreakTrackingEventTypes.maintainedStreak);
        expect(streakTrackingEvent.userId).toBeDefined();
        expect(streakTrackingEvent.streakId).toBeDefined();
        expect(streakTrackingEvent.streakType).toEqual(StreakTypes.challenge);
        expect(streakTrackingEvent._id).toEqual(expect.any(String));
        expect(streakTrackingEvent.createdAt).toEqual(expect.any(String));
        expect(streakTrackingEvent.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(streakTrackingEvent).sort()).toEqual(
            ['_id', 'type', 'streakId', 'streakType', 'userId', 'createdAt', 'updatedAt', '__v'].sort(),
        );
    });
});
