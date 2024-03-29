import UserTypes from '@streakoid/streakoid-models/lib/Types/UserTypes';
import StreakReminderTypes from '@streakoid/streakoid-models/lib/Types/StreakReminderTypes';
import WhyDoYouWantToBuildNewHabitsTypes from '@streakoid/streakoid-models/lib/Types/WhyDoYouWantToBuildNewHabitsTypes';
import { User } from '@streakoid/streakoid-models/lib/Models/User';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';

export const getMockUser = ({ _id }: { _id: string }): User => ({
    _id,
    username: 'username',
    cognitoUsername: 'username',
    hasUsernameBeenCustomized: false,
    userIdentifier: 'userIdentifier',
    membershipInformation: {
        isPayingMember: true,
        currentMembershipStartDate: new Date(),
        pastMemberships: [],
    },
    email: 'test@test.com',
    temporaryPassword: '12345',
    oidXp: 0,
    coins: 0,
    totalCoins: 0,
    createdAt: 'Jan 1st',
    updatedAt: 'Jan 1st',
    timezone: 'Europe/London',
    userType: UserTypes.basic,
    totalStreakCompletes: 10,
    totalLiveStreaks: 0,
    followers: [],
    following: [],
    profileImages: {
        originalImageUrl: 'https://streakoid-profile-pictures.s3-eu-west-1.amazonaws.com/steve.jpg',
    },
    hasProfileImageBeenCustomized: false,
    pushNotification: {
        androidToken: 'token',
        iosToken: 'iosToken',
        androidEndpointArn: 'androidEndpointArn',
        iosEndpointArn: 'iosEndpointArn',
    },
    pushNotifications: {
        completeAllStreaksReminder: {
            enabled: true,
            expoId: 'expoId',
            reminderHour: 10,
            reminderMinute: 15,
            streakReminderType: StreakReminderTypes.completeAllStreaksReminder,
        },
        teamStreakUpdates: {
            enabled: true,
        },
        newFollowerUpdates: {
            enabled: true,
        },
        achievementUpdates: {
            enabled: true,
        },
        customStreakReminders: [],
    },
    hasCompletedIntroduction: true,
    hasCompletedTutorial: false,
    hasVerifiedEmail: true,
    hasCustomPassword: true,
    onboarding: {
        whyDoYouWantToBuildNewHabitsChoice: WhyDoYouWantToBuildNewHabitsTypes.education,
    },
    hasCompletedOnboarding: false,
    stripe: {
        customer: 'abc',
        subscription: 'sub_1',
    },
    achievements: [],
    teamStreaksOrder: [],
    longestSoloStreak: {
        soloStreakId: 'soloStreakId',
        soloStreakName: 'Reading',
        numberOfDays: 0,
        startDate: new Date().toString(),
        endDate: new Date().toString(),
        streakType: StreakTypes.solo,
    },
    longestChallengeStreak: {
        challengeId: 'challengeId',
        challengeName: 'Writing',
        challengeStreakId: 'challengeStreakId',
        numberOfDays: 0,
        startDate: new Date().toString(),
        endDate: new Date().toString(),
        streakType: StreakTypes.challenge,
    },
    longestTeamMemberStreak: {
        teamStreakId: 'teamStreakId',
        teamMemberStreakId: 'teamMemberStreakId',
        teamStreakName: 'Running',
        startDate: new Date().toString(),
        endDate: new Date().toString(),
        numberOfDays: 0,
        streakType: StreakTypes.teamMember,
    },
    longestTeamStreak: {
        teamStreakId: 'teamStreakId',
        members: [],
        numberOfDays: 0,
        startDate: new Date().toString(),
        endDate: new Date().toString(),
        teamStreakName: 'Yoga',
        streakType: StreakTypes.team,
    },
    longestEverStreak: {
        soloStreakId: 'soloStreakId',
        soloStreakName: 'Reading',
        numberOfDays: 0,
        startDate: new Date().toString(),
        endDate: new Date().toString(),
        streakType: StreakTypes.solo,
    },
    longestCurrentStreak: {
        soloStreakId: 'soloStreakId',
        soloStreakName: 'Reading',
        numberOfDays: 0,
        startDate: new Date().toString(),
        streakType: StreakTypes.solo,
    },
});
