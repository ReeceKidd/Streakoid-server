/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    patchChallengeStreakMiddlewares,
    challengeStreakRequestBodyValidationMiddleware,
    getPatchChallengeStreakMiddleware,
    patchChallengeStreakMiddleware,
    sendUpdatedChallengeStreakMiddleware,
    challengeStreakParamsValidationMiddleware,
    getCreateArchivedChallengeStreakActivityFeedItemMiddleware,
    getCreateDeletedChallengeStreakActivityFeedItemMiddleware,
    createArchivedChallengeStreakActivityFeedItemMiddleware,
    createRestoredChallengeStreakActivityFeedItemMiddleware,
    createDeletedChallengeStreakActivityFeedItemMiddleware,
    getCreateRestoredChallengeStreakActivityFeedItemMiddleware,
    removeUserFromChallengeIfChallengeStreakIsDeletedMiddleware,
    getRemoveUserFromChallengeIfChallengeStreakIsDeletedMiddleware,
    decreaseNumberOfChallengeMembersWhenChallengeStreakIsDeletedMiddleware,
    getDecreaseNumberOfChallengeMembersWhenChallengeStreakIsDeletedMiddleware,
    getRetrieveChallengeMiddleware,
    retrieveChallengeMiddleware,
    disableChallengeStreakReminderWhenChallengeStreakIsArchivedMiddleware,
    getDisableChallengeStreakReminderWhenChallengeStreakIsArchivedMiddleware,
    decreaseUsersTotalLiveStreaksByOneWhenStreakIsArchivedMiddleware,
    getDecreaseUsersTotalLiveStreaksByOneWhenStreakIsArchivedMiddleware,
    increaseUsersTotalLiveStreaksByOneWhenStreakIsRestoredMiddleware,
    getIncreaseUsersTotalLiveStreaksByOneWhenStreakIsRestoredMiddleware,
} from './patchChallengeStreakMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import {
    CustomStreakReminder,
    CustomChallengeStreakReminder,
} from '@streakoid/streakoid-models/lib/Models/StreakReminders';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
import StreakReminderTypes from '@streakoid/streakoid-models/lib/Types/StreakReminderTypes';

describe('patchChallengeStreakMiddlewares', () => {
    describe('challengeStreakParamsValidationMiddleware', () => {
        test('sends correct error response when challengeStreakId is not defined', () => {
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

            challengeStreakParamsValidationMiddleware(request, response, next);

            expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
            expect(send).toBeCalledWith({
                message: 'child "challengeStreakId" fails because ["challengeStreakId" is required]',
            });
            expect(next).not.toBeCalled();
        });

        test('sends correct error response when challengeStreakId is not a string', () => {
            expect.assertions(3);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const request: any = {
                params: { challengeStreakId: 123 },
            };
            const response: any = {
                status,
            };
            const next = jest.fn();

            challengeStreakParamsValidationMiddleware(request, response, next);

            expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
            expect(send).toBeCalledWith({
                message: 'child "challengeStreakId" fails because ["challengeStreakId" must be a string]',
            });
            expect(next).not.toBeCalled();
        });
    });

    describe('challengeStreakRequestBodyValidationMiddleware', () => {
        test('sends correct error response when unsupported key is sent', () => {
            expect.assertions(3);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const request: any = {
                body: { unsupportedKey: 1234 },
            };
            const response: any = {
                status,
            };
            const next = jest.fn();

            challengeStreakRequestBodyValidationMiddleware(request, response, next);

            expect(status).toHaveBeenCalledWith(ResponseCodes.badRequest);
            expect(send).toBeCalledWith({
                message: '"unsupportedKey" is not allowed',
            });
            expect(next).not.toBeCalled();
        });
    });

    describe('patchChallengeStreakMiddleware', () => {
        test('sets response.locals.updatedChallengeStreak', async () => {
            expect.assertions(3);
            const challengeStreakId = 'abc123';
            const userId = '123cde';
            const streakName = 'Daily programming';
            const streakDescription = 'Do one hour of programming each day';
            const status = 'archived';
            const request: any = {
                params: { challengeStreakId },
                body: {
                    userId,
                    streakName,
                    streakDescription,
                    status,
                },
            };
            const response: any = { locals: {} };
            const next = jest.fn();
            const findByIdAndUpdate = jest.fn(() => Promise.resolve(true));
            const challengeStreakModel = {
                findByIdAndUpdate,
            };
            const middleware = getPatchChallengeStreakMiddleware(challengeStreakModel as any);

            await middleware(request, response, next);

            expect(findByIdAndUpdate).toBeCalledWith(
                challengeStreakId,
                { userId, streakName, streakDescription, status },
                { new: true },
            );
            expect(response.locals.updatedChallengeStreak).toBeDefined();
            expect(next).toBeCalledWith();
        });

        test('throws UpdatedChallengeStreakNotFound error when challenge streak is not found', async () => {
            expect.assertions(1);
            const challengeStreakId = 'abc123';
            const userId = '123cde';
            const streakName = 'Daily programming';
            const streakDescription = 'Do one hour of programming each day';
            const request: any = {
                params: { challengeStreakId },
                body: {
                    userId,
                    streakName,
                    streakDescription,
                },
            };
            const response: any = { locals: {} };
            const next = jest.fn();
            const findByIdAndUpdate = jest.fn(() => Promise.resolve(false));
            const challengeStreakModel = {
                findByIdAndUpdate,
            };
            const middleware = getPatchChallengeStreakMiddleware(challengeStreakModel as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.UpdatedChallengeStreakNotFound));
        });

        test('calls next with PatchChallengeStreakMiddleware on middleware failure', async () => {
            expect.assertions(1);

            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const middleware = getPatchChallengeStreakMiddleware({} as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.PatchChallengeStreakMiddleware));
        });
    });

    describe('retrieveChallengeMiddleware', () => {
        test('sets response.locals.challenge and calls next()', async () => {
            expect.assertions(4);
            const lean = jest.fn(() => true);
            const findOne = jest.fn(() => ({ lean }));
            const challengeModel = { findOne };
            const request: any = {};
            const response: any = { locals: { updatedChallengeStreak: { _id: '_id', challengeId: 'challengeId' } } };
            const next = jest.fn();
            const middleware = getRetrieveChallengeMiddleware(challengeModel as any);

            await middleware(request, response, next);

            expect(response.locals.challenge).toBeDefined();
            expect(findOne).toBeCalledWith({ _id: response.locals.updatedChallengeStreak.challengeId });
            expect(lean).toBeCalledWith();
            expect(next).toBeCalledWith();
        });

        test('throws PatchChallengeStreakNoChallengeFound when user does not exist', async () => {
            expect.assertions(1);
            const lean = jest.fn(() => false);
            const findOne = jest.fn(() => ({ lean }));
            const challengeModel = { findOne };
            const request: any = {};
            const response: any = { locals: { updatedChallengeStreak: { _id: '_id', challengeId: 'challengeId' } } };
            const next = jest.fn();
            const middleware = getRetrieveChallengeMiddleware(challengeModel as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.PatchChallengeStreakNoChallengeFound));
        });

        test('throws PatchChallengeStreakRetrieveChallengeMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const middleware = getRetrieveChallengeMiddleware({} as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.PatchChallengeStreakRetrieveChallengeMiddleware, expect.any(Error)),
            );
        });
    });

    describe('removeUserFromChallengeIfChallengeStreakIsDeletedMiddleware', () => {
        test('when status does not equal delete it just calls next.', async () => {
            expect.assertions(2);
            const updatedChallengeStreak = {
                _id: '_id',
                challengeId: 'challengeId',
                userId: 'userId',
            };
            const challenge = { members: ['memberId'] };
            const status = StreakStatus.archived;
            const request: any = {
                body: {
                    status,
                },
            };
            const response: any = { locals: { updatedChallengeStreak, challenge } };
            const next = jest.fn();
            const findByIdAndUpdate = jest.fn().mockResolvedValue(true);
            const challengeModel = {
                findByIdAndUpdate,
            };
            const middleware = getRemoveUserFromChallengeIfChallengeStreakIsDeletedMiddleware(challengeModel as any);

            await middleware(request, response, next);

            expect(findByIdAndUpdate).not.toBeCalled();
            expect(next).toBeCalledWith();
        });

        test('when status equals deleted it removes user from the challenge that the challenge streak belongs to.', async () => {
            expect.assertions(3);
            const updatedChallengeStreak = {
                _id: '_id',
                challengeId: 'challengeId',
                userId: 'userId',
            };
            const challenge = { members: ['memberId'] };
            const status = StreakStatus.deleted;
            const request: any = {
                body: {
                    status,
                },
            };
            const response: any = { locals: { updatedChallengeStreak, challenge } };
            const next = jest.fn();
            const findByIdAndUpdate = jest.fn().mockResolvedValue(true);
            const challengeModel = {
                findByIdAndUpdate,
            };
            const middleware = getRemoveUserFromChallengeIfChallengeStreakIsDeletedMiddleware(challengeModel as any);

            await middleware(request, response, next);

            expect(findByIdAndUpdate).toBeCalledWith(
                updatedChallengeStreak.challengeId,
                { members: ['memberId'] },
                { new: true },
            );
            expect(response.locals.updatedChallengeStreak).toBeDefined();
            expect(next).toBeCalledWith();
        });

        test('calls next with RemoveUserFromChallengeIfChallengeStreakIsDeletedMiddleware on middleware failure', async () => {
            expect.assertions(1);

            const request: any = {};
            const response: any = { locals: {} };
            const next = jest.fn();
            const middleware = getRemoveUserFromChallengeIfChallengeStreakIsDeletedMiddleware({} as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.RemoveUserFromChallengeIfChallengeStreakIsDeletedMiddleware),
            );
        });
    });

    describe('decreaseNumberOfChallengeMembersWhenChallengeStreakIsDeletedMiddleware', () => {
        test('when status does not equal delete it just calls next.', async () => {
            expect.assertions(2);
            const updatedChallengeStreak = {
                _id: '_id',
                challengeId: 'challengeId',
                userId: 'userId',
            };
            const status = StreakStatus.archived;
            const request: any = {
                body: {
                    status,
                },
            };
            const response: any = { locals: { updatedChallengeStreak } };
            const next = jest.fn();
            const findByIdAndUpdate = jest.fn().mockResolvedValue(true);
            const challengeModel = {
                findByIdAndUpdate,
            };
            const middleware = getDecreaseNumberOfChallengeMembersWhenChallengeStreakIsDeletedMiddleware(
                challengeModel as any,
            );

            await middleware(request, response, next);

            expect(findByIdAndUpdate).not.toBeCalled();
            expect(next).toBeCalledWith();
        });

        test('when status equals deleted it sets numberOfMembers to equal the new value of challenge.members.length.', async () => {
            expect.assertions(3);
            const updatedChallengeStreak = {
                _id: '_id',
                challengeId: 'challengeId',
                userId: 'userId',
            };
            const challenge = {
                members: [],
            };
            const status = StreakStatus.deleted;
            const request: any = {
                body: {
                    status,
                },
            };
            const response: any = { locals: { updatedChallengeStreak, challenge } };
            const next = jest.fn();
            const findByIdAndUpdate = jest.fn().mockResolvedValue(true);
            const challengeModel = {
                findByIdAndUpdate,
            };
            const middleware = getDecreaseNumberOfChallengeMembersWhenChallengeStreakIsDeletedMiddleware(
                challengeModel as any,
            );

            await middleware(request, response, next);

            expect(findByIdAndUpdate).toBeCalledWith(
                updatedChallengeStreak.challengeId,
                { $set: { numberOfMembers: challenge.members.length } },
                { new: true },
            );
            expect(response.locals.updatedChallengeStreak).toBeDefined();
            expect(next).toBeCalledWith();
        });

        test('calls next with DescreaseNumberOfChallengeMembersWhenChallengeStreakIsDeletedMiddleware on middleware failure', async () => {
            expect.assertions(1);

            const request: any = {};
            const response: any = { locals: {} };
            const next = jest.fn();
            const middleware = getDecreaseNumberOfChallengeMembersWhenChallengeStreakIsDeletedMiddleware({} as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.DescreaseNumberOfChallengeMembersWhenChallengeStreakIsDeletedMiddleware),
            );
        });
    });

    describe('sendUpdatedPatchMiddleware', () => {
        const ERROR_MESSAGE = 'error';
        const updatedChallengeStreak = {
            userId: 'abc',
            streakName: 'Daily Spanish',
            streakDescription: 'Practice spanish every day',
            startDate: new Date(),
        };

        test('sends updatedChallengeStreak', () => {
            expect.assertions(4);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const challengeStreakResponseLocals = { updatedChallengeStreak };
            const response: any = { locals: challengeStreakResponseLocals, status };
            const request: any = {};
            const next = jest.fn();
            const updatedResourceResponseCode = 200;

            sendUpdatedChallengeStreakMiddleware(request, response, next);

            expect(response.locals.user).toBeUndefined();
            expect(next).toBeCalled();
            expect(status).toBeCalledWith(updatedResourceResponseCode);
            expect(send).toBeCalledWith(updatedChallengeStreak);
        });

        test('calls next with SendUpdatedChallengeStreakMiddleware error on middleware failure', () => {
            expect.assertions(1);
            const send = jest.fn(() => {
                throw new Error(ERROR_MESSAGE);
            });
            const status = jest.fn(() => ({ send }));
            const response: any = { locals: { updatedChallengeStreak }, status };
            const request: any = {};
            const next = jest.fn();

            sendUpdatedChallengeStreakMiddleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.SendUpdatedChallengeStreakMiddleware, expect.any(Error)),
            );
        });
    });

    describe(`decreaseUsersTotalLiveStreaksByOneWhenStreakIsArchivedMiddleware `, () => {
        test('decreases users totalLiveStreaks by one when user archives a challenge streak', async () => {
            expect.assertions(2);
            const user = { _id: '_id' };

            const userModel = {
                findByIdAndUpdate: jest.fn().mockResolvedValue(true),
            };

            const response: any = { locals: { user } };
            const request: any = { body: { status: StreakStatus.archived } };
            const next = jest.fn();

            const middleware = getDecreaseUsersTotalLiveStreaksByOneWhenStreakIsArchivedMiddleware(userModel as any);

            await middleware(request, response, next);

            expect(userModel.findByIdAndUpdate).toBeCalledWith(user._id, { $inc: { totalLiveStreaks: -1 } });
            expect(next).toBeCalled();
        });

        test('just calls next if streak status does not equal archived.', async () => {
            expect.assertions(2);
            const user = { _id: '_id' };

            const userModel = {
                findByIdAndUpdate: jest.fn().mockResolvedValue(true),
            };

            const response: any = { locals: { user } };
            const request: any = { body: { status: StreakStatus.live } };
            const next = jest.fn();

            const middleware = getDecreaseUsersTotalLiveStreaksByOneWhenStreakIsArchivedMiddleware(userModel as any);

            await middleware(request, response, next);

            expect(userModel.findByIdAndUpdate).not.toBeCalled();
            expect(next).toBeCalled();
        });

        test('calls next with PatchChallengeStreakDecreaseUsersTotalLiveStreaksByOneWhenStreakIsArchivedMiddleware error on middleware failure', () => {
            expect.assertions(1);

            const response: any = {};
            const request: any = {};
            const next = jest.fn();
            const middleware = getDecreaseUsersTotalLiveStreaksByOneWhenStreakIsArchivedMiddleware({} as any);

            middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(
                    ErrorType.PatchChallengeStreakDecreaseUsersTotalLiveStreaksByOneWhenStreakIsArchivedMiddleware,
                    expect.any(Error),
                ),
            );
        });
    });

    describe(`increaseUsersTotalLiveStreaksByOneWhenStreakIsRestoredMiddleware `, () => {
        test('increases users totalLiveStreaks by one when user restores a challenge streak', async () => {
            expect.assertions(2);
            const user = { _id: '_id' };

            const userModel = {
                findByIdAndUpdate: jest.fn().mockResolvedValue(true),
            };

            const response: any = { locals: { user } };
            const request: any = { body: { status: StreakStatus.live } };
            const next = jest.fn();

            const middleware = getIncreaseUsersTotalLiveStreaksByOneWhenStreakIsRestoredMiddleware(userModel as any);

            await middleware(request, response, next);

            expect(userModel.findByIdAndUpdate).toBeCalledWith(user._id, { $inc: { totalLiveStreaks: 1 } });
            expect(next).toBeCalled();
        });

        test('just calls next if streak status does not equal live.', async () => {
            expect.assertions(2);
            const user = { _id: '_id' };

            const userModel = {
                findByIdAndUpdate: jest.fn().mockResolvedValue(true),
            };

            const response: any = { locals: { user } };
            const request: any = { body: { status: StreakStatus.archived } };
            const next = jest.fn();

            const middleware = getIncreaseUsersTotalLiveStreaksByOneWhenStreakIsRestoredMiddleware(userModel as any);

            await middleware(request, response, next);

            expect(userModel.findByIdAndUpdate).not.toBeCalled();
            expect(next).toBeCalled();
        });

        test('calls next with PatchChallengeStreakIncreaseUsersTotalLiveStreaksByOneWhenStreakIsRestoredMiddleware error on middleware failure', () => {
            expect.assertions(1);

            const response: any = {};
            const request: any = {};
            const next = jest.fn();
            const middleware = getIncreaseUsersTotalLiveStreaksByOneWhenStreakIsRestoredMiddleware({} as any);

            middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(
                    ErrorType.PatchChallengeStreakIncreaseUsersTotalLiveStreaksByOneWhenStreakIsRestoredMiddleware,
                    expect.any(Error),
                ),
            );
        });
    });

    describe(`disableChallengeStreakReminderWhenChallengeStreakIsArchivedMiddleware`, () => {
        test('disables current user customChallengeStreakReminder for this challenge streak if they had one.', async () => {
            expect.assertions(2);
            const _id = '_id';
            const updatedChallengeStreak = { _id, streakName: 'Reading', members: ['memberId'] };
            const customChallengeStreakReminder: CustomChallengeStreakReminder = {
                enabled: true,
                expoId: 'expoId',
                reminderHour: 21,
                reminderMinute: 0,
                streakReminderType: StreakReminderTypes.customChallengeStreakReminder,
                challengeStreakId: _id,
                challengeId: 'challengeId',
                challengeName: 'reading',
            };
            const customStreakReminders: CustomStreakReminder[] = [customChallengeStreakReminder];
            const findByIdAndUpdate = jest.fn().mockResolvedValue(true);
            const userModel = {
                findByIdAndUpdate,
            };
            const user = { pushNotifications: { customStreakReminders } };
            const response: any = { locals: { updatedChallengeStreak, user } };
            const request: any = { body: { status: StreakStatus.archived } };
            const next = jest.fn();

            const middleware = getDisableChallengeStreakReminderWhenChallengeStreakIsArchivedMiddleware(
                userModel as any,
            );

            await middleware(request, response, next);

            expect(findByIdAndUpdate).toBeCalled();
            expect(next).toBeCalled();
        });

        test('if request.body.status does not equal archived it just calls next', async () => {
            expect.assertions(2);
            const updatedChallengeStreak = { _id: '_id', streakName: 'Reading' };
            const findById = jest.fn().mockResolvedValue(true);
            const userModel = {
                findById,
            };

            const response: any = { locals: { updatedChallengeStreak } };
            const request: any = { body: {} };
            const next = jest.fn();

            const middleware = getDisableChallengeStreakReminderWhenChallengeStreakIsArchivedMiddleware(
                userModel as any,
            );

            await middleware(request, response, next);

            expect(findById).not.toBeCalled();
            expect(next).toBeCalled();
        });

        test('calls next with DisableChallengeStreakReminderWhenChallengeStreakIsArchivedMiddleware error on middleware failure', () => {
            expect.assertions(1);

            const response: any = {};
            const request: any = {};
            const next = jest.fn();
            const middleware = getDisableChallengeStreakReminderWhenChallengeStreakIsArchivedMiddleware({} as any);

            middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(
                    ErrorType.DisableChallengeStreakReminderWhenChallengeStreakIsArchivedMiddleware,
                    expect.any(Error),
                ),
            );
        });
    });

    describe(`createArchivedChallengeStreakActivityFeedItemMiddleware`, () => {
        test('creates a new archivedChallengeStreak activity if request.body.status equals archived', async () => {
            expect.assertions(2);
            const user = { _id: '_id', username: 'username' };
            const updatedChallengeStreak = { challengeId: '_id' };
            const challenge = { _id: '_id', name: 'name ' };
            const createActivityFeedItem = jest.fn().mockResolvedValue(true);

            const response: any = { locals: { user, updatedChallengeStreak, challenge } };
            const request: any = { params: {}, body: { status: StreakStatus.archived } };
            const next = jest.fn();

            const middleware = getCreateArchivedChallengeStreakActivityFeedItemMiddleware(
                createActivityFeedItem as any,
            );

            await middleware(request, response, next);

            expect(createActivityFeedItem).toBeCalled();
            expect(next).toBeCalled();
        });

        test('if request.body.status does not equal archived it just calls next', async () => {
            expect.assertions(2);
            const user = { _id: '_id' };
            const challenge = { _id: '_id' };
            const createActivityFeedItem = jest.fn().mockResolvedValue(true);

            const response: any = { locals: { user, challenge } };
            const request: any = { body: {} };
            const next = jest.fn();

            const middleware = getCreateArchivedChallengeStreakActivityFeedItemMiddleware(
                createActivityFeedItem as any,
            );

            await middleware(request, response, next);

            expect(createActivityFeedItem).not.toBeCalled();
            expect(next).toBeCalled();
        });

        test('calls next with CreateArchivedChallengeStreakActivityFeedItemMiddleware error on middleware failure', () => {
            expect.assertions(1);

            const response: any = {};
            const request: any = {};
            const next = jest.fn();
            const middleware = getCreateArchivedChallengeStreakActivityFeedItemMiddleware({} as any);

            middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.CreateArchivedChallengeStreakActivityFeedItemMiddleware, expect.any(Error)),
            );
        });
    });

    describe(`createRestoredChallengeStreakActivityFeedItemMiddleware`, () => {
        test('creates a new restoredChallengeStreak activity if request.body.status equals live', async () => {
            expect.assertions(2);
            const user = { _id: '_id', username: 'username' };
            const updatedChallengeStreak = { challengeId: '_id' };
            const challenge = { _id: '_id', name: 'name ' };
            const createActivityFeedItem = jest.fn().mockResolvedValue(true);

            const response: any = { locals: { user, updatedChallengeStreak, challenge } };
            const request: any = { params: {}, body: { status: StreakStatus.live } };
            const next = jest.fn();

            const middleware = getCreateRestoredChallengeStreakActivityFeedItemMiddleware(
                createActivityFeedItem as any,
            );

            await middleware(request, response, next);

            expect(createActivityFeedItem).toBeCalled();
            expect(next).toBeCalled();
        });

        test('if request.body.status does not equal live it just calls next', async () => {
            expect.assertions(2);
            const user = { _id: '_id' };
            const challenge = { _id: '_id' };
            const createActivityFeedItem = jest.fn().mockResolvedValue(true);

            const response: any = { locals: { user, challenge } };
            const request: any = { body: {} };
            const next = jest.fn();

            const middleware = getCreateRestoredChallengeStreakActivityFeedItemMiddleware(
                createActivityFeedItem as any,
            );

            await middleware(request, response, next);

            expect(createActivityFeedItem).not.toBeCalled();
            expect(next).toBeCalled();
        });

        test('calls next with CreateRestoreChallengeStreakActivityFeedItemMiddleware error on middleware failure', () => {
            expect.assertions(1);

            const response: any = {};
            const request: any = {};
            const next = jest.fn();
            const middleware = getCreateRestoredChallengeStreakActivityFeedItemMiddleware({} as any);

            middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.CreateRestoredChallengeStreakActivityFeedItemMiddleware, expect.any(Error)),
            );
        });
    });

    describe(`createDeletedChallengeStreakActivityFeedItemMiddleware`, () => {
        test('creates a new deletedChallengeStreak activity if request.body.status equals deleted', async () => {
            expect.assertions(2);
            const user = { _id: '_id', username: 'username' };
            const updatedChallengeStreak = { challengeId: '_id' };
            const challenge = { _id: '_id', name: 'name ' };
            const createActivityFeedItem = jest.fn().mockResolvedValue(true);

            const response: any = { locals: { user, updatedChallengeStreak, challenge } };
            const request: any = { params: {}, body: { status: StreakStatus.deleted } };
            const next = jest.fn();

            const middleware = getCreateDeletedChallengeStreakActivityFeedItemMiddleware(createActivityFeedItem as any);

            await middleware(request, response, next);

            expect(createActivityFeedItem).toBeCalled();
            expect(next).not.toBeCalled();
        });

        test('if request.body.status does not equal deleted it just calls next', async () => {
            expect.assertions(2);
            const user = { _id: '_id' };
            const challenge = { _id: '_id' };
            const createActivityFeedItem = jest.fn().mockResolvedValue(true);

            const response: any = { locals: { user, challenge } };
            const request: any = { body: {} };
            const next = jest.fn();

            const middleware = getCreateDeletedChallengeStreakActivityFeedItemMiddleware(createActivityFeedItem as any);

            await middleware(request, response, next);

            expect(createActivityFeedItem).not.toBeCalled();
            expect(next).not.toBeCalled();
        });

        test('calls next with CreateRestoreChallengeStreakActivityFeedItemMiddleware error on middleware failure', () => {
            expect.assertions(1);

            const response: any = {};
            const request: any = {};
            const next = jest.fn();
            const middleware = getCreateDeletedChallengeStreakActivityFeedItemMiddleware({} as any);

            middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.CreateDeletedChallengeStreakActivityFeedItemMiddleware, expect.any(Error)),
            );
        });
    });

    test('are defined in the correct order', () => {
        expect.assertions(14);

        expect(patchChallengeStreakMiddlewares.length).toBe(13);
        expect(patchChallengeStreakMiddlewares[0]).toBe(challengeStreakParamsValidationMiddleware);
        expect(patchChallengeStreakMiddlewares[1]).toBe(challengeStreakRequestBodyValidationMiddleware);
        expect(patchChallengeStreakMiddlewares[2]).toBe(patchChallengeStreakMiddleware);
        expect(patchChallengeStreakMiddlewares[3]).toBe(retrieveChallengeMiddleware);
        expect(patchChallengeStreakMiddlewares[4]).toBe(removeUserFromChallengeIfChallengeStreakIsDeletedMiddleware);
        expect(patchChallengeStreakMiddlewares[5]).toBe(
            decreaseNumberOfChallengeMembersWhenChallengeStreakIsDeletedMiddleware,
        );
        expect(patchChallengeStreakMiddlewares[6]).toBe(sendUpdatedChallengeStreakMiddleware);
        expect(patchChallengeStreakMiddlewares[7]).toBe(
            decreaseUsersTotalLiveStreaksByOneWhenStreakIsArchivedMiddleware,
        );
        expect(patchChallengeStreakMiddlewares[8]).toBe(
            increaseUsersTotalLiveStreaksByOneWhenStreakIsRestoredMiddleware,
        );
        expect(patchChallengeStreakMiddlewares[9]).toBe(
            disableChallengeStreakReminderWhenChallengeStreakIsArchivedMiddleware,
        );
        expect(patchChallengeStreakMiddlewares[10]).toBe(createArchivedChallengeStreakActivityFeedItemMiddleware);
        expect(patchChallengeStreakMiddlewares[11]).toBe(createRestoredChallengeStreakActivityFeedItemMiddleware);
        expect(patchChallengeStreakMiddlewares[12]).toBe(createDeletedChallengeStreakActivityFeedItemMiddleware);
    });
});
