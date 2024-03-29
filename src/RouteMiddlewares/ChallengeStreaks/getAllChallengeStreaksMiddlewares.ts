import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { challengeStreakModel, ChallengeStreakModel } from '../../Models/ChallengeStreak';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { GetAllChallengeStreaksSortFields } from '@streakoid/streakoid-sdk/lib/challengeStreaks';
import IndividualVisibilityTypes from '@streakoid/streakoid-models/lib/Types/IndividualVisibilityTypes';

const getChallengeStreaksQueryValidationSchema = {
    userId: Joi.string(),
    challengeId: Joi.string(),
    timezone: Joi.string(),
    status: Joi.string(),
    completedToday: Joi.boolean(),
    active: Joi.boolean(),
    sortField: Joi.string(),
    limit: Joi.number(),
};

export const getChallengeStreaksQueryValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.query,
        getChallengeStreaksQueryValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getFindChallengeStreaksMiddleware = (challengeStreakModel: mongoose.Model<ChallengeStreakModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { userId, challengeId, timezone, completedToday, active, status, sortField } = request.query;

        const defaultLeaderboardLimit = 30;

        const limit = Number(request.query.limit) || defaultLeaderboardLimit;

        const query: {
            visibility: IndividualVisibilityTypes;
            userId?: string;
            challengeId?: string;
            timezone?: string;
            status?: string;
            completedToday?: boolean;
            active?: boolean;
            sortField?: string;
        } = {
            visibility: IndividualVisibilityTypes.everyone,
        };

        if (userId) {
            query.userId = userId;
        }
        if (challengeId) {
            query.challengeId = challengeId;
        }
        if (timezone) {
            query.timezone = timezone;
        }
        if (status) {
            query.status = status;
        }
        if (completedToday) {
            query.completedToday = completedToday === 'true';
        }
        if (active) {
            query.active = active === 'true';
        }
        if (sortField === GetAllChallengeStreaksSortFields.currentStreak) {
            response.locals.challengeStreaks = await challengeStreakModel
                .find(query)
                .sort({ 'currentStreak.numberOfDaysInARow': -1 })
                .limit(limit);
        } else if (sortField === GetAllChallengeStreaksSortFields.longestChallengeStreak) {
            response.locals.challengeStreaks = await challengeStreakModel
                .find(query)
                .sort({ 'longestChallengeStreak.numberOfDays': -1 })
                .limit(limit);
        } else {
            response.locals.challengeStreaks = await challengeStreakModel.find(query).limit(limit);
        }

        next();
    } catch (err) {
        next(new CustomError(ErrorType.FindChallengeStreaksMiddleware, err));
    }
};

export const findChallengeStreaksMiddleware = getFindChallengeStreaksMiddleware(challengeStreakModel);

export const sendChallengeStreaksMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { challengeStreaks } = response.locals;
        response.status(ResponseCodes.success).send(challengeStreaks);
    } catch (err) {
        next(new CustomError(ErrorType.SendChallengeStreaksMiddleware, err));
    }
};

export const getAllChallengeStreaksMiddlewares = [
    getChallengeStreaksQueryValidationMiddleware,
    findChallengeStreaksMiddleware,
    sendChallengeStreaksMiddleware,
];
