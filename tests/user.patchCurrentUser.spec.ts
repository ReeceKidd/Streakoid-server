import { getPayingUser } from './setup/getPayingUser';
import { isTestEnvironment } from './setup/isTestEnvironment';
import { setupDatabase } from './setup/setupDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import { getFriend } from './setup/getFriend';
import UserTypes from '@streakoid/streakoid-models/lib/Types/UserTypes';
import AchievementTypes from '@streakoid/streakoid-models/lib/Types/AchievementTypes';
import PushNotificationSupportedDeviceTypes from '@streakoid/streakoid-models/lib/Types/PushNotificationSupportedDeviceTypes';

const updatedEmail = 'email@gmail.com';
const updatedUsername = 'updated';
const updatedName = 'Tom Smith';
const updatedTimezone = 'Europe/Paris';
const updatedPushNotificationToken = 'push-notification-token';

const updatedHasCompletedIntroduction = true;
const updateData = {
    email: updatedEmail,
    username: updatedUsername,
    name: updatedName,
    timezone: updatedTimezone,
    pushNotificationToken: updatedPushNotificationToken,
    hasCompletedIntroduction: updatedHasCompletedIntroduction,
};

import AWS from 'aws-sdk';
import { hasCorrectPopulatedCurrentUserKeys } from './helpers/hasCorrectPopulatedCurrentUserKeys';
import { Mongoose } from 'mongoose';
import { StreakoidSDK } from '../src/SDK/streakoidSDKFactory';
import { streakoidTestSDKFactory } from '../src/SDK/streakoidTestSDKFactory';
import { disconnectDatabase } from './setup/disconnectDatabase';
import { getServiceConfig } from '../src/getServiceConfig';

const credentials = new AWS.Credentials({
    accessKeyId: getServiceConfig().AWS_ACCESS_KEY_ID,
    secretAccessKey: getServiceConfig().AWS_SECRET_ACCESS_KEY,
});
AWS.config.update({ credentials, region: getServiceConfig().AWS_REGION });
export const SNS = new AWS.SNS({});

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const deleteEndpointAfterTest = async ({ userId, platformArn }: { userId: string; platformArn: string }) => {
    const endpoints = await SNS.listEndpointsByPlatformApplication({
        PlatformApplicationArn: platformArn,
    }).promise();
    const userEndpoint =
        endpoints &&
        endpoints.Endpoints &&
        endpoints.Endpoints.find(
            endpoint => ((endpoint && endpoint.Attributes && endpoint.Attributes.CustomUserData) || '') === userId,
        );

    const endpointToDelete = (userEndpoint && userEndpoint.EndpointArn) || '';
    if (endpointToDelete) {
        return SNS.deleteEndpoint({ EndpointArn: endpointToDelete }).promise();
    }
    return null;
};

jest.setTimeout(120000);

const testName = 'PATCH-user';

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

    test(`that request passes when updatedUser is patched with correct keys`, async () => {
        expect.assertions(31);

        const user = await getPayingUser({ testName });

        const updatedUser = await SDK.user.updateCurrentUser({
            updateData,
        });

        expect(updatedUser._id).toEqual(expect.any(String));
        expect(updatedUser.email).toEqual(updatedEmail);
        expect(updatedUser.username).toEqual(updatedUsername);
        expect(updatedUser.userType).toEqual(UserTypes.basic);
        expect(Object.keys(updatedUser.membershipInformation).sort()).toEqual(
            ['isPayingMember', 'pastMemberships', 'currentMembershipStartDate'].sort(),
        );
        expect(updatedUser.followers).toEqual([]);
        expect(updatedUser.following).toEqual([]);
        expect(updatedUser.totalStreakCompletes).toEqual(0);
        expect(updatedUser.totalLiveStreaks).toEqual(0);
        expect(updatedUser.achievements).toEqual([]);
        expect(updatedUser.membershipInformation.isPayingMember).toEqual(true);
        expect(updatedUser.membershipInformation.pastMemberships).toEqual([]);
        expect(updatedUser.membershipInformation.currentMembershipStartDate).toBeDefined();
        expect(Object.keys(updatedUser.pushNotifications).sort()).toEqual(
            ['newFollowerUpdates', 'teamStreakUpdates', 'customStreakReminders', 'achievementUpdates'].sort(),
        );
        expect(Object.keys(updatedUser.pushNotifications.newFollowerUpdates).sort()).toEqual(['enabled']);
        expect(updatedUser.pushNotifications.newFollowerUpdates.enabled).toEqual(expect.any(Boolean));
        expect(Object.keys(updatedUser.pushNotifications.teamStreakUpdates).sort()).toEqual(['enabled']);
        expect(updatedUser.pushNotifications.teamStreakUpdates.enabled).toEqual(expect.any(Boolean));
        expect(Object.keys(updatedUser.pushNotifications.achievementUpdates).sort()).toEqual(['enabled']);
        expect(updatedUser.pushNotifications.achievementUpdates.enabled).toEqual(expect.any(Boolean));
        expect(updatedUser.pushNotifications.customStreakReminders).toEqual([]);
        expect(updatedUser.timezone).toEqual(updatedTimezone);
        expect(updatedUser.profileImages).toEqual({
            originalImageUrl: 'https://streakoid-profile-pictures.s3-eu-west-1.amazonaws.com/steve.jpg',
        });
        expect(updatedUser.pushNotification).toEqual({
            deviceType: null,
            token: null,
            endpointArn: null,
        });
        expect(user.hasCompletedTutorial).toEqual(false);
        expect(user.onboarding.whatBestDescribesYouChoice).toEqual(null);
        expect(user.onboarding.whyDoYouWantToBuildNewHabitsChoice).toEqual(null);
        expect(user.hasCompletedOnboarding).toEqual(false);
        expect(updatedUser.createdAt).toEqual(expect.any(String));
        expect(updatedUser.updatedAt).toEqual(expect.any(String));
        expect(hasCorrectPopulatedCurrentUserKeys(updatedUser)).toEqual(true);
    });

    test(`if current user updates push notification information on an android device their endpointArn should be defined and pushNotificationToken should be updated.`, async () => {
        expect.assertions(2);

        await getPayingUser({ testName });

        const token = 'token';

        const user = await SDK.user.updateCurrentUser({
            updateData: {
                pushNotification: {
                    token,
                    deviceType: PushNotificationSupportedDeviceTypes.android,
                },
            },
        });

        expect(user.pushNotification).toEqual({
            deviceType: PushNotificationSupportedDeviceTypes.android,
            token,
            endpointArn: expect.any(String),
        });

        expect(hasCorrectPopulatedCurrentUserKeys(user)).toEqual(true);

        await deleteEndpointAfterTest({
            userId: user._id,
            platformArn: 'arn:aws:sns:eu-west-1:932661412733:app/GCM/Firebase',
        });
    });

    test(`if current user updates push notification information on an ios device their endpointArn should be defined and pushNotificationToken should be updated.`, async () => {
        expect.assertions(2);

        await getPayingUser({ testName });

        const token = '740f4707 bebcf74f 9b7c25d4 8e335894 5f6aa01d a5ddb387 462c7eaf 61bb78ad';

        const user = await SDK.user.updateCurrentUser({
            updateData: {
                pushNotification: {
                    token,
                    deviceType: PushNotificationSupportedDeviceTypes.ios,
                },
            },
        });

        expect(user.pushNotification).toEqual({
            token,
            deviceType: PushNotificationSupportedDeviceTypes.ios,
            endpointArn: expect.any(String),
        });

        expect(hasCorrectPopulatedCurrentUserKeys(user)).toEqual(true);

        await deleteEndpointAfterTest({
            userId: user._id,
            platformArn: 'arn:aws:sns:eu-west-1:932661412733:app/APNS/IOS',
        });
    });

    test(`if current user is following a user it returns the a populated following list`, async () => {
        expect.assertions(6);

        const { _id } = await getPayingUser({ testName });
        const userId = _id;

        const friend = await getFriend({ testName });

        await SDK.users.following.followUser({ userId, userToFollowId: friend._id });

        const user = await SDK.user.updateCurrentUser({ updateData });

        expect(user.following.length).toEqual(1);

        const following = user.following[0];

        expect(following.username).toEqual(expect.any(String));
        expect(following.userId).toEqual(expect.any(String));
        expect(following.profileImage).toEqual(expect.any(String));
        expect(Object.keys(following).sort()).toEqual(['userId', 'username', 'profileImage'].sort());

        expect(hasCorrectPopulatedCurrentUserKeys(user)).toEqual(true);
    });

    test(`if current user has a follower a user it returns the a populated follower list after an update.`, async () => {
        expect.assertions(6);

        const { _id } = await getPayingUser({ testName });
        const userId = _id;

        const friend = await getFriend({ testName });

        await SDK.users.following.followUser({ userId: friend._id, userToFollowId: userId });

        const user = await SDK.user.updateCurrentUser({ updateData });

        expect(user.followers.length).toEqual(1);

        const follower = user.followers[0];
        expect(follower.username).toEqual(expect.any(String));
        expect(follower.userId).toEqual(expect.any(String));
        expect(follower.profileImage).toEqual(expect.any(String));
        expect(Object.keys(follower).sort()).toEqual(['userId', 'username', 'profileImage'].sort());

        expect(hasCorrectPopulatedCurrentUserKeys(user)).toEqual(true);
    });

    test(`if current user has an achievement it returns the current user with populated achievements after an update`, async () => {
        expect.assertions(6);

        const { _id } = await getPayingUser({ testName });
        const userId = _id;

        const achievementName = '100 Hundred Days';
        const achievementDescription = '100 Day solo streak';
        await SDK.achievements.create({
            achievementType: AchievementTypes.oneHundredDaySoloStreak,
            name: achievementName,
            description: achievementDescription,
        });

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

        const user = await SDK.user.updateCurrentUser({ updateData });

        expect(user.achievements.length).toEqual(1);

        const achievement = user.achievements[0];
        expect(achievement.achievementType).toEqual(AchievementTypes.oneHundredDaySoloStreak);
        expect(achievement.name).toEqual(achievementName);
        expect(achievement.description).toEqual(achievementDescription);
        expect(Object.keys(achievement).sort()).toEqual(
            ['_id', 'achievementType', 'name', 'description', 'createdAt', 'updatedAt', '__v'].sort(),
        );

        expect(hasCorrectPopulatedCurrentUserKeys(user)).toEqual(true);
    });

    test('fails because email already exists', async () => {
        expect.assertions(3);
        try {
            const email = getServiceConfig().COGNITO_EMAIL;
            await getPayingUser({ testName });
            await SDK.user.updateCurrentUser({ updateData: { email } });
        } catch (err) {
            const error = JSON.parse(err.text);
            const { code, message } = error;
            expect(err.status).toEqual(400);
            expect(code).toEqual('400-102');
            expect(message).toEqual(`Email already exists.`);
        }
    });

    test('fails because username already exists', async () => {
        expect.assertions(3);
        try {
            const username = getServiceConfig().COGNITO_USERNAME;
            await getPayingUser({ testName });
            await SDK.user.updateCurrentUser({ updateData: { username } });
        } catch (err) {
            const error = JSON.parse(err.text);
            const { code, message } = error;
            expect(err.status).toEqual(400);
            expect(code).toEqual('400-103');
            expect(message).toEqual(`Username already exists.`);
        }
    });
});
