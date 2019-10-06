import {
  deleteGroupMemberMiddlewares,
  groupMemberParamsValidationMiddleware,
  deleteGroupMemberMiddleware,
  sendGroupMemberDeletedResponseMiddleware,
  retreiveGroupMemberMiddleware,
  getDeleteGroupMemberMiddleware,
  getRetreiveTeamStreakMiddleware,
  retreiveTeamStreakMiddleware
} from "./deleteGroupMemberMiddlewares";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";

describe("groupMemberParamsValidationMiddleware", () => {
  const teamStreakId = "teamStreakId";
  const memberId = "memberId";
  const params = {
    teamStreakId,
    memberId
  };

  test("sends memberId is not defined error", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      params: {
        ...params,
        memberId: undefined
      }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    groupMemberParamsValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message: 'child "memberId" fails because ["memberId" is required]'
    });
    expect(next).not.toBeCalled();
  });

  test("sends memberId is not a string error", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      params: { ...params, memberId: 123 }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    groupMemberParamsValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message: 'child "memberId" fails because ["memberId" must be a string]'
    });
    expect(next).not.toBeCalled();
  });

  test("sends teamStreakId is not defined error", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      params: {
        ...params,
        teamStreakId: undefined
      }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    groupMemberParamsValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message: 'child "teamStreakId" fails because ["teamStreakId" is required]'
    });
    expect(next).not.toBeCalled();
  });

  test("sends teamStreakId is not a string error", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      params: { ...params, teamStreakId: 123 }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    groupMemberParamsValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message:
        'child "teamStreakId" fails because ["teamStreakId" must be a string]'
    });
    expect(next).not.toBeCalled();
  });
});

describe("retreiveTeamStreakMiddleware", () => {
  test("sets response.locals.teamStreak and calls next()", async () => {
    expect.assertions(4);
    const teamStreakId = "abc";
    const request: any = {
      params: { teamStreakId }
    };
    const response: any = { locals: {} };
    const next = jest.fn();
    const lean = jest.fn().mockResolvedValue(true);
    const findById = jest.fn(() => ({ lean }));
    const TeamStreakModel = { findById };
    const middleware = getRetreiveTeamStreakMiddleware(TeamStreakModel as any);

    await middleware(request, response, next);

    expect(findById).toBeCalledWith(teamStreakId);
    expect(lean).toBeCalled();
    expect(response.locals.teamStreak).toBeDefined();
    expect(next).toBeCalledWith();
  });

  test("throws NoTeamStreakFound error when group streak does not exist", async () => {
    expect.assertions(1);
    const teamStreakId = "abc";
    const request: any = {
      params: { teamStreakId }
    };
    const response: any = { locals: {} };
    const next = jest.fn();
    const lean = jest.fn().mockResolvedValue(false);
    const findById = jest.fn(() => ({ lean }));
    const TeamStreakModel = { findById };
    const middleware = getRetreiveTeamStreakMiddleware(TeamStreakModel as any);

    await middleware(request, response, next);

    expect(next).toBeCalledWith(new CustomError(ErrorType.NoTeamStreakFound));
  });

  test("throws DeleteGroupMemberRetreiveTeamStreakMiddleware error on middleware failure", async () => {
    expect.assertions(1);
    const request: any = {};
    const response: any = {};
    const next = jest.fn();
    const middleware = getRetreiveTeamStreakMiddleware({} as any);

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.DeleteGroupMemberRetreiveTeamStreakMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe("retreiveGroupMemberMiddleware", () => {
  test("sets response.locals.member and calls next()", async () => {
    expect.assertions(2);
    const memberId = "abc";
    const members = [{ memberId }];
    const teamStreak = {
      members
    };

    const request: any = {
      params: { memberId }
    };
    const response: any = { locals: { teamStreak } };
    const next = jest.fn();

    await retreiveGroupMemberMiddleware(request, response, next);

    expect(response.locals.member).toBeDefined();
    expect(next).toBeCalledWith();
  });

  test("calls next with RetreiveGroupMemberMiddleware error on middleware failure", async () => {
    expect.assertions(1);
    const request: any = {};
    const response: any = {};
    const next = jest.fn();
    const middleware = getRetreiveTeamStreakMiddleware({} as any);

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.DeleteGroupMemberRetreiveTeamStreakMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe("deleteGroupMemberMiddleware", () => {
  test("sets response.locals.deletedGroupMember", async () => {
    expect.assertions(3);
    const memberId = "abc123";
    const teamStreakId = "12345";
    const members = [{ memberId }];
    const teamStreak = {
      members
    };

    const request: any = { params: { memberId, teamStreakId } };
    const response: any = { locals: { teamStreak } };
    const next = jest.fn();
    const lean = jest.fn().mockResolvedValue(true);
    const findByIdAndUpdate = jest.fn(() => ({ lean }));
    const TeamStreakModel = {
      findByIdAndUpdate
    };
    const middleware = getDeleteGroupMemberMiddleware(TeamStreakModel as any);

    await middleware(request, response, next);

    expect(findByIdAndUpdate).toBeCalledWith(
      teamStreakId,
      { members: [] },
      { new: true }
    );
    expect(lean).toBeCalled();
    expect(next).toBeCalledWith();
  });

  test("calls next with DeleteGroupMemberMiddleware error on failure", async () => {
    expect.assertions(1);

    const request: any = {};
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getDeleteGroupMemberMiddleware({} as any);

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.DeleteGroupMemberMiddleware, expect.any(Error))
    );
  });
});

describe("sendGroupMemberDeletedResponseMiddleware", () => {
  test("responds with successful deletion", () => {
    expect.assertions(2);
    const successfulDeletionResponseCode = 204;
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {};
    const response: any = { status };
    const next = jest.fn();

    sendGroupMemberDeletedResponseMiddleware(request, response, next);

    expect(status).toBeCalledWith(successfulDeletionResponseCode);
    expect(next).not.toBeCalled();
  });

  test("that on error next is called with error", () => {
    expect.assertions(1);
    const request: any = {};
    const response: any = {};
    const next = jest.fn();

    sendGroupMemberDeletedResponseMiddleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.SendGroupMemberDeletedResponseMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe("deleteGroupMemberMiddlewares", () => {
  test("are defined in the correct order", () => {
    expect.assertions(6);

    expect(deleteGroupMemberMiddlewares.length).toEqual(5);
    expect(deleteGroupMemberMiddlewares[0]).toEqual(
      groupMemberParamsValidationMiddleware
    );
    expect(deleteGroupMemberMiddlewares[1]).toEqual(
      retreiveTeamStreakMiddleware
    );
    expect(deleteGroupMemberMiddlewares[2]).toEqual(
      retreiveGroupMemberMiddleware
    );
    expect(deleteGroupMemberMiddlewares[3]).toEqual(
      deleteGroupMemberMiddleware
    );
    expect(deleteGroupMemberMiddlewares[4]).toEqual(
      sendGroupMemberDeletedResponseMiddleware
    );
  });
});
