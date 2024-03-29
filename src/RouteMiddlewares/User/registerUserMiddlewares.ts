import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import { Model } from 'mongoose';

import { userModel, UserModel } from '../../Models/User';
import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { User } from '@streakoid/streakoid-models/lib/Models/User';
import { getPopulatedCurrentUser } from '../../formatters/getPopulatedCurrentUser';

const registerValidationSchema = {
    username: Joi.string().required(),
    email: Joi.string()
        .email()
        .required(),
};

export const userRegistrationValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.body,
        registerValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getDoesUserEmailExistMiddleware = (userModel: Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { email } = request.body;
        const user = await userModel.findOne({ email });
        if (user) {
            throw new CustomError(ErrorType.UserEmailAlreadyExists);
        }
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.DoesUserEmailExistMiddleware, err));
    }
};

export const doesUserEmailExistMiddleware = getDoesUserEmailExistMiddleware(userModel);

export const setUsernameToLowercaseMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { username } = request.body;
        response.locals.lowerCaseUsername = username.toLowerCase();
        next();
    } catch (err) {
        next(new CustomError(ErrorType.SetUsernameToLowercaseMiddleware, err));
    }
};

export const getDoesUsernameExistMiddleware = (userModel: Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { lowerCaseUsername } = response.locals;
        const user = await userModel.findOne({ username: lowerCaseUsername });
        if (user) {
            throw new CustomError(ErrorType.UsernameAlreadyExists);
        }
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.DoesUsernameAlreadyExistMiddleware));
    }
};

export const doesUsernameExistMiddleware = getDoesUsernameExistMiddleware(userModel);

export const getSaveUserToDatabaseMiddleware = (user: Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { lowerCaseUsername, timezone } = response.locals;
        const { email } = request.body;
        const newUser = new user({
            username: lowerCaseUsername,
            email,
            timezone,
            cognitoUsername: lowerCaseUsername,
        });
        response.locals.savedUser = await newUser.save();
        next();
    } catch (err) {
        next(new CustomError(ErrorType.SaveUserToDatabaseMiddleware, err));
    }
};

export const saveUserToDatabaseMiddleware = getSaveUserToDatabaseMiddleware(userModel);

export const getFormatUserMiddleware = (getPopulatedCurrentUserFunction: typeof getPopulatedCurrentUser) => (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const user: User = response.locals.savedUser;
        response.locals.formattedUser = getPopulatedCurrentUserFunction({
            user,
            following: [],
            followers: [],
            achievements: [],
        });
        next();
    } catch (err) {
        next(new CustomError(ErrorType.RegisterUserFormatUserMiddleware, err));
    }
};

export const formatUserMiddleware = getFormatUserMiddleware(getPopulatedCurrentUser);

export const sendFormattedUserMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { formattedUser } = response.locals;
        response.status(ResponseCodes.created).send(formattedUser);
        next();
    } catch (err) {
        next(new CustomError(ErrorType.SendFormattedUserMiddleware, err));
    }
};

export const registerUserMiddlewares = [
    userRegistrationValidationMiddleware,
    doesUserEmailExistMiddleware,
    setUsernameToLowercaseMiddleware,
    doesUsernameExistMiddleware,
    saveUserToDatabaseMiddleware,
    formatUserMiddleware,
    sendFormattedUserMiddleware,
];
