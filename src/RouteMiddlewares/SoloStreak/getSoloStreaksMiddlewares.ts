import { Request, Response, NextFunction } from "express";
import * as Joi from "joi";
import * as mongoose from "mongoose";

import { getValidationErrorMessageSenderMiddleware } from "../../SharedMiddleware/validationErrorMessageSenderMiddleware";
import { soloStreakModel, SoloStreak } from "../../Models/SoloStreak";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";

export enum GetSoloStreaksQueryParamaters {
  userId = "userId"
}

const getSoloStreaksValidationSchema = {
  userId: Joi.string().required()
};

export const getSoloStreaksValidationMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  Joi.validate(
    request.query,
    getSoloStreaksValidationSchema,
    getValidationErrorMessageSenderMiddleware(request, response, next)
  );
};

export const getFindSoloStreaksMiddleware = (
  soloStreakModel: mongoose.Model<SoloStreak>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { userId } = request.query;
    response.locals.soloStreaks = await soloStreakModel.find({
      userId
    });
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
    response.status(ResponseCodes.success).send({ soloStreaks });
  } catch (err) {
    next(new CustomError(ErrorType.SendSoloStreaksMiddleware, err));
  }
};

export const getSoloStreaksMiddlewares = [
  getSoloStreaksValidationMiddleware,
  findSoloStreaksMiddleware,
  sendSoloStreaksMiddleware
];
