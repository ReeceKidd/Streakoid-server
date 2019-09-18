import { Request, Response, NextFunction } from "express";
import * as Joi from "joi";
import * as mongoose from "mongoose";

import { getValidationErrorMessageSenderMiddleware } from "../../SharedMiddleware/validationErrorMessageSenderMiddleware";

import { groupStreakModel, GroupStreakModel } from "../../Models/GroupStreak";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";
import {
  groupMemberStreakModel,
  GroupMemberStreakModel
} from "../../Models/GroupMemberStreak";
import { userModel, UserModel } from "../../Models/User";

export interface GroupStreakRegistrationRequestBody {
  creatorId: string;
  streakName: string;
  streakDescription: string;
  numberOfMinutes: number;
  members: { memberId: string; groupMemberStreakId: string }[];
}

const member = Joi.object().keys({
  memberId: Joi.string().required(),
  groupMemberStreakId: Joi.string()
});

const createGroupStreakBodyValidationSchema = {
  creatorId: Joi.string().required(),
  streakName: Joi.string().required(),
  streakDescription: Joi.string(),
  numberOfMinutes: Joi.number().positive(),
  members: Joi.array()
    .min(1)
    .items(member)
};

export const createGroupStreakBodyValidationMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  console.log(1);
  Joi.validate(
    request.body,
    createGroupStreakBodyValidationSchema,
    getValidationErrorMessageSenderMiddleware(request, response, next)
  );
};

export const getCreateGroupStreakMiddleware = (
  groupStreak: mongoose.Model<GroupStreakModel>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    console.log(2);
    const { timezone } = response.locals;
    const {
      creatorId,
      streakName,
      streakDescription,
      numberOfMinutes
    } = request.body;
    response.locals.newGroupStreak = await new groupStreak({
      creatorId,
      streakName,
      streakDescription,
      numberOfMinutes,
      timezone
    }).save();
    next();
  } catch (err) {
    console.log(err);
    next(new CustomError(ErrorType.CreateGroupStreakMiddleware, err));
  }
};

export const createGroupStreakMiddleware = getCreateGroupStreakMiddleware(
  groupStreakModel
);

export const getCreateGroupMemberStreaksMiddleware = (
  userModel: mongoose.Model<UserModel>,
  groupMemberStreak: mongoose.Model<GroupMemberStreakModel>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    console.log(3);
    const { timezone, newGroupStreak } = response.locals;
    const { members } = request.body;
    console.log(newGroupStreak);
    console.log(members);

    const membersWithGroupMemberStreakIds = await Promise.all(
      members.map(async (member: { memberId: string }) => {
        console.log("Entered loop ");
        const memberExists = await userModel.findOne({ _id: member.memberId });
        console.log(member.memberId);
        if (!memberExists) {
          throw new CustomError(ErrorType.GroupMemberDoesNotExist);
        }

        const newGroupMemberStreak = await new groupMemberStreak({
          userId: member.memberId,
          groupStreakId: newGroupStreak._id,
          timezone
        }).save();

        return {
          memberId: member.memberId,
          groupMemberStreakId: newGroupMemberStreak._id
        };
      })
    );

    response.locals.membersWithGroupMemberStreakIds = membersWithGroupMemberStreakIds;

    next();
  } catch (err) {
    if (err instanceof CustomError) next(err);
    next(
      new CustomError(
        ErrorType.CreateGroupStreakCreateMemberStreakMiddleware,
        err
      )
    );
  }
};

export const createGroupMemberStreaksMiddleware = getCreateGroupMemberStreaksMiddleware(
  userModel,
  groupMemberStreakModel
);

export const getUpdateGroupStreakMembersArray = (
  groupStreak: mongoose.Model<GroupStreakModel>
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    console.log(4);
    const { membersWithGroupMemberStreakIds, newGroupStreak } = response.locals;

    response.locals.newGroupStreak = await groupStreak
      .findByIdAndUpdate(
        newGroupStreak._id,
        {
          members: membersWithGroupMemberStreakIds
        },
        { new: true }
      )
      .lean();

    next();
  } catch (err) {
    next(new CustomError(ErrorType.UpdateGroupStreakMembersArray, err));
  }
};

export const updateGroupStreakMembersArrayMiddleware = getUpdateGroupStreakMembersArray(
  groupStreakModel
);

export const sendGroupStreakMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    console.log(5);
    const { newGroupStreak } = response.locals;
    return response.status(ResponseCodes.created).send(newGroupStreak);
  } catch (err) {
    next(new CustomError(ErrorType.SendFormattedGroupStreakMiddleware, err));
  }
};

export const createGroupStreakMiddlewares = [
  createGroupStreakBodyValidationMiddleware,
  createGroupStreakMiddleware,
  createGroupMemberStreaksMiddleware,
  updateGroupStreakMembersArrayMiddleware,
  sendGroupStreakMiddleware
];
