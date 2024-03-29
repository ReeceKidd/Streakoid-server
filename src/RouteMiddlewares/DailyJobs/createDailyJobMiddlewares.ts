import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { dailyJobModel, DailyJobModel } from '../../Models/DailyJob';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';

const createDailyJobBodyValidationSchema = {
    agendaJobId: Joi.string().required(),
    jobName: Joi.string().required(),
    timezone: Joi.string().required(),
    localisedJobCompleteTime: Joi.string().required(),
    streakType: Joi.string()
        .valid(Object.keys(StreakTypes))
        .required(),
};

export const createDailyJobBodyValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.body,
        createDailyJobBodyValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getSaveDailyJobToDatabaseMiddleware = (dailyJob: mongoose.Model<DailyJobModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { agendaJobId, jobName, timezone, localisedJobCompleteTime, streakType } = request.body;
        const newDailyJob = new dailyJob({
            agendaJobId,
            jobName,
            timezone,
            localisedJobCompleteTime,
            streakType,
        });
        response.locals.savedDailyJob = await newDailyJob.save();
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateDailyJobFromRequestMiddleware, err));
    }
};

export const saveDailyJobToDatabaseMiddleware = getSaveDailyJobToDatabaseMiddleware(dailyJobModel);

export const sendFormattedDailyJobMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { savedDailyJob } = response.locals;
        response.status(ResponseCodes.created).send(savedDailyJob);
    } catch (err) {
        next(new CustomError(ErrorType.SendFormattedDailyJobMiddleware, err));
    }
};

export const createDailyJobMiddlewares = [
    createDailyJobBodyValidationMiddleware,
    saveDailyJobToDatabaseMiddleware,
    sendFormattedDailyJobMiddleware,
];
