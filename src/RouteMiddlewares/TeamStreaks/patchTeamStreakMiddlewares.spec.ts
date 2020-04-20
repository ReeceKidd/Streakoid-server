/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    patchTeamStreakMiddlewares,
    teamStreakRequestBodyValidationMiddleware,
    getPatchTeamStreakMiddleware,
    patchTeamStreakMiddleware,
    sendUpdatedTeamStreakMiddleware,
    teamStreakParamsValidationMiddleware,
    getCreateArchivedTeamStreakActivityFeedItemMiddleware,
    getCreateRestoredTeamStreakActivityFeedItemMiddleware,
    getCreateDeletedTeamStreakActivityFeedItemMiddleware,
    getCreateEditedTeamStreakNameActivityFeedItemMiddleware,
    getCreateEditedTeamStreakDescriptionActivityFeedItemMiddleware,
    createEditedTeamStreakNameActivityFeedItemMiddleware,
    createEditedTeamStreakDescriptionActivityFeedItemMiddleware,
    createArchivedTeamStreakActivityFeedItemMiddleware,
    createRestoredTeamStreakActivityFeedItemMiddleware,
    createDeletedTeamStreakActivityFeedItemMiddleware,
    disableTeamMembersRemindersWhenTeamStreakIsArchivedMiddleware,
    getDisableTeamMembersRemindersWhenTeamStreakIsArchivedMiddleware,
} from './patchTeamStreakMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import StreakStatus from '@streakoid/streakoid-sdk/lib/StreakStatus';
import { CustomStreakReminder, CustomTeamStreakReminder } from '@streakoid/streakoid-sdk/lib/models/StreakReminders';
import { StreakReminderTypes } from '@streakoid/streakoid-sdk/lib';

describe('teamStreakParamsValidationMiddleware', () => {
    test('sends correct error response when teamStreakId is not defined', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            params: {},
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        teamStreakParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "teamStreakId" fails because ["teamStreakId" is required]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends correct error response when teamStreakId is not a string', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            params: { teamStreakId: 123 },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        teamStreakParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "teamStreakId" fails because ["teamStreakId" must be a string]',
        });
        expect(next).not.toBeCalled();
    });
});

describe('teamStreakRequestBodyValidationMiddleware', () => {
    const creatorId = 'creatorId';
    const streakName = 'streakName';
    const streakDescription = 'streakDescription';
    const numberOfMinutes = 30;
    const timezone = 'timezone';
    const status = StreakStatus.archived;
    const completedToday = true;
    const active = true;

    const body = {
        creatorId,
        streakName,
        streakDescription,
        numberOfMinutes,
        timezone,
        status,
        completedToday,
        active,
    };

    test('sends correct error response when unsupported key is sent', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: {
                ...body,
                unsupportedKey: 1234,
            },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        teamStreakRequestBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.badRequest);
        expect(send).toBeCalledWith({
            message: '"unsupportedKey" is not allowed',
        });
        expect(next).not.toBeCalled();
    });

    test('sends correct error when streakName is not a string', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: {
                ...body,
                streakName: 123,
            },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        teamStreakRequestBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "streakName" fails because ["streakName" must be a string]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends correct response when streakDescription is not a string', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: {
                ...body,
                streakDescription: 123,
            },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        teamStreakRequestBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "streakDescription" fails because ["streakDescription" must be a string]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends correct error response when numberOfMinutes is not a number', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: {
                ...body,
                numberOfMinutes: 'abc',
            },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        teamStreakRequestBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "numberOfMinutes" fails because ["numberOfMinutes" must be a number]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends correct error response when timezone is not a string', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: {
                ...body,
                timezone: 123,
            },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        teamStreakRequestBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "timezone" fails because ["timezone" must be a string]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends correct error response when currentStreak is not an object', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: {
                ...body,
                currentStreak: 'currentStreak',
            },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        teamStreakRequestBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "currentStreak" fails because ["currentStreak" must be an object]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends correct error response when pastStreaks is an array', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: {
                ...body,
                pastStreaks: 'pastStreaks',
            },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        teamStreakRequestBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "pastStreaks" fails because ["pastStreaks" must be an array]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends correct error response when status is not valid', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: {
                ...body,
                status: 'invalid',
            },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        teamStreakRequestBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "status" fails because ["status" must be one of [live, archived, deleted]]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends correct error response when completedToday is not a boolean', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: {
                ...body,
                completedToday: 'completedToday',
            },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        teamStreakRequestBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "completedToday" fails because ["completedToday" must be a boolean]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends correct error response when active is not a boolean', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: {
                ...body,
                active: 'active',
            },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        teamStreakRequestBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "active" fails because ["active" must be a boolean]',
        });
        expect(next).not.toBeCalled();
    });
});

describe('patchTeamStreakMiddleware', () => {
    test('sets response.locals.updatedTeamStreak', async () => {
        expect.assertions(3);
        const teamStreakId = 'abc123';
        const userId = '123cde';
        const name = 'Daily programming';
        const description = 'Do one hour of programming each day';
        const request: any = {
            params: { teamStreakId },
            body: {
                userId,
                name,
                description,
            },
        };
        const response: any = { locals: {} };
        const next = jest.fn();
        const findByIdAndUpdate = jest.fn(() => Promise.resolve(true));
        const teamStreakModel = {
            findByIdAndUpdate,
        };
        const middleware = getPatchTeamStreakMiddleware(teamStreakModel as any);

        await middleware(request, response, next);

        expect(findByIdAndUpdate).toBeCalledWith(teamStreakId, { userId, name, description }, { new: true });
        expect(response.locals.updatedTeamStreak).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('throws UpdatedTeamStreakNotFound error when team streak is not found', async () => {
        expect.assertions(1);
        const teamStreakId = 'abc123';
        const userId = '123cde';
        const name = 'Daily programming';
        const description = 'Do one hour of programming each day';
        const request: any = {
            params: { teamStreakId },
            body: {
                userId,
                name,
                description,
            },
        };
        const response: any = { locals: {} };
        const next = jest.fn();
        const findByIdAndUpdate = jest.fn(() => Promise.resolve(false));
        const teamStreakModel = {
            findByIdAndUpdate,
        };
        const middleware = getPatchTeamStreakMiddleware(teamStreakModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.UpdatedTeamStreakNotFound));
    });

    test('calls next with PatchTeamStreakMiddleware on middleware failure', async () => {
        expect.assertions(1);
        const teamStreakId = 'abc123';
        const userId = '123cde';
        const name = 'Daily programming';
        const description = 'Do one hour of programming each day';
        const request: any = {
            params: { teamStreakId },
            body: {
                userId,
                name,
                description,
            },
        };
        const response: any = { locals: {} };
        const next = jest.fn();
        const errorMessage = 'error';
        const findByIdAndUpdate = jest.fn(() => Promise.reject(errorMessage));
        const TeamStreakModel = {
            findByIdAndUpdate,
        };
        const middleware = getPatchTeamStreakMiddleware(TeamStreakModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.PatchTeamStreakMiddleware));
    });
});

describe('sendUpdatedPatchMiddleware', () => {
    const ERROR_MESSAGE = 'error';
    const updatedTeamStreak = {
        userId: 'abc',
        streakName: 'Daily Spanish',
        streakDescription: 'Practice spanish every day',
        startDate: new Date(),
    };

    test('sends updatedTeamStreak', () => {
        expect.assertions(4);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const teamStreakResponseLocals = { updatedTeamStreak };
        const response: any = { locals: teamStreakResponseLocals, status };
        const request: any = {};
        const next = jest.fn();
        const updatedResourceResponseCode = 200;

        sendUpdatedTeamStreakMiddleware(request, response, next);

        expect(response.locals.user).toBeUndefined();
        expect(next).toBeCalled();
        expect(status).toBeCalledWith(updatedResourceResponseCode);
        expect(send).toBeCalledWith(updatedTeamStreak);
    });

    test('calls next with SendUpdatedTeamStreakMiddleware error on middleware failure', () => {
        expect.assertions(1);
        const send = jest.fn(() => {
            throw new Error(ERROR_MESSAGE);
        });
        const status = jest.fn(() => ({ send }));
        const response: any = { locals: { updatedTeamStreak }, status };
        const request: any = {};
        const next = jest.fn();

        sendUpdatedTeamStreakMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendUpdatedTeamStreakMiddleware, expect.any(Error)));
    });
});

describe(`disableTeamMembersRemindersWhenTeamStreakIsArchivedMiddleware`, () => {
    test('disables team members customStreakReminders for team streak if they had one', async () => {
        expect.assertions(3);
        const _id = '_id';
        const updatedTeamStreak = { _id, streakName: 'Reading', members: ['memberId'] };
        const customTeamStreakReminder: CustomTeamStreakReminder = {
            enabled: true,
            expoId: 'expoId',
            reminderHour: 21,
            reminderMinute: 0,
            streakReminderType: StreakReminderTypes.customTeamStreakReminder,
            teamStreakId: _id,
            teamStreakName: 'reading',
        };
        const customStreakReminders: CustomStreakReminder[] = [customTeamStreakReminder];
        const findById = jest.fn().mockResolvedValue({ pushNotifications: { customStreakReminders } });
        const findByIdAndUpdate = jest.fn().mockResolvedValue(true);
        const userModel = {
            findById,
            findByIdAndUpdate,
        };

        const response: any = { locals: { updatedTeamStreak } };
        const request: any = { body: { status: StreakStatus.archived } };
        const next = jest.fn();

        const middleware = getDisableTeamMembersRemindersWhenTeamStreakIsArchivedMiddleware(userModel as any);

        await middleware(request, response, next);

        expect(findById).toBeCalled();
        expect(findByIdAndUpdate).toBeCalled();
        expect(next).toBeCalled();
    });

    test('if request.body.status does not equal archived it just calls next', async () => {
        expect.assertions(2);
        const updatedTeamStreak = { _id: '_id', streakName: 'Reading' };
        const findById = jest.fn().mockResolvedValue(true);
        const userModel = {
            findById,
        };

        const response: any = { locals: { updatedTeamStreak } };
        const request: any = { body: {} };
        const next = jest.fn();

        const middleware = getDisableTeamMembersRemindersWhenTeamStreakIsArchivedMiddleware(userModel as any);

        await middleware(request, response, next);

        expect(findById).not.toBeCalled();
        expect(next).toBeCalled();
    });

    test('calls next with DisableTeamMembersRemindersWhenTeamStreakIsArchivedMiddleware error on middleware failure', () => {
        expect.assertions(1);

        const response: any = {};
        const request: any = {};
        const next = jest.fn();
        const middleware = getDisableTeamMembersRemindersWhenTeamStreakIsArchivedMiddleware({} as any);

        middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.DisableTeamMembersRemindersWhenTeamStreakIsArchivedMiddleware, expect.any(Error)),
        );
    });
});

describe(`createArchivedTeamStreakActivityFeedItemMiddleware`, () => {
    test('creates a new archivedTeamStreak activity if request.body.status equals archived', async () => {
        expect.assertions(2);
        const user = { _id: '_id', username: 'username' };
        const updatedTeamStreak = { _id: '_id', streakName: 'Reading' };
        const createActivityFeedItem = jest.fn().mockResolvedValue(true);

        const response: any = { locals: { user, updatedTeamStreak } };
        const request: any = { body: { status: StreakStatus.archived } };
        const next = jest.fn();

        const middleware = getCreateArchivedTeamStreakActivityFeedItemMiddleware(createActivityFeedItem as any);

        await middleware(request, response, next);

        expect(createActivityFeedItem).toBeCalled();
        expect(next).toBeCalled();
    });

    test('if request.body.status does not equal archived it just calls next', async () => {
        expect.assertions(2);
        const user = { _id: '_id', username: 'username' };
        const updatedTeamStreak = { _id: '_id', streakName: 'Reading' };
        const createActivityFeedItem = jest.fn().mockResolvedValue(true);

        const response: any = { locals: { user, updatedTeamStreak } };
        const request: any = { body: {} };
        const next = jest.fn();

        const middleware = getCreateArchivedTeamStreakActivityFeedItemMiddleware(createActivityFeedItem as any);

        await middleware(request, response, next);

        expect(createActivityFeedItem).not.toBeCalled();
        expect(next).toBeCalled();
    });

    test('calls next with CreateArchivedTeamStreakActivityFeedItemMiddleware error on middleware failure', () => {
        expect.assertions(1);

        const response: any = {};
        const request: any = {};
        const next = jest.fn();
        const middleware = getCreateArchivedTeamStreakActivityFeedItemMiddleware({} as any);

        middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.CreateArchivedTeamStreakActivityFeedItemMiddleware, expect.any(Error)),
        );
    });
});

describe(`createRestoredTeamStreakActivityFeedItemMiddleware`, () => {
    test('creates a new restoredTeamStreak activity if request.body.status equals live', async () => {
        expect.assertions(2);
        const user = { _id: '_id', username: 'username' };
        const updatedTeamStreak = { _id: '_id', streakName: 'Reading' };
        const createActivityFeedItem = jest.fn().mockResolvedValue(true);

        const response: any = { locals: { user, updatedTeamStreak } };
        const request: any = { body: { status: StreakStatus.live } };
        const next = jest.fn();

        const middleware = getCreateRestoredTeamStreakActivityFeedItemMiddleware(createActivityFeedItem as any);

        await middleware(request, response, next);

        expect(createActivityFeedItem).toBeCalled();
        expect(next).toBeCalled();
    });

    test('if request.body.status does not equal live it just calls next', async () => {
        expect.assertions(2);
        const user = { _id: '_id', username: 'username' };
        const updatedTeamStreak = { _id: '_id', streakName: 'Reading' };
        const createActivityFeedItem = jest.fn().mockResolvedValue(true);

        const response: any = { locals: { user, updatedTeamStreak } };
        const request: any = { body: {} };
        const next = jest.fn();

        const middleware = getCreateRestoredTeamStreakActivityFeedItemMiddleware(createActivityFeedItem as any);

        await middleware(request, response, next);

        expect(createActivityFeedItem).not.toBeCalled();
        expect(next).toBeCalled();
    });

    test('calls next with CreateRestoreTeamStreakActivityFeedItemMiddleware error on middleware failure', () => {
        expect.assertions(1);

        const response: any = {};
        const request: any = {};
        const next = jest.fn();
        const middleware = getCreateRestoredTeamStreakActivityFeedItemMiddleware({} as any);

        middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.CreateRestoredTeamStreakActivityFeedItemMiddleware, expect.any(Error)),
        );
    });
});

describe(`createDeletedTeamStreakActivityFeedItemMiddleware`, () => {
    test('creates a new deletedTeamStreak activity if request.body.status equals deleted', async () => {
        expect.assertions(2);
        const user = { _id: '_id', username: 'username' };
        const updatedTeamStreak = { _id: '_id', streakName: 'Reading' };
        const createActivityFeedItem = jest.fn().mockResolvedValue(true);

        const response: any = { locals: { user, updatedTeamStreak } };
        const request: any = { body: { status: StreakStatus.deleted } };
        const next = jest.fn();

        const middleware = getCreateDeletedTeamStreakActivityFeedItemMiddleware(createActivityFeedItem as any);

        await middleware(request, response, next);

        expect(createActivityFeedItem).toBeCalled();
        expect(next).toBeCalled();
    });

    test('if request.body.status does not equal deleted it just calls next', async () => {
        expect.assertions(2);
        const user = { _id: '_id', username: 'username' };
        const updatedTeamStreak = { _id: '_id', streakName: 'Reading' };
        const createActivityFeedItem = jest.fn().mockResolvedValue(true);

        const response: any = { locals: { user, updatedTeamStreak } };
        const request: any = { body: {} };
        const next = jest.fn();

        const middleware = getCreateDeletedTeamStreakActivityFeedItemMiddleware(createActivityFeedItem as any);

        await middleware(request, response, next);

        expect(createActivityFeedItem).not.toBeCalled();
        expect(next).toBeCalled();
    });

    test('calls next with CreateDeletedTeamStreakActivityFeedItemMiddleware error on middleware failure', () => {
        expect.assertions(1);

        const response: any = {};
        const request: any = {};
        const next = jest.fn();
        const middleware = getCreateDeletedTeamStreakActivityFeedItemMiddleware({} as any);

        middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.CreateDeletedTeamStreakActivityFeedItemMiddleware, expect.any(Error)),
        );
    });
});

describe(`createEditedTeamStreakNameActivityFeedItemMiddleware`, () => {
    test('creates a new editedTeamStreakName activity if request.body.streakName is defined', async () => {
        expect.assertions(2);
        const user = { _id: '_id' };
        const updatedTeamStreak = { _id: '_id', streakName: 'Reading' };
        const createActivityFeedItem = jest.fn().mockResolvedValue(true);

        const response: any = { locals: { user, updatedTeamStreak } };
        const request: any = { body: { streakName: 'new name' } };
        const next = jest.fn();

        const middleware = getCreateEditedTeamStreakNameActivityFeedItemMiddleware(createActivityFeedItem as any);

        await middleware(request, response, next);

        expect(createActivityFeedItem).toBeCalled();
        expect(next).toBeCalled();
    });

    test('if request.body.streakName is not defined it just calls next', async () => {
        expect.assertions(2);
        const user = { _id: '_id' };
        const updatedTeamStreak = { _id: '_id', streakName: 'Reading' };
        const createActivityFeedItem = jest.fn().mockResolvedValue(true);

        const response: any = { locals: { user, updatedTeamStreak } };
        const request: any = { body: {} };
        const next = jest.fn();

        const middleware = getCreateEditedTeamStreakNameActivityFeedItemMiddleware(createActivityFeedItem as any);

        await middleware(request, response, next);

        expect(createActivityFeedItem).not.toBeCalled();
        expect(next).toBeCalled();
    });

    test('calls next with CreateEditedTeamStreakNameActivityFeedItemMiddleware error on middleware failure', () => {
        expect.assertions(1);

        const response: any = {};
        const request: any = {};
        const next = jest.fn();
        const middleware = getCreateEditedTeamStreakNameActivityFeedItemMiddleware({} as any);

        middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.CreateEditedTeamStreakNameActivityFeedItemMiddleware, expect.any(Error)),
        );
    });
});

describe(`createEditedTeamStreakDescriptionActivityFeedItemMiddleware`, () => {
    test('creates a new editedTeamStreakDescription activity if request.body.streakDescription is defined', async () => {
        expect.assertions(2);
        const user = { _id: '_id' };
        const updatedTeamStreak = { _id: '_id', streakName: 'Reading' };
        const createActivityFeedItem = jest.fn().mockResolvedValue(true);

        const response: any = { locals: { user, updatedTeamStreak } };
        const request: any = { body: { streakDescription: 'new description' } };
        const next = jest.fn();

        const middleware = getCreateEditedTeamStreakDescriptionActivityFeedItemMiddleware(
            createActivityFeedItem as any,
        );

        await middleware(request, response, next);

        expect(createActivityFeedItem).toBeCalled();
        expect(next).toBeCalled();
    });

    test('if request.body.streakDescription is not defined it just calls next', async () => {
        expect.assertions(2);
        const user = { _id: '_id' };
        const updatedTeamStreak = { _id: '_id', streakName: 'Reading' };
        const createActivityFeedItem = jest.fn().mockResolvedValue(true);

        const response: any = { locals: { user, updatedTeamStreak } };
        const request: any = { body: {} };
        const next = jest.fn();

        const middleware = getCreateEditedTeamStreakDescriptionActivityFeedItemMiddleware(
            createActivityFeedItem as any,
        );

        await middleware(request, response, next);

        expect(createActivityFeedItem).not.toBeCalled();
        expect(next).toBeCalled();
    });

    test('calls next with CreateEditedTeamStreakDescriptionActivityFeedItemMiddleware error on middleware failure', () => {
        expect.assertions(1);

        const response: any = {};
        const request: any = {};
        const next = jest.fn();
        const middleware = getCreateEditedTeamStreakDescriptionActivityFeedItemMiddleware({} as any);

        middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.CreateEditedTeamStreakDescriptionActivityFeedItemMiddleware, expect.any(Error)),
        );
    });
});

describe('patchTeamStreakMiddlewares', () => {
    test('are defined in the correct order', () => {
        expect.assertions(11);

        expect(patchTeamStreakMiddlewares.length).toBe(10);
        expect(patchTeamStreakMiddlewares[0]).toBe(teamStreakParamsValidationMiddleware);
        expect(patchTeamStreakMiddlewares[1]).toBe(teamStreakRequestBodyValidationMiddleware);
        expect(patchTeamStreakMiddlewares[2]).toBe(patchTeamStreakMiddleware);
        expect(patchTeamStreakMiddlewares[3]).toBe(sendUpdatedTeamStreakMiddleware);
        expect(patchTeamStreakMiddlewares[4]).toBe(disableTeamMembersRemindersWhenTeamStreakIsArchivedMiddleware);
        expect(patchTeamStreakMiddlewares[5]).toBe(createArchivedTeamStreakActivityFeedItemMiddleware);
        expect(patchTeamStreakMiddlewares[6]).toBe(createRestoredTeamStreakActivityFeedItemMiddleware);
        expect(patchTeamStreakMiddlewares[7]).toBe(createDeletedTeamStreakActivityFeedItemMiddleware);
        expect(patchTeamStreakMiddlewares[8]).toBe(createEditedTeamStreakNameActivityFeedItemMiddleware);
        expect(patchTeamStreakMiddlewares[9]).toBe(createEditedTeamStreakDescriptionActivityFeedItemMiddleware);
    });
});
