import { resetIncompleteSoloStreaks } from '../../../src/Agenda/SoloStreaks/resetIncompleteSoloStreaks';

import { isTestEnvironment } from '../../../tests/setup/isTestEnvironment';
import { setupDatabase } from '../../setup/setupDatabase';
import { getPayingUser } from '../../setup/getPayingUser';
import { tearDownDatabase } from '../../setup/tearDownDatabase';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
import StreakTrackingEventTypes from '@streakoid/streakoid-models/lib/Types/StreakTrackingEventTypes';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
import ActivityFeedItemTypes from '@streakoid/streakoid-models/lib/Types/ActivityFeedItemTypes';
import { Mongoose } from 'mongoose';
import { disconnectDatabase } from '../../setup/disconnectDatabase';
import { StreakoidSDK } from '@streakoid/streakoid-sdk/lib/streakoidSDKFactory';
import { streakoidTestSDK } from '../../setup/streakoidTestSDK';
import { correctSoloStreakKeys } from '../../../src/testHelpers/correctSoloStreakKeys';
import { userModel } from '../../../src/Models/User';
import { LongestCurrentSoloStreak } from '@streakoid/streakoid-models/lib/Models/LongestCurrentSoloStreak';
import { LongestEverSoloStreak } from '@streakoid/streakoid-models/lib/Models/LongestEverSoloStreak';

jest.setTimeout(120000);

const testName = 'resetIncompleteSoloStreaks';

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

    test('adds current streak to past streak and resets the current streak', async () => {
        expect.assertions(18);

        const user = await getPayingUser({ testName });
        const streakName = 'Daily Spanish';

        const soloStreak = await SDK.soloStreaks.create({ userId: user._id, streakName });

        const soloStreakId = soloStreak._id;

        const incompleteSoloStreaks = await SDK.soloStreaks.getAll({
            userId: user._id,
            completedToday: false,
        });

        const endDate = new Date();
        await resetIncompleteSoloStreaks(incompleteSoloStreaks, endDate.toString());

        const updatedSoloStreak = await SDK.soloStreaks.getOne(soloStreakId);

        expect(updatedSoloStreak.streakName).toEqual(streakName);
        expect(updatedSoloStreak.status).toEqual(StreakStatus.live);
        expect(updatedSoloStreak.userId).toEqual(expect.any(String));
        expect(updatedSoloStreak.completedToday).toEqual(false);
        expect(updatedSoloStreak.active).toEqual(false);
        expect(updatedSoloStreak.pastStreaks.length).toEqual(1);
        const pastStreak = updatedSoloStreak.pastStreaks[0];
        expect(pastStreak.endDate).toEqual(expect.any(String));
        expect(pastStreak.numberOfDaysInARow).toEqual(0);
        expect(pastStreak.startDate).toEqual(expect.any(String));
        expect(Object.keys(pastStreak).sort()).toEqual(['endDate', 'numberOfDaysInARow', 'startDate'].sort());
        expect(updatedSoloStreak.timezone).toEqual(expect.any(String));
        const currentStreak = updatedSoloStreak.currentStreak;
        expect(currentStreak.numberOfDaysInARow).toEqual(0);
        expect(currentStreak.startDate).toEqual(null);
        expect(Object.keys(currentStreak)).toEqual(['startDate', 'numberOfDaysInARow']);
        expect(updatedSoloStreak._id).toEqual(expect.any(String));
        expect(updatedSoloStreak.createdAt).toEqual(expect.any(String));
        expect(updatedSoloStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(updatedSoloStreak).sort()).toEqual(correctSoloStreakKeys);
    });

    test('if longest current streak id is equal to the solo streak id sets the users longestCurrentStreak to the default longestCurrentStreak. ', async () => {
        expect.assertions(1);

        const user = await getPayingUser({ testName });
        const streakName = 'Daily Spanish';

        const soloStreak = await SDK.soloStreaks.create({ userId: user._id, streakName });

        const longestSoloStreak: LongestCurrentSoloStreak = {
            soloStreakId: soloStreak._id,
            soloStreakName: soloStreak.streakName,
            numberOfDays: 10,
            startDate: new Date().toString(),
            streakType: StreakTypes.solo,
        };

        await userModel.findByIdAndUpdate(user._id, { $set: { longestCurrentStreak: longestSoloStreak } });

        const incompleteSoloStreaks = await SDK.soloStreaks.getAll({
            userId: user._id,
            completedToday: false,
        });

        const endDate = new Date();
        await resetIncompleteSoloStreaks(incompleteSoloStreaks, endDate.toString());

        const updatedUser = await SDK.user.getCurrentUser();
        expect(updatedUser.longestCurrentStreak).toEqual({ numberOfDays: 0, streakType: StreakTypes.unknown });
    });

    test('if the users longest ever streak id is equal to the solo streak id sets the users longestEverStreak to the default longestEverStreak. ', async () => {
        expect.assertions(1);

        const user = await getPayingUser({ testName });
        const streakName = 'Daily Spanish';

        const soloStreak = await SDK.soloStreaks.create({ userId: user._id, streakName });

        const longestEverStreak: LongestEverSoloStreak = {
            soloStreakId: soloStreak._id,
            soloStreakName: soloStreak.streakName,
            numberOfDays: 10,
            startDate: new Date().toString(),
            streakType: StreakTypes.solo,
        };

        await userModel.findByIdAndUpdate(user._id, { $set: { longestEverStreak } });

        const incompleteSoloStreaks = await SDK.soloStreaks.getAll({
            userId: user._id,
            completedToday: false,
        });

        const endDate = new Date();
        await resetIncompleteSoloStreaks(incompleteSoloStreaks, endDate.toString());

        const updatedUser = await SDK.user.getCurrentUser();

        const updatedLongestEverStreak = updatedUser.longestEverStreak as LongestEverSoloStreak;
        expect(updatedLongestEverStreak.endDate).toBeDefined();
    });

    test('creates a lost streak tracking event.', async () => {
        expect.assertions(8);

        const user = await getPayingUser({ testName });
        const streakName = 'Daily Spanish';
        const userId = user._id;

        await SDK.soloStreaks.create({ userId, streakName });

        const incompleteSoloStreaks = await SDK.soloStreaks.getAll({
            userId,
            completedToday: false,
        });

        const endDate = new Date();
        await resetIncompleteSoloStreaks(incompleteSoloStreaks, endDate.toString());

        const streakTrackingEvents = await SDK.streakTrackingEvents.getAll({
            userId,
        });
        const streakTrackingEvent = streakTrackingEvents[0];

        expect(streakTrackingEvent.type).toEqual(StreakTrackingEventTypes.lostStreak);
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

    test('creates a lost streak activity feed item.', async () => {
        expect.assertions(8);

        const user = await getPayingUser({ testName });
        const streakName = 'Daily Spanish';
        const userId = user._id;
        const username = user.username || '';
        const userProfileImage = user.profileImages.originalImageUrl;

        const soloStreak = await SDK.soloStreaks.create({ userId, streakName });

        const incompleteSoloStreaks = await SDK.soloStreaks.getAll({
            userId,
            completedToday: false,
        });

        const endDate = new Date();
        await resetIncompleteSoloStreaks(incompleteSoloStreaks, endDate.toString());

        const lostSoloStreakActivityFeedItems = await SDK.activityFeedItems.getAll({
            activityFeedItemType: ActivityFeedItemTypes.lostSoloStreak,
        });
        const lostSoloStreakActivityFeedItem = lostSoloStreakActivityFeedItems.activityFeedItems[0];
        if (lostSoloStreakActivityFeedItem.activityFeedItemType === ActivityFeedItemTypes.lostSoloStreak) {
            expect(lostSoloStreakActivityFeedItem.activityFeedItemType).toEqual(ActivityFeedItemTypes.lostSoloStreak);
            expect(lostSoloStreakActivityFeedItem.userId).toEqual(String(userId));
            expect(lostSoloStreakActivityFeedItem.username).toEqual(String(username));
            expect(lostSoloStreakActivityFeedItem.userProfileImage).toEqual(String(userProfileImage));
            expect(lostSoloStreakActivityFeedItem.soloStreakId).toEqual(String(soloStreak._id));
            expect(lostSoloStreakActivityFeedItem.soloStreakName).toEqual(String(soloStreak.streakName));
            expect(lostSoloStreakActivityFeedItem.numberOfDaysLost).toEqual(expect.any(Number));
            expect(Object.keys(lostSoloStreakActivityFeedItem).sort()).toEqual(
                [
                    '_id',
                    'activityFeedItemType',
                    'soloStreakId',
                    'soloStreakName',
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
