/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    createStripeCustomerSubscriptionMiddlewares,
    createStripeCustomerSubscriptionBodyValidationMiddleware,
    createStripeCustomerMiddleware,
    createStripeSubscriptionMiddleware,
    handleInitialPaymentOutcomeMiddleware,
    sendSuccessfulSubscriptionMiddleware,
    stripe,
    isUserAnExistingStripeCustomerMiddleware,
    getIsUserAnExistingStripeCustomerMiddleware,
    addStripeSubscriptionToUserMiddleware,
    getAddStripeSubscriptionToUserMiddleware,
    getUpdateUserMembershipInformationMiddleware,
    validateStripeTokenMiddleware,
    updateUserStripeCustomerIdMiddleware,
    getUpdateUserStripeCustomerIdMiddleware,
    updateUserMembershipInformationMiddleware,
    getDetermineStripePaymentPlanMiddleware,
    determineStripePaymentPlanMiddleware,
    formattedUserMiddleware,
    getFormattedUserMiddleware,
} from './createStripeCustomerSubscriptionMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import PaymentPlans from '@streakoid/streakoid-models/lib/Types/PaymentPlans';
import { getMockUser } from '../../testHelpers/getMockUser';
import { getFormattedUser } from '../../formatters/getFormattedUser';
import { correctFormattedUserKeys } from '../../testHelpers/correctFormattedUserKeys';

describe('createStripeCustomerSubscriptionMiddlewares', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('createStripeCustomerSubscriptionBodyValidationMiddleware', () => {
        const userId = 'id';
        const token = { id: 'tok_1' };
        const paymentPlan = PaymentPlans.Annually;
        const body = {
            userId,
            token,
            paymentPlan,
        };

        test('sends correct error response when unsupported key is sent', () => {
            expect.assertions(3);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const request: any = {
                body: { ...body, unsupportedKey: 1234 },
            };
            const response: any = {
                status,
            };
            const next = jest.fn();

            createStripeCustomerSubscriptionBodyValidationMiddleware(request, response, next);

            expect(status).toHaveBeenCalledWith(400);
            expect(send).toBeCalledWith({
                message: '"unsupportedKey" is not allowed',
            });
            expect(next).not.toBeCalled();
        });

        test('sends correct error response when token is not defined', () => {
            expect.assertions(3);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const request: any = {
                body: { ...body, token: undefined },
            };
            const response: any = {
                status,
            };
            const next = jest.fn();

            createStripeCustomerSubscriptionBodyValidationMiddleware(request, response, next);

            expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
            expect(send).toBeCalledWith({
                message: 'child "token" fails because ["token" is required]',
            });
            expect(next).not.toBeCalled();
        });

        test('sends correct error response when token is not an object', () => {
            expect.assertions(3);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const request: any = {
                body: { ...body, token: 'token' },
            };
            const response: any = {
                status,
            };
            const next = jest.fn();

            createStripeCustomerSubscriptionBodyValidationMiddleware(request, response, next);

            expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
            expect(send).toBeCalledWith({
                message: 'child "token" fails because ["token" must be an object]',
            });
            expect(next).not.toBeCalled();
        });

        test('sends correct error response when userId is not defined', () => {
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

            createStripeCustomerSubscriptionBodyValidationMiddleware(request, response, next);

            expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
            expect(send).toBeCalledWith({
                message: 'child "userId" fails because ["userId" is required]',
            });
            expect(next).not.toBeCalled();
        });

        test('sends correct error response when userId is not a string', () => {
            expect.assertions(3);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const request: any = {
                body: { ...body, userId: 1234 },
            };
            const response: any = {
                status,
            };
            const next = jest.fn();

            createStripeCustomerSubscriptionBodyValidationMiddleware(request, response, next);

            expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
            expect(send).toBeCalledWith({
                message: 'child "userId" fails because ["userId" must be a string]',
            });
            expect(next).not.toBeCalled();
        });

        test('sends correct error response when paymentPlan is not defined', () => {
            expect.assertions(3);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const request: any = {
                body: { ...body, paymentPlan: undefined },
            };
            const response: any = {
                status,
            };
            const next = jest.fn();

            createStripeCustomerSubscriptionBodyValidationMiddleware(request, response, next);

            expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
            expect(send).toBeCalledWith({
                message: 'child "paymentPlan" fails because ["paymentPlan" is required]',
            });
            expect(next).not.toBeCalled();
        });

        test('sends correct error response when paymentPlan is not equal to one of the allowed values', () => {
            expect.assertions(3);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const request: any = {
                body: { ...body, paymentPlan: 'Biannually' },
            };
            const response: any = {
                status,
            };
            const next = jest.fn();

            createStripeCustomerSubscriptionBodyValidationMiddleware(request, response, next);

            expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
            expect(send).toBeCalledWith({
                message: 'child "paymentPlan" fails because ["paymentPlan" must be one of [Monthly, Annually]]',
            });
            expect(next).not.toBeCalled();
        });
    });

    describe('isUserAnExistingStripeCustomerMiddleware', () => {
        test('calls next if user exists and is not premium already', async () => {
            expect.assertions(2);
            const userId = 'id';
            const findById = jest.fn().mockResolvedValue({
                membershipInformation: {
                    isPayingMember: false,
                },
            });
            const userModel: any = {
                findById,
            };
            const request: any = {
                body: {
                    userId,
                },
            };
            const response: any = {
                locals: {},
            };
            const next = jest.fn();
            const isUserAnExistingStripeCustomerMiddleware = getIsUserAnExistingStripeCustomerMiddleware(userModel);

            await isUserAnExistingStripeCustomerMiddleware(request, response, next);

            expect(findById).toBeCalledWith(userId);
            expect(next).toBeCalledWith();
        });

        test("calls next with StripeSubscriptionUserDoesNotExist error if user doesn't exist", async () => {
            expect.assertions(1);
            const userId = 'userId';
            const findById = jest.fn().mockResolvedValue(false);
            const userModel: any = {
                findById,
            };
            const request: any = {
                body: {
                    userId,
                },
            };
            const response: any = {
                locals: {},
            };
            const next = jest.fn();
            const isUserAnExistingStripeCustomerMiddleware = getIsUserAnExistingStripeCustomerMiddleware(userModel);

            await isUserAnExistingStripeCustomerMiddleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.CreateStripeSubscriptionUserDoesNotExist));
        });

        test('calls next with CustomerIsAlreadySubscribed error if user userType is set to premium', async () => {
            expect.assertions(1);
            const findById = jest.fn().mockResolvedValue({
                membershipInformation: {
                    isPayingMember: true,
                },
            });
            const userModel: any = {
                findById,
            };
            const userId = '123';
            const request: any = {
                body: {
                    userId,
                },
            };
            const response: any = {
                locals: {},
            };
            const next = jest.fn();
            const isUserAnExistingStripeCustomerMiddleware = getIsUserAnExistingStripeCustomerMiddleware(userModel);

            await isUserAnExistingStripeCustomerMiddleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.CustomerIsAlreadySubscribed));
        });

        test('calls next with IsUserAnExistingStripeCustomerMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const userId = 'userId';
            const userModel: any = {};
            const request: any = {
                body: {
                    userId,
                },
            };
            const response: any = {
                locals: {},
            };
            const next = jest.fn();
            const isUserAnExistingStripeCustomerMiddleware = getIsUserAnExistingStripeCustomerMiddleware(userModel);

            await isUserAnExistingStripeCustomerMiddleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.IsUserAnExistingStripeCustomerMiddleware, expect.any(Error)),
            );
        });
    });

    describe('validateStripeTokenMiddleware', () => {
        test('calls next() if token has an id and email', () => {
            expect.assertions(1);
            const id = 'id';
            const email = 'test@gmail.com';
            const token = {
                id,
                email,
            };
            const request: any = {
                body: { token },
            };
            const response: any = {};
            const next = jest.fn();

            validateStripeTokenMiddleware(request, response, next);

            expect(next).toBeCalledWith();
        });

        test('calls next with StripeTokenMissingId error when status is incomplete', () => {
            expect.assertions(1);
            const email = 'test@gmail.com';
            const token = {
                email,
            };
            const request: any = {
                body: { token },
            };
            const response: any = {};
            const next = jest.fn();

            validateStripeTokenMiddleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.StripeTokenMissingId, expect.any(Error)));
        });

        test('calls next with StripeTokenMissingEmail error when status is incomplete', () => {
            expect.assertions(1);
            const id = 'id';
            const token = {
                id,
            };
            const request: any = {
                body: { token },
            };
            const response: any = {};
            const next = jest.fn();

            validateStripeTokenMiddleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.StripeTokenMissingEmail, expect.any(Error)));
        });

        test('calls next with ValidateStripeTokenMiddleware on middleware failure', () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {
                locals: {},
            };
            const next = jest.fn();

            validateStripeTokenMiddleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.ValidateStripeTokenMiddleware, expect.any(Error)));
        });
    });

    describe('createStripeCustomerMiddleware', () => {
        test('creates stripe customer and sets response.locals.customer', async () => {
            expect.assertions(3);
            const tokenId = 'tokenId';
            const email = 'test@gmail.com';
            const token = {
                id: tokenId,
                email,
            };
            const customerId = '123';
            stripe.customers.create = jest.fn().mockResolvedValue({ id: customerId });
            const request: any = {
                body: {
                    token,
                },
            };
            const response: any = {
                locals: {},
            };
            const next = jest.fn();

            await createStripeCustomerMiddleware(request, response, next);

            expect(stripe.customers.create).toBeCalledWith({ source: token.id, email: token.email });
            expect(response.locals.stripeCustomer).toBeDefined();
            expect(next).toBeCalledWith();
        });

        test('sends stripe error response on stripe.customers.create failure', async () => {
            expect.assertions(4);
            const tokenId = 'tokenId';
            const email = 'test@gmail.com';
            const token = {
                id: tokenId,
                email,
            };
            const errorResponse = { response: { error: 'error' } };
            stripe.customers.create = jest.fn().mockRejectedValue(errorResponse);
            const request: any = {
                body: {
                    token,
                },
            };
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const response: any = {
                locals: {},
                status,
            };
            const next = jest.fn();

            await createStripeCustomerMiddleware(request, response, next);

            expect(stripe.customers.create).toBeCalledWith({ source: token.id, email: token.email });
            expect(status).toBeCalledWith(ResponseCodes.badRequest);
            expect(send).toBeCalledWith(errorResponse);
            expect(next).not.toBeCalled();
        });

        test('calls next with CreateStripeCustomerMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();

            await createStripeCustomerMiddleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.CreateStripeCustomerMiddleware, expect.any(Error)));
        });
    });

    describe('updateUserStripeCustomerIdMiddleware', () => {
        test('updates user stripe customer with stripe id. ', async () => {
            expect.assertions(2);
            const userId = 'userId';
            const stripeCustomer = {
                id: 'abc',
            };
            const request: any = { body: { userId } };
            const response: any = {
                locals: {
                    stripeCustomer,
                },
            };
            const next = jest.fn();
            const findByIdAndUpdate = jest.fn().mockResolvedValue(true);
            const userModel = {
                findByIdAndUpdate,
            };
            const updateUserStripeCustomerIdMiddleware = getUpdateUserStripeCustomerIdMiddleware(userModel as any);

            await updateUserStripeCustomerIdMiddleware(request, response, next);

            expect(findByIdAndUpdate).toBeCalledWith(userId, {
                $set: { 'stripe.customer': stripeCustomer.id },
            });
            expect(next).toBeCalledWith();
        });

        test('calls next with CreateStripeCustomerMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const userModel: any = {};
            const updateUserStripeCustomerIdMiddleware = getUpdateUserStripeCustomerIdMiddleware(userModel as any);

            await updateUserStripeCustomerIdMiddleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.CreateStripeCustomerMiddleware, expect.any(Error)));
        });
    });

    describe('determineStripePaymentPlanMiddleware', () => {
        test('sets response.locals.stripePaymentPlan to the annual plan when request.body.paymentPlan equals annual', async () => {
            expect.assertions(2);
            const paymentPlan = PaymentPlans.Annually;
            const stripeAnnualPlan = 'annual';
            const stripeMonthlyPlan = 'monthly';
            const determineStripePaymentPlanMiddleware = getDetermineStripePaymentPlanMiddleware(
                stripeAnnualPlan,
                stripeMonthlyPlan,
            );
            stripe.subscriptions.create = jest.fn().mockResolvedValue({});
            const request: any = { body: { paymentPlan } };
            const response: any = {
                locals: {},
            };
            const next = jest.fn();

            determineStripePaymentPlanMiddleware(request, response, next);

            expect(response.locals.stripePaymentPlan).toEqual(stripeAnnualPlan);
            expect(next).toBeCalledWith();
        });

        test('sets response.locals.stripePaymentPlan to the monthly plan when request.body.paymentPlan equals monthly', async () => {
            expect.assertions(2);
            const paymentPlan = PaymentPlans.Monthly;
            const stripeAnnualPlan = 'annual';
            const stripeMonthlyPlan = 'monthly';
            const determineStripePaymentPlanMiddleware = getDetermineStripePaymentPlanMiddleware(
                stripeAnnualPlan,
                stripeMonthlyPlan,
            );
            stripe.subscriptions.create = jest.fn().mockResolvedValue({});
            const request: any = { body: { paymentPlan } };
            const response: any = {
                locals: {},
            };
            const next = jest.fn();

            determineStripePaymentPlanMiddleware(request, response, next);

            expect(response.locals.stripePaymentPlan).toEqual(stripeMonthlyPlan);
            expect(next).toBeCalledWith();
        });

        test('calls next with DetermineStripePaymentPlanMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();

            await createStripeSubscriptionMiddleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.CreateStripeSubscriptionMiddleware));
        });
    });

    describe('createStripeSubscriptionMiddleware', () => {
        test('creates stripe subscription for correct plan', async () => {
            expect.assertions(3);
            const stripeCustomer = {
                id: '123',
            };
            const stripePaymentPlan = 'abcd123';
            stripe.subscriptions.create = jest.fn().mockResolvedValue({});
            const request: any = {};
            const response: any = {
                locals: {
                    stripeCustomer,
                    stripePaymentPlan,
                },
            };
            const next = jest.fn();

            await createStripeSubscriptionMiddleware(request, response, next);

            expect(stripe.subscriptions.create).toBeCalledWith({
                customer: stripeCustomer.id,
                items: [{ plan: stripePaymentPlan }],
                expand: ['latest_invoice.payment_intent'],
            });
            expect(response.locals.stripeSubscription).toBeDefined();
            expect(next).toBeCalledWith();
        });

        test('sends stripe error response on create stripe subscription failure', async () => {
            expect.assertions(4);
            const stripeCustomer = {
                id: '123',
            };
            const stripePaymentPlan = 'abcd123';
            const errorResponse = { response: { error: 'error' } };
            stripe.subscriptions.create = jest.fn().mockRejectedValue(errorResponse);
            const request: any = {};
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const response: any = {
                locals: {
                    stripeCustomer,
                    stripePaymentPlan,
                },
                status,
            };
            const next = jest.fn();

            await createStripeSubscriptionMiddleware(request, response, next);

            expect(stripe.subscriptions.create).toBeCalledWith({
                customer: stripeCustomer.id,
                items: [{ plan: stripePaymentPlan }],
                expand: ['latest_invoice.payment_intent'],
            });
            expect(status).toBeCalledWith(ResponseCodes.badRequest);
            expect(send).toBeCalledWith(errorResponse);
            expect(next).not.toBeCalled();
        });

        test('calls next with CreateStripeSubscriptionMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();

            await createStripeSubscriptionMiddleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.CreateStripeSubscriptionMiddleware));
        });
    });

    describe('handleInitialPaymentOutcomeMiddleware', () => {
        test(' calls next() if subscriptionStatus is active', () => {
            expect.assertions(1);
            const stripeSubscription = {
                status: 'active',
            };
            const request: any = {};
            const response: any = {
                locals: { stripeSubscription },
            };
            const next = jest.fn();

            handleInitialPaymentOutcomeMiddleware(request, response, next);

            expect(next).toBeCalledWith();
        });

        test('calls next with IncompletePayment error when status is incomplete', () => {
            expect.assertions(1);
            const incompleteSubscription = {
                status: 'incomplete',
                latest_invoice: {
                    payment_intent: {
                        status: 'incomplete',
                    },
                },
            };
            const request: any = {};
            const response: any = {
                locals: { stripeSubscription: incompleteSubscription },
            };
            const next = jest.fn();

            handleInitialPaymentOutcomeMiddleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.IncompletePayment, expect.any(Error)));
        });

        test('calls next with UnknownPaymentStatus for all other payment issues', () => {
            expect.assertions(1);
            const subscription = {
                status: undefined,
                latest_invoice: {
                    payment_intent: {
                        status: 'unknown',
                    },
                },
            };
            const request: any = {};
            const response: any = {
                locals: { stripeSubscription: subscription },
            };
            const next = jest.fn();

            handleInitialPaymentOutcomeMiddleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.UnknownPaymentStatus, expect.any(Error)));
        });

        test('calls next with HandleInitialPaymentOutcomeMiddleware on middleware failure', () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {
                locals: {},
            };
            const next = jest.fn();

            handleInitialPaymentOutcomeMiddleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.HandleInitialPaymentOutcomeMiddleware, expect.any(Error)),
            );
        });
    });

    describe('addStripeSubscriptionToUserMiddleware', () => {
        test('updates user model with stripe subscription', async () => {
            expect.assertions(2);
            const user = {
                _id: '123',
            };
            const stripeSubscription = {
                id: 'abc',
            };
            const request: any = {};
            const response: any = {
                locals: {
                    user,
                    stripeSubscription,
                },
            };
            const next = jest.fn();
            const findByIdAndUpdate = jest.fn().mockResolvedValue(true);
            const userModel = {
                findByIdAndUpdate,
            };
            const addStripeSubscriptionToUserMiddleware = getAddStripeSubscriptionToUserMiddleware(userModel as any);

            await addStripeSubscriptionToUserMiddleware(request, response, next);

            expect(findByIdAndUpdate).toBeCalledWith(user._id, {
                $set: { 'stripe.subscription': stripeSubscription.id },
            });
            expect(next).toBeCalledWith();
        });

        test('calls next with AddStripeSubscriptionToUserMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const userModel: any = {};
            const addStripeSubscriptionToUserMiddleware = getAddStripeSubscriptionToUserMiddleware(userModel);

            await addStripeSubscriptionToUserMiddleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.AddStripeSubscriptionToUserMiddleware, expect.any(Error)),
            );
        });
    });

    describe('updateUserMembershipInformation', () => {
        test('sets membershipInformation.isPaying member to true and sets the currentMembership.startDate to the current time.', async () => {
            expect.assertions(3);
            const user = {
                _id: '123',
            };
            const request: any = {};
            const response: any = {
                locals: {
                    user,
                },
            };
            const next = jest.fn();
            const lean = jest.fn().mockResolvedValue(true);
            const findByIdAndUpdate = jest.fn(() => ({ lean }));
            const userModel = {
                findByIdAndUpdate,
            };
            const middleware = getUpdateUserMembershipInformationMiddleware(userModel as any);

            await middleware(request, response, next);

            expect(lean).toBeCalledWith();
            expect(findByIdAndUpdate).toBeCalledWith(
                user._id,
                {
                    $set: {
                        membershipInformation: {
                            isPayingMember: true,
                            currentMembershipStartDate: expect.any(Date),
                        },
                    },
                },
                { new: true },
            );
            expect(next).toBeCalledWith();
        });

        test('calls next with UpdateUserMembershipInformationMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const userModel: any = {};
            const updateUserMembershipInformationMiddleware = getUpdateUserMembershipInformationMiddleware(userModel);

            await updateUserMembershipInformationMiddleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.UpdateUserMembershipInformationMiddleware, expect.any(Error)),
            );
        });
    });

    describe('formattedUserMiddleware', () => {
        test('populates response.locals.user with a formattedUser', () => {
            expect.assertions(3);
            const request: any = {};
            const user = getMockUser({ _id: 'abc' });
            const response: any = { locals: { user } };
            const next = jest.fn();

            const middleware = getFormattedUserMiddleware(getFormattedUser);

            middleware(request, response, next);

            expect(next).toBeCalled();
            expect(response.locals.user.isPayingMember).toEqual(true);
            expect(Object.keys(response.locals.user).sort()).toEqual(correctFormattedUserKeys);
        });

        test('calls next with CreateStripeSubscriptionFormatUserMiddleware error on middleware failure', () => {
            expect.assertions(1);
            const response: any = {};
            const request: any = {};
            const next = jest.fn();

            formattedUserMiddleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.CreateStripeSubscriptionFormatUserMiddleware, expect.any(Error)),
            );
        });
    });

    describe('sendSuccessfulSubscriptionMiddleware', () => {
        test('sends customer and subscription information in response', () => {
            expect.assertions(2);
            const request: any = {};
            const user = {
                id: 'abc',
                stripe: { customer: 'customer', subscription: 'subscription' },
                userType: 'userType',
            };
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const response: any = {
                locals: {
                    user,
                },
                status,
            };
            const next = jest.fn();

            sendSuccessfulSubscriptionMiddleware(request, response, next);

            expect(status).toBeCalledWith(201);
            expect(send).toBeCalledWith(user);
        });

        test('calls next with SendSuccessfulSubscriptionMiddleware on middleware failure', () => {
            expect.assertions(1);
            const request: any = {};
            const response = undefined as any;
            const next = jest.fn();

            sendSuccessfulSubscriptionMiddleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.SendSuccessfulSubscriptionMiddleware, expect.any(Error)),
            );
        });
    });

    test('are defined in the correct order', () => {
        expect.assertions(13);

        expect(createStripeCustomerSubscriptionMiddlewares.length).toEqual(12);
        expect(createStripeCustomerSubscriptionMiddlewares[0]).toBe(
            createStripeCustomerSubscriptionBodyValidationMiddleware,
        );
        expect(createStripeCustomerSubscriptionMiddlewares[1]).toBe(isUserAnExistingStripeCustomerMiddleware);
        expect(createStripeCustomerSubscriptionMiddlewares[2]).toBe(validateStripeTokenMiddleware);
        expect(createStripeCustomerSubscriptionMiddlewares[3]).toBe(createStripeCustomerMiddleware);
        expect(createStripeCustomerSubscriptionMiddlewares[4]).toBe(updateUserStripeCustomerIdMiddleware);
        expect(createStripeCustomerSubscriptionMiddlewares[5]).toBe(determineStripePaymentPlanMiddleware);
        expect(createStripeCustomerSubscriptionMiddlewares[6]).toBe(createStripeSubscriptionMiddleware);
        expect(createStripeCustomerSubscriptionMiddlewares[7]).toBe(handleInitialPaymentOutcomeMiddleware);
        expect(createStripeCustomerSubscriptionMiddlewares[8]).toBe(addStripeSubscriptionToUserMiddleware);
        expect(createStripeCustomerSubscriptionMiddlewares[9]).toBe(updateUserMembershipInformationMiddleware);
        expect(createStripeCustomerSubscriptionMiddlewares[10]).toBe(formattedUserMiddleware);
        expect(createStripeCustomerSubscriptionMiddlewares[11]).toBe(sendSuccessfulSubscriptionMiddleware);
    });
});
