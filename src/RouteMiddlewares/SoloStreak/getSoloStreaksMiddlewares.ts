import { Request, Response, NextFunction } from "express";
import * as Joi from "joi";
import * as mongoose from "mongoose";

import { getValidationErrorMessageSenderMiddleware } from "../../SharedMiddleware/validationErrorMessageSenderMiddleware";
import { soloStreakModel, SoloStreakModel } from "../../Models/SoloStreak";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";
import { SoloStreak } from "@streakoid/streakoid-sdk/lib";

const getSoloStreaksQueryValidationSchema = {
  userId: Joi.string(),
  timezone: Joi.string(),
  completedToday: Joi.boolean(),
  active: Joi.boolean()
};

export const getSoloStreaksQueryValidationMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  Joi.validate(
    request.query,
    getSoloStreaksQueryValidationSchema,
    getValidationErrorMessageSenderMiddleware(request, response, next)
  );
};

export const getFindSoloStreaksMiddleware = (
  soloStreakModel: mongoose.Model<SoloStreakModel>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { userId, timezone, completedToday, active } = request.query;

    const query: {
      userId?: string;
      timezone?: string;
      completedToday?: boolean;
      active?: boolean;
    } = {};

    if (userId) {
      query.userId = userId;
    }
    if (timezone) {
      query.timezone = timezone;
    }
    if (completedToday) {
      query.completedToday = completedToday === "true";
    }
    if (active) {
      query.active = active === "true";
    }

    response.locals.soloStreaks = await soloStreakModel.find(query);
    next();
  } catch (err) {
    next(new CustomError(ErrorType.FindSoloStreaksMiddleware, err));
  }
};

export const findSoloStreaksMiddleware = getFindSoloStreaksMiddleware(
  soloStreakModel
);

export const sendSoloStreaksMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { soloStreaks } = response.locals;
    response.status(ResponseCodes.success).send(soloStreaks);
  } catch (err) {
    next(new CustomError(ErrorType.SendSoloStreaksMiddleware, err));
  }
};

export const getSoloStreaksMiddlewares = [
  getSoloStreaksQueryValidationMiddleware,
  findSoloStreaksMiddleware,
  sendSoloStreaksMiddleware
];
