import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";
import {
  createStreakTrackingEventBodyValidationMiddleware,
  getSaveStreakTrackingEventToDatabaseMiddleware,
  sendFormattedStreakTrackingEventMiddleware,
  createStreakTrackingEventMiddlewares,
  saveStreakTrackingEventToDatabaseMiddleware
} from "./createStreakTrackingEventMiddleware";

describe(`createStreakTrackingEventBodyValidationMiddleware`, () => {
  const type = "LostStreak";
  const streakId = "streakId";
  const userId = "userId";

  test("check that valid request passes", () => {
    expect.assertions(1);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      body: { type, streakId, userId }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    createStreakTrackingEventBodyValidationMiddleware(request, response, next);

    expect(next).toBeCalled();
  });

  test("sends correct correct response when type is missing", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      body: { streakId, userId }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    createStreakTrackingEventBodyValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message: 'child "type" fails because ["type" is required]'
    });
    expect(next).not.toBeCalled();
  });

  test("sends correct error response when streakId is missing", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      body: { type, userId }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    createStreakTrackingEventBodyValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message: 'child "streakId" fails because ["streakId" is required]'
    });
    expect(next).not.toBeCalled();
  });

  test("sends correct error response when userId is missing", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      body: { type, streakId }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    createStreakTrackingEventBodyValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message: 'child "userId" fails because ["userId" is required]'
    });
    expect(next).not.toBeCalled();
  });

  test("sends correct error response when invalid paramater is sent", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const notAllowed = "123";
    const request: any = {
      body: {
        notAllowed,
        type,
        streakId,
        userId
      }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    createStreakTrackingEventBodyValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.badRequest);
    expect(send).toBeCalledWith({ message: '"notAllowed" is not allowed' });
    expect(next).not.toBeCalled();
  });
});

describe(`saveStreakTrackingEventToDatabaseMiddleware`, () => {
  test("sets response.locals.savedStreakTrackingEvent", async () => {
    expect.assertions(2);

    const type = "LostStreak";
    const streakId = "abcdefg";
    const userId = "12345";

    const save = jest.fn().mockResolvedValue(true);

    class StreakTrackingEvent {
      type: string;
      streakId: string;
      userId: string;

      constructor({ type, streakId, userId }: any) {
        this.type = type;
        this.streakId = streakId;
        this.userId = userId;
      }

      save() {
        return save();
      }
    }
    const request: any = { body: { type, streakId, userId } };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getSaveStreakTrackingEventToDatabaseMiddleware(
      StreakTrackingEvent as any
    );

    await middleware(request, response, next);

    expect(response.locals.savedStreakTrackingEvent).toBeDefined();
    expect(save).toBeCalledWith();
  });

  test("calls next with CreateStreakTrackingEventFromRequestMiddleware error on middleware failure", () => {
    const response: any = {};
    const request: any = {};
    const next = jest.fn();
    const middleware = getSaveStreakTrackingEventToDatabaseMiddleware(
      {} as any
    );

    middleware(request, response, next);

    expect.assertions(1);
    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.CreateStreakTrackingEventFromRequestMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe(`sendFormattedStreakTrackingEventMiddleware`, () => {
  const ERROR_MESSAGE = "error";

  test("sends savedStreakTrackingEvent in request", () => {
    expect.assertions(3);
    const type = "LostStreak";
    const streakId = "abcdefg";
    const userId = "12345";
    const savedStreakTrackingEvent = {
      type,
      streakId,
      userId
    };
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const response: any = { locals: { savedStreakTrackingEvent }, status };
    const request: any = {};
    const next = jest.fn();

    sendFormattedStreakTrackingEventMiddleware(request, response, next);

    expect(next).not.toBeCalled();
    expect(status).toBeCalledWith(ResponseCodes.created);
    expect(send).toBeCalledWith({ type, streakId, userId });
  });

  test("calls next with SendFormattedStreakTrackingEventMiddlewar error on middleware failure", () => {
    expect.assertions(1);
    const request: any = {};
    const response: any = {};
    const next = jest.fn();

    sendFormattedStreakTrackingEventMiddleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.SendFormattedStreakTrackingEventMiddleware)
    );
  });
});

describe(`createStreakTrackingEventMiddlewares`, () => {
  test("are defined in the correct order", () => {
    expect.assertions(4);

    expect(createStreakTrackingEventMiddlewares.length).toEqual(3);
    expect(createStreakTrackingEventMiddlewares[0]).toBe(
      createStreakTrackingEventBodyValidationMiddleware
    );
    expect(createStreakTrackingEventMiddlewares[1]).toBe(
      saveStreakTrackingEventToDatabaseMiddleware
    );
    expect(createStreakTrackingEventMiddlewares[2]).toBe(
      sendFormattedStreakTrackingEventMiddleware
    );
  });
});