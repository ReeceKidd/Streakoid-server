import { Request, Response, NextFunction } from "express";
import * as Joi from "joi";
import * as mongoose from "mongoose";

import { getValidationErrorMessageSenderMiddleware } from "../../SharedMiddleware/validationErrorMessageSenderMiddleware";
import { soloStreakModel, SoloStreakModel } from "../../Models/SoloStreak";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";
import { SoloStreak } from "@streakoid/streakoid-sdk/lib";

const getSoloStreakParamsValidationSchema = {
  soloStreakId: Joi.string().required()
};

export const getSoloStreakParamsValidationMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  Joi.validate(
    request.params,
    getSoloStreakParamsValidationSchema,
    getValidationErrorMessageSenderMiddleware(request, response, next)
  );
};

export const getRetreiveSoloStreakMiddleware = (
  soloStreakModel: mongoose.Model<SoloStreakModel>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { soloStreakId } = request.params;
    const soloStreak = await soloStreakModel
      .findOne({ _id: soloStreakId })
      .lean();
    if (!soloStreak) {
      throw new CustomError(ErrorType.GetSoloStreakNoSoloStreakFound);
    }
    response.locals.soloStreak = soloStreak;
    next();
  } catch (err) {
    if (err instanceof CustomError) next(err);
    else next(new CustomError(ErrorType.RetreiveSoloStreakMiddleware, err));
  }
};

export const retreiveSoloStreakMiddleware = getRetreiveSoloStreakMiddleware(
  soloStreakModel
);

export const getSendSoloStreakMiddleware = (
  resourceCreatedResponseCode: number
) => (request: Request, response: Response, next: NextFunction) => {
  try {
    const { soloStreak } = response.locals;
    return response.status(resourceCreatedResponseCode).send(soloStreak);
  } catch (err) {
    next(new CustomError(ErrorType.SendSoloStreakMiddleware, err));
  }
};

export const sendSoloStreakMiddleware = getSendSoloStreakMiddleware(
  ResponseCodes.success
);

export const getSoloStreakMiddlewares = [
  getSoloStreakParamsValidationMiddleware,
  retreiveSoloStreakMiddleware,
  sendSoloStreakMiddleware
];
