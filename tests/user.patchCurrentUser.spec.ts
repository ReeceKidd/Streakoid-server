import { getPayingUser } from './setup/getPayingUser';
import { isTestEnvironment } from './setup/isTestEnvironment';
import { setupDatabase } from './setup/setupDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import { getFriend } from './setup/getFriend';
import UserTypes from '@streakoid/streakoid-models/lib/Types/UserTypes';
import AchievementTypes from '@streakoid/streakoid-models/lib/Types/AchievementTypes';

import { correctPopulatedCurrentUserKeys } from '../src/testHelpers/correctPopulatedCurrentUserKeys';
import { Mongoose } from 'mongoose';
import { StreakoidSDK } from '@streakoid/streakoid-sdk/lib/streakoidSDKFactory';
import { streakoidTestSDK } from './setup/streakoidTestSDK';
import { disconnectDatabase } from './setup/disconnectDatabase';
import { getServiceConfig } from '../src/getServiceConfig';
import WhyDoYouWantToBuildNewHabitsTypes from '@streakoid/streakoid-models/lib/Types/WhyDoYouWantToBuildNewHabitsTypes';

jest.setTimeout(120000);

const testName = 'PATCH-user';

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

    test(`that all available keys can be patched except push notification token`, async () => {
        expect.assertions(35);

        await getPayingUser({ testName });

        const updatedEmail = 'email@gmail.com';
        const updatedUsername = 'updated';
        const updatedFirstName = 'Tom';
        const updatedLastName = 'Smith';
        const updatedTimezone = 'Europe/Paris';

        const updatedUser = await SDK.user.updateCurrentUser({
            updateData: {
                email: updatedEmail,
                username: updatedUsername,
                firstName: updatedFirstName,
                lastName: updatedLastName,
                hasUsernameBeenCustomized: true,
                timezone: updatedTimezone,
                hasCompletedIntroduction: true,
                hasProfileImageBeenCustomized: true,
                hasCompletedOnboarding: true,
                hasCompletedTutorial: true,
                onboarding: {
                    whyDoYouWantToBuildNewHabitsChoice: WhyDoYouWantToBuildNewHabitsTypes.health,
                },
            },
        });

        expect(updatedUser._id).toEqual(expect.any(String));
        expect(updatedUser.email).toEqual(updatedEmail);
        expect(updatedUser.username).toEqual(updatedUsername);
        expect(updatedUser.firstName).toEqual(updatedFirstName);
        expect(updatedUser.lastName).toEqual(updatedLastName);
        expect(updatedUser.hasUsernameBeenCustomized).toEqual(true);
        expect(updatedUser.userType).toEqual(UserTypes.temporary);
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
            androidToken: null,
            androidEndpointArn: null,
            iosToken: null,
            iosEndpointArn: null,
        });
        expect(updatedUser.hasProfileImageBeenCustomized).toEqual(true);
        expect(updatedUser.hasCompletedTutorial).toEqual(true);
        expect(updatedUser.hasCompletedOnboarding).toEqual(true);
        expect(updatedUser.hasCompletedIntroduction).toEqual(true);
        expect(updatedUser.onboarding.whyDoYouWantToBuildNewHabitsChoice).toEqual(
            WhyDoYouWantToBuildNewHabitsTypes.health,
        );
        expect(updatedUser.createdAt).toEqual(expect.any(String));
        expect(updatedUser.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(updatedUser).sort()).toEqual(correctPopulatedCurrentUserKeys);
    });

    test(`if current user is following a user it returns the a populated following list`, async () => {
        expect.assertions(6);

        const { _id } = await getPayingUser({ testName });
        const userId = _id;

        const friend = await getFriend({ testName });

        await SDK.users.following.followUser({ userId, userToFollowId: friend._id });

        const updateData = {
            hasCompletedIntroduction: true,
        };

        const user = await SDK.user.updateCurrentUser({ updateData });

        expect(user.following.length).toEqual(1);

        const following = user.following[0];

        expect(following.username).toEqual(expect.any(String));
        expect(following.userId).toEqual(expect.any(String));
        expect(following.profileImage).toEqual(expect.any(String));
        expect(Object.keys(following).sort()).toEqual(['userId', 'username', 'profileImage'].sort());

        expect(Object.keys(user).sort()).toEqual(correctPopulatedCurrentUserKeys);
    });

    test(`if current user has a follower a user it returns the a populated follower list after an update.`, async () => {
        expect.assertions(6);

        const { _id } = await getPayingUser({ testName });
        const userId = _id;

        const friend = await getFriend({ testName });

        await SDK.users.following.followUser({ userId: friend._id, userToFollowId: userId });

        const user = await SDK.user.updateCurrentUser({ updateData: { timezone: 'Europe/France' } });

        expect(user.followers.length).toEqual(1);

        const follower = user.followers[0];
        expect(follower.username).toEqual(expect.any(String));
        expect(follower.userId).toEqual(expect.any(String));
        expect(follower.profileImage).toEqual(expect.any(String));
        expect(Object.keys(follower).sort()).toEqual(['userId', 'username', 'profileImage'].sort());

        expect(Object.keys(user).sort()).toEqual(correctPopulatedCurrentUserKeys);
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

        const user = await SDK.user.updateCurrentUser({ updateData: { timezone: 'Europe/France' } });

        expect(user.achievements.length).toEqual(1);

        const achievement = user.achievements[0];
        expect(achievement.achievementType).toEqual(AchievementTypes.oneHundredDaySoloStreak);
        expect(achievement.name).toEqual(achievementName);
        expect(achievement.description).toEqual(achievementDescription);
        expect(Object.keys(achievement).sort()).toEqual(
            ['_id', 'achievementType', 'name', 'description', 'createdAt', 'updatedAt', '__v'].sort(),
        );

        expect(Object.keys(user).sort()).toEqual(correctPopulatedCurrentUserKeys);
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

    test('fails because userType can not be set to admin via this route', async () => {
        expect.assertions(2);
        try {
            await getPayingUser({ testName });
            await SDK.user.updateCurrentUser({ updateData: { userType: UserTypes.admin } });
        } catch (err) {
            const error = JSON.parse(err.text);
            const { message } = error;
            expect(err.status).toEqual(422);
            expect(message).toEqual('child "userType" fails because ["userType" must be one of [basic]]');
        }
    });
});
