/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    sendCurrentUserMiddleware,
    getCurrentUserMiddlewares,
    formatUserMiddleware,
    populateCurrentUserFollowingMiddleware,
    populateCurrentUserFollowersMiddleware,
    getPopulateCurrentUserFollowingMiddleware,
    getPopulateCurrentUserFollowersMiddleware,
    populateCurrentUserAchievementsMiddleware,
    getPopulateCurrentUserAchievementsMiddleware,
} from './getCurrentUser';
import { CustomError } from '../../customError';
import { ErrorType } from '../../customError';
import { User, StreakReminderTypes } from '@streakoid/streakoid-sdk/lib';
import UserTypes from '@streakoid/streakoid-sdk/lib/userTypes';
import UserAchievement from '@streakoid/streakoid-sdk/lib/models/UserAchievement';
import AcheivmentTypes from '@streakoid/streakoid-sdk/lib/AchievementTypes';

describe('populateCurrentUserFollowingMiddleware', () => {
    test('populates user following', async () => {
        expect.assertions(3);
        const request: any = {};
        const user = {
            following: ['userId'],
        };
        const response: any = { locals: { user } };
        const next = jest.fn();

        const lean = jest.fn().mockResolvedValue([{ username: 'username' }]);
        const findById = jest.fn(() => ({ lean }));

        const userModel = {
            findById,
        };

        const middleware = getPopulateCurrentUserFollowingMiddleware(userModel as any);
        await middleware(request, response, next);

        expect(findById).toBeCalledWith(user.following[0]);
        expect(lean).toBeCalled();
        expect(next).toBeCalled();
    });

    test('calls next with PopulateCurrentUserFollowingMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const response: any = {};
        const request: any = {};
        const next = jest.fn();

        const middleware = getPopulateCurrentUserFollowingMiddleware({} as any);
        await middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.PopulateCurrentUserFollowingMiddleware, expect.any(Error)),
        );
    });
});

describe('populateCurrentUserFollowersMiddleware', () => {
    test('populates user following', async () => {
        expect.assertions(3);
        const request: any = {};
        const user = {
            followers: ['userId'],
        };
        const response: any = { locals: { user } };
        const next = jest.fn();

        const lean = jest.fn().mockResolvedValue([{ username: 'username' }]);
        const findById = jest.fn(() => ({ lean }));

        const userModel = {
            findById,
        };

        const middleware = getPopulateCurrentUserFollowersMiddleware(userModel as any);
        await middleware(request, response, next);

        expect(findById).toBeCalledWith(user.followers[0]);
        expect(lean).toBeCalled();
        expect(next).toBeCalled();
    });

    test('calls next with PopulateCurrentUserFollowersMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const response: any = {};
        const request: any = {};
        const next = jest.fn();

        const middleware = getPopulateCurrentUserFollowingMiddleware({} as any);
        await middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.PopulateCurrentUserFollowersMiddleware, expect.any(Error)),
        );
    });
});

describe('populateCurrentUserAchievementsMiddleware', () => {
    test('populates user achievements', async () => {
        expect.assertions(3);
        const request: any = {};
        const userAchievement: UserAchievement = {
            _id: '_id',
            achievementType: AcheivmentTypes.oneHundredDaySoloStreak,
        };
        const user = {
            _id: 'userId',
            achievements: [userAchievement],
        };
        const response: any = { locals: { user } };
        const next = jest.fn();

        const lean = jest.fn().mockResolvedValue(true);
        const findById = jest.fn(() => ({ lean }));

        const achievementModel = {
            findById,
        };

        const middleware = getPopulateCurrentUserAchievementsMiddleware(achievementModel as any);
        await middleware(request, response, next);

        expect(findById).toBeCalledWith(userAchievement._id);
        expect(lean).toBeCalled();
        expect(next).toBeCalled();
    });

    test('calls next with PopulateCurrentUserAchievementsMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const response: any = {};
        const request: any = {};
        const next = jest.fn();

        const middleware = getPopulateCurrentUserAchievementsMiddleware({} as any);
        await middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.PopulateCurrentUserAchievementsMiddleware, expect.any(Error)),
        );
    });
});

describe('formatUserMiddleware', () => {
    test('populates response.locals.user with a formattedUser', () => {
        expect.assertions(2);
        const request: any = {};

        const user: User = {
            _id: '_id',
            username: 'username',
            membershipInformation: {
                isPayingMember: true,
                currentMembershipStartDate: new Date(),
                pastMemberships: [],
            },
            email: 'test@test.com',
            createdAt: 'Jan 1st',
            updatedAt: 'Jan 1st',
            timezone: 'Europe/London',
            userType: UserTypes.basic,
            followers: [],
            following: [],
            friends: [],
            profileImages: {
                originalImageUrl: 'https://streakoid-profile-pictures.s3-eu-west-1.amazonaws.com/steve.jpg',
            },
            pushNotificationToken: 'pushNotifcationToken',
            pushNotifications: {
                completeAllStreaksReminder: {
                    enabled: true,
                    expoId: 'expoId',
                    reminderMinute: 10,
                    reminderHour: 10,
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
            hasCompletedIntroduction: false,
            stripe: {
                customer: 'abc',
                subscription: 'sub_1',
            },
            achievements: [],
        };
        const response: any = { locals: { user } };
        const next = jest.fn();

        formatUserMiddleware(request, response, next);

        expect(next).toBeCalled();
        expect(Object.keys(response.locals.formattedUser).sort()).toEqual(
            [
                '_id',
                'email',
                'username',
                'membershipInformation',
                'userType',
                'followers',
                'following',
                'friends',
                'timezone',
                'createdAt',
                'updatedAt',
                'pushNotificationToken',
                'pushNotifications',
                'hasCompletedIntroduction',
                'profileImages',
                'achievements',
            ].sort(),
        );
    });

    test('calls next with GetCurrentUserFormatUserMiddleware error on middleware failure', () => {
        expect.assertions(1);
        const response: any = {};
        const request: any = {};
        const next = jest.fn();

        formatUserMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.GetCurrentUserFormatUserMiddleware, expect.any(Error)));
    });
});

describe('sendCurrentUserMiddleware', () => {
    test('sends user', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const formattedUser = { _id: 'abc' };
        const request: any = {};
        const response: any = { locals: { formattedUser }, status };
        const next = jest.fn();

        sendCurrentUserMiddleware(request, response, next);

        expect(next).not.toBeCalled();
        expect(status).toBeCalledWith(200);
        expect(send).toBeCalledWith(formattedUser);
    });

    test('calls next with SendRetreiveUserResponseMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const error = 'error';
        const send = jest.fn(() => Promise.reject(error));
        const status = jest.fn(() => ({ send }));
        const response: any = { status };
        const next = jest.fn();

        await sendCurrentUserMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendUserMiddleware, expect.any(Error)));
    });
});

describe('getCurrentUserMiddlewares', () => {
    test('are defined in the correct order', () => {
        expect.assertions(6);

        expect(getCurrentUserMiddlewares.length).toEqual(5);
        expect(getCurrentUserMiddlewares[0]).toEqual(populateCurrentUserFollowingMiddleware);
        expect(getCurrentUserMiddlewares[1]).toEqual(populateCurrentUserFollowersMiddleware);
        expect(getCurrentUserMiddlewares[2]).toEqual(populateCurrentUserAchievementsMiddleware);
        expect(getCurrentUserMiddlewares[3]).toEqual(formatUserMiddleware);
        expect(getCurrentUserMiddlewares[4]).toEqual(sendCurrentUserMiddleware);
    });
});
