/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    createSoloStreakMiddlewares,
    createSoloStreakBodyValidationMiddleware,
    createSoloStreakFromRequestMiddleware,
    getCreateSoloStreakFromRequestMiddleware,
    sendFormattedSoloStreakMiddleware,
    createSoloStreakActivityFeedItemMiddleware,
    getCreateSoloStreakActivityFeedItemMiddleware,
    increaseUsersTotalLiveStreaksByOneMiddleware,
    getIncreaseUsersTotalLiveStreaksByOneMiddleware,
} from './createSoloStreakMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import IndividualVisibilityTypes from '@streakoid/streakoid-models/lib/Types/IndividualVisibilityTypes';

describe('createSoloStreakMiddlewares', () => {
    describe(`createSoloStreakBodyValidationMiddleware`, () => {
        const userId = '12345678';
        const streakName = 'Spanish Streak';
        const streakDescription = ' Do the insane amount of XP for Duolingo each day';
        const numberOfMinutes = 30;
        const visibility = IndividualVisibilityTypes.everyone;

        const body = {
            userId,
            streakName,
            streakDescription,
            numberOfMinutes,
            visibility,
        };

        test('valid request passes validation', () => {
            expect.assertions(1);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const request: any = {
                body,
            };
            const response: any = {
                status,
            };
            const next = jest.fn();

            createSoloStreakBodyValidationMiddleware(request, response, next);

            expect(next).toBeCalled();
        });

        test('sends userId is missing error', () => {
            expect.assertions(3);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const request: any = {
                body: { ...body, userId: undefined },
            };
            const response: any = {
                status,
            };
            const next = jest.fn();

            createSoloStreakBodyValidationMiddleware(request, response, next);

            expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
            expect(send).toBeCalledWith({
                message: 'child "userId" fails because ["userId" is required]',
            });
            expect(next).not.toBeCalled();
        });

        test('sends userId is not a string error', () => {
            expect.assertions(3);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const request: any = {
                body: { ...body, userId: 123 },
            };
            const response: any = {
                status,
            };
            const next = jest.fn();

            createSoloStreakBodyValidationMiddleware(request, response, next);

            expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
            expect(send).toBeCalledWith({
                message: 'child "userId" fails because ["userId" must be a string]',
            });
            expect(next).not.toBeCalled();
        });

        test('sends streakName is missing error', () => {
            expect.assertions(3);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const request: any = {
                body: { ...body, streakName: undefined },
            };
            const response: any = {
                status,
            };
            const next = jest.fn();

            createSoloStreakBodyValidationMiddleware(request, response, next);

            expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
            expect(send).toBeCalledWith({
                message: 'child "streakName" fails because ["streakName" is required]',
            });
            expect(next).not.toBeCalled();
        });

        test('sends streakName is not a string error', () => {
            expect.assertions(3);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const request: any = {
                body: { ...body, streakName: 123 },
            };
            const response: any = {
                status,
            };
            const next = jest.fn();

            createSoloStreakBodyValidationMiddleware(request, response, next);

            expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
            expect(send).toBeCalledWith({
                message: 'child "streakName" fails because ["streakName" must be a string]',
            });
            expect(next).not.toBeCalled();
        });

        test('sends streakDescription is not a string error', () => {
            expect.assertions(3);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const request: any = {
                body: { ...body, streakDescription: 123 },
            };
            const response: any = {
                status,
            };
            const next = jest.fn();

            createSoloStreakBodyValidationMiddleware(request, response, next);

            expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
            expect(send).toBeCalledWith({
                message: 'child "streakDescription" fails because ["streakDescription" must be a string]',
            });
            expect(next).not.toBeCalled();
        });

        test('sends numberOfMinutes is not a positive number error', () => {
            expect.assertions(3);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const request: any = {
                body: { ...body, numberOfMinutes: -1 },
            };
            const response: any = {
                status,
            };
            const next = jest.fn();

            createSoloStreakBodyValidationMiddleware(request, response, next);

            expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
            expect(send).toBeCalledWith({
                message: 'child "numberOfMinutes" fails because ["numberOfMinutes" must be a positive number]',
            });
            expect(next).not.toBeCalled();
        });
    });

    describe(`createSoloStreakFromRequestMiddleware`, () => {
        test('sets response.locals.savedSoloStreak', async () => {
            expect.assertions(2);
            const userId = 'abcdefg';
            const streakName = 'streak streakName';
            const streakDescription = 'mock streak streakDescription';
            const timezone = 'Europe/London';
            const numberOfMinutes = 30;
            const visibility = IndividualVisibilityTypes.everyone;
            const save = jest.fn().mockResolvedValue(true);

            const soloStreak = jest.fn(() => ({ save }));

            const response: any = { locals: { timezone } };
            const request: any = { body: { userId, streakName, streakDescription, numberOfMinutes, visibility } };
            const next = jest.fn();

            const middleware = getCreateSoloStreakFromRequestMiddleware(soloStreak as any);

            await middleware(request, response, next);

            expect(response.locals.savedSoloStreak).toBeDefined();
            expect(next).toBeCalledWith();
        });

        test('calls next with CreateSoloStreakFromRequestMiddleware error on middleware failure', () => {
            expect.assertions(1);

            const response: any = {};
            const request: any = {};
            const next = jest.fn();
            const middleware = getCreateSoloStreakFromRequestMiddleware({} as any);

            middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.CreateSoloStreakFromRequestMiddleware, expect.any(Error)),
            );
        });
    });

    describe(`sendFormattedSoloStreakMiddleware`, () => {
        const ERROR_MESSAGE = 'error';
        const savedSoloStreak = {
            userId: 'abc',
            streakName: 'Daily Spanish',
            streakDescription: 'Practice spanish every day',
            startDate: new Date(),
        };

        test('responds with status 201 with soloStreak', () => {
            expect.assertions(4);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const soloStreakResponseLocals = {
                savedSoloStreak,
            };
            const response: any = { locals: soloStreakResponseLocals, status };
            const request: any = {};
            const next = jest.fn();

            sendFormattedSoloStreakMiddleware(request, response, next);

            expect(response.locals.user).toBeUndefined();
            expect(next).toBeCalled();
            expect(status).toBeCalledWith(ResponseCodes.created);
            expect(send).toBeCalledWith(savedSoloStreak);
        });

        test('calls next with SendFormattedSoloStreakMiddleware error on middleware failure', () => {
            expect.assertions(1);
            const send = jest.fn(() => {
                throw new Error(ERROR_MESSAGE);
            });
            const status = jest.fn(() => ({ send }));
            const response: any = { locals: { savedSoloStreak }, status };

            const request: any = {};
            const next = jest.fn();

            sendFormattedSoloStreakMiddleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.SendFormattedSoloStreakMiddleware, expect.any(Error)),
            );
        });
    });

    describe(`increaseUsersTotalLiveStreaksByOneMiddleware`, () => {
        test('increases users totalLiveStreaks by one when they create a solo streak', async () => {
            expect.assertions(2);
            const user = { _id: '_id' };

            const userModel = {
                findByIdAndUpdate: jest.fn().mockResolvedValue(true),
            };

            const response: any = { locals: { user } };
            const request: any = {};
            const next = jest.fn();

            const middleware = getIncreaseUsersTotalLiveStreaksByOneMiddleware(userModel as any);

            await middleware(request, response, next);

            expect(userModel.findByIdAndUpdate).toBeCalledWith(user._id, { $inc: { totalLiveStreaks: 1 } });
            expect(next).toBeCalled();
        });

        test('calls next with CreateSoloStreakIncreaseUsersTotalLiveStreaksByOneMiddleware error on middleware failure', () => {
            expect.assertions(1);

            const response: any = {};
            const request: any = {};
            const next = jest.fn();
            const middleware = getIncreaseUsersTotalLiveStreaksByOneMiddleware({} as any);

            middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(
                    ErrorType.CreateSoloStreakIncreaseUsersTotalLiveStreaksByOneMiddleware,
                    expect.any(Error),
                ),
            );
        });
    });

    describe(`createSoloStreakActivityFeedItemMiddleware`, () => {
        test('creates a new createSoloStreakActivity', async () => {
            expect.assertions(2);
            const user = { _id: '_id' };
            const savedSoloStreak = { _id: '_id' };
            const createActivityFeedItemFunction = jest.fn().mockResolvedValue(true);

            const response: any = { locals: { user, savedSoloStreak } };
            const request: any = {};
            const next = jest.fn();

            const middleware = getCreateSoloStreakActivityFeedItemMiddleware(createActivityFeedItemFunction as any);

            await middleware(request, response, next);

            expect(createActivityFeedItemFunction).toBeCalled();
            expect(next).not.toBeCalled();
        });

        test('calls next with CreateSoloStreakActivityMiddleware error on middleware failure', () => {
            expect.assertions(1);

            const response: any = {};
            const request: any = {};
            const next = jest.fn();
            const middleware = getCreateSoloStreakActivityFeedItemMiddleware({} as any);

            middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.CreateSoloStreakActivityFeedItemMiddleware, expect.any(Error)),
            );
        });
    });

    test('that createSoloStreak middlewares are defined in the correct order', async () => {
        expect.assertions(6);

        expect(createSoloStreakMiddlewares.length).toEqual(5);
        expect(createSoloStreakMiddlewares[0]).toBe(createSoloStreakBodyValidationMiddleware);
        expect(createSoloStreakMiddlewares[1]).toBe(createSoloStreakFromRequestMiddleware);
        expect(createSoloStreakMiddlewares[2]).toBe(sendFormattedSoloStreakMiddleware);
        expect(createSoloStreakMiddlewares[3]).toBe(increaseUsersTotalLiveStreaksByOneMiddleware);
        expect(createSoloStreakMiddlewares[4]).toBe(createSoloStreakActivityFeedItemMiddleware);
    });
});
