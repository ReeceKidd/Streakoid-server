import { Request, Response, NextFunction } from 'express';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { Model } from 'mongoose';
import { userModel, UserModel } from '../../../src/Models/User';
import { AchievementModel, achievementModel } from '../../../src/Models/Achievement';
import { DatabaseAchievementType } from '@streakoid/streakoid-models/lib/Models/DatabaseAchievement';
import { User } from '@streakoid/streakoid-models/lib/Models/User';
import { BasicUser } from '@streakoid/streakoid-models/lib/Models/BasicUser';
import { getPopulatedCurrentUser } from '../../formatters/getPopulatedCurrentUser';

export const getPopulateCurrentUserFollowingMiddleware = (userModel: Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const user: User = response.locals.user;
        const following = await Promise.all(
            user.following.map(async followingId => {
                const populatedFollowing: UserModel | null = await userModel.findById(followingId).lean();
                if (populatedFollowing) {
                    const basicUser: BasicUser = {
                        userId: followingId,
                        username: populatedFollowing.username,
                        profileImage: populatedFollowing.profileImages.originalImageUrl,
                    };
                    return basicUser;
                }
                return null;
            }),
        );
        response.locals.following = following.filter(user => user !== null);
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.PopulateCurrentUserFollowingMiddleware, err));
    }
};

export const populateCurrentUserFollowingMiddleware = getPopulateCurrentUserFollowingMiddleware(userModel);

export const getPopulateCurrentUserFollowersMiddleware = (userModel: Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const user: User = response.locals.user;
        const sortedFollowers: UserModel[] = await userModel
            .find({ _id: user.followers.map(follower => follower) })
            .sort({ totalStreakCompletes: 1 })
            .lean();
        const formattedFollowers = sortedFollowers
            .filter(user => user !== null)
            .map(user => {
                const basicUser: BasicUser = {
                    profileImage: user.profileImages.originalImageUrl,
                    userId: user._id,
                    username: user.username,
                };
                return basicUser;
            });
        response.locals.followers = formattedFollowers;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.PopulateCurrentUserFollowersMiddleware, err));
    }
};

export const populateCurrentUserFollowersMiddleware = getPopulateCurrentUserFollowersMiddleware(userModel);

export const getPopulateCurrentUserAchievementsMiddleware = (achievementModel: Model<AchievementModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const user: User = response.locals.user;
        const achievements: DatabaseAchievementType[] = await Promise.all(
            user.achievements.map(async achievement => {
                const populatedAchievement: DatabaseAchievementType = await achievementModel
                    .findById(achievement._id)
                    .lean();
                return populatedAchievement;
            }),
        );
        response.locals.achievements = achievements;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.PopulateCurrentUserAchievementsMiddleware, err));
    }
};

export const populateCurrentUserAchievementsMiddleware = getPopulateCurrentUserAchievementsMiddleware(achievementModel);

export const getFormatUserMiddleware = (getPopulatedCurrentUserFunction: typeof getPopulatedCurrentUser) => (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const user: User = response.locals.user;
        const followers: BasicUser[] = response.locals.followers;
        const following: BasicUser[] = response.locals.following;
        const achievements: DatabaseAchievementType[] = response.locals.achievements;
        response.locals.formattedUser = getPopulatedCurrentUserFunction({ user, following, followers, achievements });
        next();
    } catch (err) {
        next(new CustomError(ErrorType.GetCurrentUserFormatUserMiddleware, err));
    }
};

export const formatUserMiddleware = getFormatUserMiddleware(getPopulatedCurrentUser);

export const sendCurrentUserMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { formattedUser } = response.locals;
        response.status(ResponseCodes.success).send(formattedUser);
    } catch (err) {
        next(new CustomError(ErrorType.SendCurrentUserMiddleware, err));
    }
};

export const getCurrentUserMiddlewares = [
    populateCurrentUserFollowingMiddleware,
    populateCurrentUserFollowersMiddleware,
    populateCurrentUserAchievementsMiddleware,
    formatUserMiddleware,
    sendCurrentUserMiddleware,
];
