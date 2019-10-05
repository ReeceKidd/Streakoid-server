import { CustomError, ErrorType } from "./customError";

describe("customError", () => {
  test(`creates correct error when type is set to InvalidTimeZone`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.InvalidTimezone);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`400-01`);
    expect(message).toBe("Timezone is invalid.");
    expect(httpStatusCode).toBe(400);
  });

  test(`creates correct error when type is set to UserDoesNotExist`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.UserDoesNotExist);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`400-02`);
    expect(message).toBe("User does not exist.");
    expect(httpStatusCode).toBe(400);
  });

  test(`creates correct error when type is set to PasswordDoesNotMatchHash`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.PasswordDoesNotMatchHash);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`400-03`);
    expect(message).toBe("Password does not match hash.");
    expect(httpStatusCode).toBe(400);
  });

  test(`creates correct error when type is set to SoloStreakDoesNotExist`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.SoloStreakDoesNotExist);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`400-04`);
    expect(message).toBe("Solo streak does not exist.");
    expect(httpStatusCode).toBe(400);
  });

  test(`creates correct error when type is set to NoSoloStreakToDeleteFound`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.NoSoloStreakToDeleteFound);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`400-06`);
    expect(message).toBe("Solo streak does not exist.");
    expect(httpStatusCode).toBe(400);
  });

  test(`creates correct error when type is set to GetSoloStreakNoSoloStreakFound`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.GetSoloStreakNoSoloStreakFound
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`400-07`);
    expect(message).toBe("Solo streak does not exist.");
    expect(httpStatusCode).toBe(400);
  });

  test(`creates correct error when type is set to UpdatedSoloStreakNotFound`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.UpdatedSoloStreakNotFound);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`400-08`);
    expect(message).toBe("Solo streak does not exist.");
    expect(httpStatusCode).toBe(400);
  });

  test(`creates correct error when type is set to UserEmailAlreadyExists`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.UserEmailAlreadyExists);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`400-09`);
    expect(message).toBe("User email already exists.");
    expect(httpStatusCode).toBe(400);
  });

  test(`creates correct error when type is set to UsernameAlreadyExists`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.UsernameAlreadyExists);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`400-10`);
    expect(message).toBe("Username already exists.");
    expect(httpStatusCode).toBe(400);
  });

  test(`creates correct error when type is set to StripeSubscriptionUserDoesNotExist`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.CreateStripeSubscriptionUserDoesNotExist
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`400-11`);
    expect(message).toBe("User does not exist.");
    expect(httpStatusCode).toBe(400);
  });

  test(`creates correct error when type is set to CustomerIsAlreadySubscribed`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.CustomerIsAlreadySubscribed);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`400-12`);
    expect(message).toBe("User is already subscribed.");
    expect(httpStatusCode).toBe(400);
  });

  test(`creates correct error when type is set to CancelStripeSubscriptionUserDoesNotExist`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.CancelStripeSubscriptionUserDoesNotExist
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`400-13`);
    expect(message).toBe("User does not exist.");
    expect(httpStatusCode).toBe(400);
  });

  test(`creates correct error when type is set to CustomerIsNotSubscribed`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.CustomerIsNotSubscribed);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`400-14`);
    expect(message).toBe("Customer is not subscribed.");
    expect(httpStatusCode).toBe(400);
  });

  test(`creates correct error when type is set to NoUserToDeleteFound`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.NoUserToDeleteFound);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`400-15`);
    expect(message).toBe("User does not exist.");
    expect(httpStatusCode).toBe(400);
  });

  test(`creates correct error when type is set to NoCompleteSoloStreakTaskToDeleteFound`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.NoCompleteSoloStreakTaskToDeleteFound
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`400-16`);
    expect(message).toBe("Complete task does not exist.");
    expect(httpStatusCode).toBe(400);
  });

  test(`creates correct error when type is set to NoUserFound`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.NoUserFound);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`400-17`);
    expect(message).toBe("User does not exist.");
    expect(httpStatusCode).toBe(400);
  });

  test(`creates correct error when type is set to AddFriendUserDoesNotExist`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.AddFriendUserDoesNotExist);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`400-18`);
    expect(message).toBe("User does not exist.");
    expect(httpStatusCode).toBe(400);
  });

  test(`creates correct error when type is set to FriendDoesNotExist`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.FriendDoesNotExist);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`400-19`);
    expect(message).toBe("Friend does not exist.");
    expect(httpStatusCode).toBe(400);
  });

  test(`creates correct error when type is set to IsAlreadyAFriend`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.IsAlreadyAFriend);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`400-20`);
    expect(message).toBe("User is already a friend.");
    expect(httpStatusCode).toBe(400);
  });

  test(`creates correct error when type is set to DeleteUserNoUserFound`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.DeleteUserNoUserFound);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`400-21`);
    expect(message).toBe("User does not exist.");
    expect(httpStatusCode).toBe(400);
  });

  test(`creates correct error when type is set to DeleteUserFriendDoesNotExist`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.DeleteUserFriendDoesNotExist);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`400-22`);
    expect(message).toBe("Friend does not exist.");
    expect(httpStatusCode).toBe(400);
  });

  test(`creates correct error when type is set to GetFriendsUserDoesNotExist`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.GetFriendsUserDoesNotExist);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`400-23`);
    expect(message).toBe("User does not exist.");
    expect(httpStatusCode).toBe(400);
  });

  test(`creates correct error when type is set to NoGroupStreakToDeleteFound`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.NoGroupStreakToDeleteFound);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`400-24`);
    expect(message).toBe("Group streak does not exist.");
    expect(httpStatusCode).toBe(400);
  });

  test(`creates correct error when type is set to GetGroupStreakNoGroupStreakFound`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.GetGroupStreakNoGroupStreakFound
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`400-25`);
    expect(message).toBe("Group streak does not exist.");
    expect(httpStatusCode).toBe(400);
  });

  test(`creates correct error when type is set to GetStreakTrackingEventNoStreakTrackingEventFound`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.GetStreakTrackingEventNoStreakTrackingEventFound
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`400-26`);
    expect(message).toBe("Streak tracking event does not exist.");
    expect(httpStatusCode).toBe(400);
  });

  test(`creates correct error when type is set to NoStreakTrackingEventToDeleteFound`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.NoStreakTrackingEventToDeleteFound
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`400-27`);
    expect(message).toBe("Streak tracking event does not exist.");
    expect(httpStatusCode).toBe(400);
  });

  test(`creates correct error when type is set to NoAgendaJobToDeleteFound`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.NoAgendaJobToDeleteFound);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`400-28`);
    expect(message).toBe("Agenda job does not exist.");
    expect(httpStatusCode).toBe(400);
  });

  test(`creates correct error when type is set to NoFeedbackToDeleteFound`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.NoFeedbackToDeleteFound);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`400-29`);
    expect(message).toBe("Feedback does not exist.");
    expect(httpStatusCode).toBe(400);
  });

  test(`creates correct error when type is set to CreateGroupMemberStreakUserDoesNotExist`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.CreateGroupMemberStreakUserDoesNotExist
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`400-30`);
    expect(message).toBe("User does not exist.");
    expect(httpStatusCode).toBe(400);
  });

  test(`creates correct error when type is set to CreateGroupMemberStreakGroupStreakDoesNotExist`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.CreateGroupMemberStreakGroupStreakDoesNotExist
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`400-31`);
    expect(message).toBe("Group streak does not exist.");
    expect(httpStatusCode).toBe(400);
  });

  test(`creates correct error when type is set to NoGroupMemberStreakToDeleteFound`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.NoGroupMemberStreakToDeleteFound
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`400-32`);
    expect(message).toBe("Group member streak does not exist.");
    expect(httpStatusCode).toBe(400);
  });

  test(`creates correct error when type is set to GroupMemberStreakDoesNotExist`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.GroupMemberStreakDoesNotExist
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`400-33`);
    expect(message).toBe("Group member streak does not exist.");
    expect(httpStatusCode).toBe(400);
  });

  test(`creates correct error when type is set to GetGroupMemberStreakNoGroupMemberStreakFound`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.GetGroupMemberStreakNoGroupMemberStreakFound
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`400-34`);
    expect(message).toBe("Group member streak does not exist.");
    expect(httpStatusCode).toBe(400);
  });

  test(`creates correct error when type is set to GroupStreakDoesNotExist`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.GroupStreakDoesNotExist);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`400-35`);
    expect(message).toBe("Group streak does not exist.");
    expect(httpStatusCode).toBe(400);
  });

  test(`creates correct error when type is set to NoCompleteGroupMemberStreakTaskToDeleteFound`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.NoCompleteGroupMemberStreakTaskToDeleteFound
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`400-36`);
    expect(message).toBe("Group member streak task does not exist.");
    expect(httpStatusCode).toBe(400);
  });

  test(`creates correct error when type is set to GroupMemberDoesNotExist`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.GroupMemberDoesNotExist);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`400-37`);
    expect(message).toBe("Group member does not exist.");
    expect(httpStatusCode).toBe(400);
  });

  test(`creates correct error when type is set to UpdatedGroupStreakNotFound`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.UpdatedGroupStreakNotFound);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`400-38`);
    expect(message).toBe("Group streak does not exist.");
    expect(httpStatusCode).toBe(400);
  });

  test(`creates correct error when type is set to CreateGroupMemberFriendDoesNotExist`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.CreateGroupMemberFriendDoesNotExist
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`400-39`);
    expect(message).toBe("Friend does not exist.");
    expect(httpStatusCode).toBe(400);
  });

  test(`creates correct error when type is set to CreateGroupMemberGroupStreakDoesNotExist`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.CreateGroupMemberGroupStreakDoesNotExist
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`400-40`);
    expect(message).toBe("Group streak does not exist.");
    expect(httpStatusCode).toBe(400);
  });

  test(`creates correct error when type is set to NoGroupStreakFound`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.NoGroupStreakFound);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`400-41`);
    expect(message).toBe("Group streak does not exist.");
    expect(httpStatusCode).toBe(400);
  });

  test(`creates correct error when type is set to NoGroupMemberFound`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.NoGroupMemberFound);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`400-42`);
    expect(message).toBe("Group streak member does not exist.");
    expect(httpStatusCode).toBe(400);
  });

  test(`creates correct error when type is set to UpdatedUserNotFound`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.UpdatedUserNotFound);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`400-43`);
    expect(message).toBe("User does not exist.");
    expect(httpStatusCode).toBe(400);
  });

  test(`creates correct error when type is set to RequesterDoesNotExist`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.RequesterDoesNotExist);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`400-44`);
    expect(message).toBe("Requester does not exist.");
    expect(httpStatusCode).toBe(400);
  });

  test(`creates correct error when type is set to RequesteeDoesNotExist`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.RequesteeDoesNotExist);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`400-45`);
    expect(message).toBe("Requestee does not exist.");
    expect(httpStatusCode).toBe(400);
  });

  test(`creates correct error when type is set to RequesteeIsAlreadyAFriend`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.RequesteeIsAlreadyAFriend);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`400-46`);
    expect(message).toBe("Requestee is already a friend.");
    expect(httpStatusCode).toBe(400);
  });

  test(`creates correct error when type is set to NoFriendRequestToDeleteFound`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.NoFriendRequestToDeleteFound);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`400-47`);
    expect(message).toBe("No friend request to delete found.");
    expect(httpStatusCode).toBe(400);
  });

  test(`creates correct error when type is set to FriendRequestDoesNotExist`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.FriendRequestDoesNotExist);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`400-48`);
    expect(message).toBe("Friend request must exist to add friend.");
    expect(httpStatusCode).toBe(400);
  });

  test(`creates correct error when type is set to UpdatedFriendRequestNotFound`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.UpdatedFriendRequestNotFound);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`400-49`);
    expect(message).toBe("Friend request does not exist.");
    expect(httpStatusCode).toBe(400);
  });

  test(`creates correct error when type is set to TaskAlreadyCompletedToday`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.TaskAlreadyCompletedToday);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`422-01`);
    expect(message).toBe("Task already completed today.");
    expect(httpStatusCode).toBe(422);
  });

  test(`creates correct error when type is set to TaskAlreadyCompletedToday`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.GroupMemberStreakTaskAlreadyCompletedToday
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`422-02`);
    expect(message).toBe("Task already completed today.");
    expect(httpStatusCode).toBe(422);
  });

  test(`creates correct error when type is not defined`, () => {
    expect.assertions(3);

    const customError = new CustomError("Unknown" as any);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-01`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to InternalServerError`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.InternalServerError);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-01`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to RetreiveUserWithEmailMiddlewareError`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.RetreiveUserWithEmailMiddlewareError
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-02`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to CompareRequestPasswordToUserHashedPasswordMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.CompareRequestPasswordToUserHashedPasswordMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-03`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SetMinimumUserDataMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.SetMinimumUserDataMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-04`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SetJsonWebTokenExpiryInfoMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.SetJsonWebTokenExpiryInfoMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-05`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SetJsonWebTokenMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.SetJsonWebTokenMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-06`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to LoginSuccessfulMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.LoginSuccessfulMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-07`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SoloStreakExistsMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.SoloStreakExistsMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-08`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to RetreiveTimezoneHeaderMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.RetreiveTimezoneHeaderMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-09`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to ValidateTimezoneMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.ValidateTimezoneMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-10`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to RetreiveUserMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.RetreiveUserMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-11`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SetTaskCompleteTimeMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.SetTaskCompleteTimeMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-12`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SetStreakStartDateMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.SetStreakStartDateMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-13`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to HasTaskAlreadyBeenCompletedTodayMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.HasTaskAlreadyBeenCompletedTodayMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-14`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to CreateCompleteSoloStreakTaskDefinitionMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.CreateCompleteSoloStreakTaskDefinitionMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-15`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SaveTaskCompleteMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.SaveTaskCompleteMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-16`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to StreakMaintainedMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.StreakMaintainedMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-17`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SendTaskCompleteResponseMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.SendTaskCompleteResponseMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-18`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SetDayTaskWasCompletedMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.SetDayTaskWasCompletedMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-19`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to DefineCurrentTimeMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.DefineCurrentTimeMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-20`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to DefineStartDayMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.DefineStartDayMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-21`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to DefineEndDayMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.DefineEndOfDayMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-22`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to CreateSoloStreakFromRequestMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.CreateSoloStreakFromRequestMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-23`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SaveSoloStreakToDatabase`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.SaveSoloStreakToDatabaseMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-24`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SendFormattedSoloStreakMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.SendFormattedSoloStreakMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-25`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to DeleteSoloStreakMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.DeleteSoloStreakMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-26`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SendSoloStreakDeletedResponseMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.SendSoloStreakDeletedResponseMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-27`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to RetreiveSoloStreakMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.RetreiveSoloStreakMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-28`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SendSoloStreakMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.SendSoloStreakMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-29`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to FindSoloStreaksMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.FindSoloStreaksMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-30`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SendSoloStreaksMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.SendSoloStreaksMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-31`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to PatchSoloStreakMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.PatchSoloStreakMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-32`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SendUpdatedSoloStreakMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.SendUpdatedSoloStreakMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-33`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SetSearchQueryToLowercaseMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.SetSearchQueryToLowercaseMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-34`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to RetreiveUsersByUsernameRegexSearchMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.RetreiveUsersMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-35`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to FormatUsersMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.FormatUsersMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-36`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SendUsersMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.SendUsersMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-37`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to DoesUserEmailExistMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.DoesUserEmailExistMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-38`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SetUsernmaeToLowercaseMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.SetUsernameToLowercaseMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-39`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to DoesUsernameAlreadyExistMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.DoesUsernameAlreadyExistMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-40`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to HashPasswordMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.HashPasswordMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-41`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SaveUserToDatabaseMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.SaveUserToDatabaseMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-42`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SendFormattedUserMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.SendFormattedUserMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-43`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to IsUserAnExistingStripeCustomerMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.IsUserAnExistingStripeCustomerMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-44`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to CreateStripeCustomerMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.CreateStripeCustomerMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-45`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to CreateStripeSubscriptionMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.CreateStripeSubscriptionMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-46`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to HandleInitialPaymentOutcomeMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.HandleInitialPaymentOutcomeMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-47`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SendSuccessfulSubscriptionMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.SendSuccessfulSubscriptionMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-48`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to IncompletePayment`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.IncompletePayment);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-49`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to UnknownPaymentStatus`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.UnknownPaymentStatus);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-50`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to AddStripeSubscriptionToUserMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.AddStripeSubscriptionToUserMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-51`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to DoesUserHaveStripeSubscriptionMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.DoesUserHaveStripeSubscriptionMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-52`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to CancelStripeSubscriptionMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.CancelStripeSubscriptionMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-53`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to RemoveSubscriptionFromUserMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.RemoveSubscriptionFromUserMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-54`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SendSuccessfullyRemovedSubscriptionMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.SendSuccessfullyRemovedSubscriptionMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-55`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SetUserTypeToPremiumMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.SetUserTypeToPremiumMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-56`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SetUserTypeToBasicMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.SetUserTypeToBasicMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-57`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to DeleteUserMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.DeleteUserMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-58`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SendUserDeletedResponseMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.SendUserDeletedResponseMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-59`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to GetCompleteSoloStreakTasksMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.GetCompleteSoloStreakTasksMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-60`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SendCompleteSoloStreakTasksResponseMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.SendCompleteSoloStreakTasksResponseMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-61`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to DeleteCompleteSoloStreakTaskMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.DeleteCompleteSoloStreakTaskMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-62`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SendCompleteSoloStreakTaskDeletedResponseMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.SendCompleteSoloStreakTaskDeletedResponseMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-63`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to GetRetreiveUserMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.GetRetreiveUserMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-64`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SendRetreiveUserResponseMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.SendRetreiveUserResponseMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-65`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to RetreiveIncompleteSoloStreaksMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.RetreiveIncompleteSoloStreaksMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-66`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to RetreiveFriendsMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.RetreiveFriendsMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-67`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SendFormattedFriendsMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.SendFormattedFriendsMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-68`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to AddFriendRetreiveUserMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.AddFriendRetreiveUserMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-69`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to DoesFriendExistMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.DoesFriendExistMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-70`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to AddFriendToUsersFriendListMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.AddFriendToUsersFriendListMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-71`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SendUserWithNewFriendMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.SendUserWithNewFriendMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-72`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to IsAlreadyAFriendMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.IsAlreadyAFriendMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-73`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to DeleteUserGetRetreivedUserMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.DeleteUserRetreiveUserMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-74`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to DeleteFriendDoesFriendExistMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.DeleteFriendDoesFriendExistMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-75`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to DeleteFriendMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.DeleteFriendMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-76`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to GetFriendsRetreiveUserMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.GetFriendsRetreiveUserMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-77`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to FormatFriendsMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.FormatFriendsMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-78`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to GroupStreakDefineCurrentTimeMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.GroupStreakDefineCurrentTimeMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-79`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to GroupStreakDefineStartDayMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.GroupStreakDefineStartDayMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-80`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to GroupStreakDefineEndOfDayMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.GroupStreakDefineEndOfDayMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-81`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to CreateGroupStreakFromRequestMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.CreateGroupStreakMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-82`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SaveGroupStreakToDatabaseMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.SaveGroupStreakToDatabaseMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-83`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SendFormattedGroupStreakMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.SendFormattedGroupStreakMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-84`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to FindGroupStreaksMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.FindGroupStreaksMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-85`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SendGroupStreaksMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.SendGroupStreaksMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-86`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to RetreiveGroupStreaksMembersInformation`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.RetreiveGroupStreaksMembersInformation
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-87`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to DeleteGroupStreakMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.DeleteGroupStreakMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-88`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SendGroupStreakDeletedResponseMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.SendGroupStreakDeletedResponseMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-89`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to RetreiveGroupStreakMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.RetreiveGroupStreakMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-90`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SendGroupStreakMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.SendGroupStreakMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-91`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to RetreiveGroupStreakMembersInformation`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.RetreiveGroupStreakMembersInformation
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-92`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to CreateStreakTrackingEventFromRequestMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.CreateStreakTrackingEventFromRequestMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-93`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SaveStreakTrackingEventToDatabaseMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.SaveStreakTrackingEventToDatabaseMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-94`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SendFormattedStreakTrackingEventMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.SendFormattedStreakTrackingEventMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-95`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to GetStreakTrackingEventsMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.GetStreakTrackingEventsMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-96`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SendStreakTrackingEventsResponseMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.SendStreakTrackingEventsResponseMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-97`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to RetreiveStreakTrackingEventMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.RetreiveStreakTrackingEventMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-98`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SendStreakTrackingEventMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.SendStreakTrackingEventMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-99`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to DeleteStreakTrackingEventMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.DeleteStreakTrackingEventMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-100`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SendStreakTrackingEventDeletedResponseMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.SendStreakTrackingEventDeletedResponseMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-101`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to DeleteAgendaJobMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.DeleteAgendaJobMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-102`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SendAgendaJobDeletedResponseMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.SendAgendaJobDeletedResponseMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-103`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to CreateFeedbackFromRequestMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.CreateFeedbackFromRequestMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-104`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SaveFeedbackToDatabaseMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.SaveFeedbackToDatabaseMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-105`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SendFormattedFeedbackMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.SendFormattedFeedbackMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-106`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to DeleteFeedbackMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.DeleteFeedbackMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-107`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SendFeedbackDeletedResponseMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.SendFeedbackDeletedResponseMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-108`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to RetreiveGroupStreakCreatorInformationMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.RetreiveGroupStreakCreatorInformationMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-109`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to CreateGroupMemberStreakFromRequestMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.CreateGroupMemberStreakFromRequestMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-110`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SaveGroupMemberStreakToDatabaseMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.SaveGroupMemberStreakToDatabaseMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-111`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SendFormattedGroupMemberStreakMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.SendFormattedGroupMemberStreakMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-112`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to CreateGroupMemberStreakRetreiveUserMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.CreateGroupMemberStreakRetreiveUserMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-113`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to CreateGroupMemberStreakRetreiveGroupStreakMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.CreateGroupMemberStreakRetreiveGroupStreakMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-114`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to DeleteGroupMemberStreakMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.DeleteGroupMemberStreakMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-115`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SendGroupMemberStreakDeletedResponseMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.SendGroupMemberStreakDeletedResponseMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-116`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to GroupMemberStreakExistsMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.GroupMemberStreakExistsMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-117`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to CreateCompleteGroupMemberStreakTaskRetreiveUserMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.CreateCompleteGroupMemberStreakTaskRetreiveUserMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-118`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SetGroupMemberStreakTaskCompleteTimeMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.SetGroupMemberStreakTaskCompleteTimeMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-119`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SetGroupMemberStreakStartDateMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.SetGroupMemberStreakStartDateMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-120`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SetDayGroupMemberStreakTaskWasCompletedMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.SetDayGroupMemberStreakTaskWasCompletedMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-121`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to HasGroupMemberStreakTaskAlreadyBeenCompletedTodayMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.HasGroupMemberStreakTaskAlreadyBeenCompletedTodayMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-122`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SaveGroupMemberStreakTaskCompleteMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.SaveGroupMemberStreakTaskCompleteMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-123`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to GroupMemberStreakMaintainedMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.GroupMemberStreakMaintainedMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-124`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SendCompleteGroupMemberStreakTaskResponseMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.SendCompleteGroupMemberStreakTaskResponseMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-125`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to CreateCompleteGroupMemberStreakTaskDefinitionMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.CreateCompleteGroupMemberStreakTaskDefinitionMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-126`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to RetreiveGroupMemberStreakMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.RetreiveGroupMemberStreakMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-127`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SendGroupMemberStreakMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.SendGroupMemberStreakMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-128`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to GroupStreakExistsMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.GroupStreakExistsMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-129`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to CreateCompleteGroupMemberStreakTaskMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.CreateCompleteGroupMemberStreakTaskMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-130`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to DeleteCompleteGroupMemberStreakTaskMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.DeleteCompleteGroupMemberStreakTaskMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-131`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SendCompleteGroupMemberStreakTaskDeletedResponseMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.SendCompleteGroupMemberStreakTaskDeletedResponseMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-132`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to GetCompleteGroupMemberStreakTasksMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.GetCompleteGroupMemberStreakTasksMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-133`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SendCompleteGroupMemberStreakTasksResponseMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.SendCompleteGroupMemberStreakTasksResponseMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-134`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to CreateGroupStreakCreateMemberStreakFromRequestMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.CreateGroupStreakCreateMemberStreakMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-135`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to UpdateGroupStreakMembersArray`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.UpdateGroupStreakMembersArray
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-136`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to PatchGroupStreakMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.PatchGroupStreakMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-137`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SendUpdatedGroupStreakMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.SendUpdatedGroupStreakMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-138`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to CreateGroupMemberFriendExistsMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.CreateGroupMemberFriendExistsMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-139`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to CreateGroupMemberGroupStreakExistsMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.CreateGroupMemberGroupStreakExistsMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-140`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SendCreateGroupMemberResponseMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.SendCreateGroupMemberResponseMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-141`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to CreateGroupMemberCreateGroupMemberStreakMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.CreateGroupMemberCreateGroupMemberStreakMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-142`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to AddFriendToGroupStreakMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.AddFriendToGroupStreakMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-143`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to DeleteGroupMemberRetreiveGroupStreakMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.DeleteGroupMemberRetreiveGroupStreakMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-144`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to RetreiveGroupMemberMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.RetreiveGroupMemberMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-145`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to DeleteGroupMemberMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.DeleteGroupMemberMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-146`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SendGroupMemberDeletedResponseMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.SendGroupMemberDeletedResponseMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-147`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to FindGroupMemberStreaksMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.FindGroupMemberStreaksMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-148`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SendGroupMemberStreaksMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.SendGroupMemberStreaksMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-149`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to PatchUserMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.PatchUserMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-150`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SendUpdatedUserMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.SendUpdatedUserMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-151`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to RetreiveRequesterMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.RetreiveRequesterMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-152`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to RetreiveRequesterMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.RetreiveRequesteeMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-153`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to RequesteeIsAlreadyAFriendMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.RequesteeIsAlreadyAFriendMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-154`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SaveFriendRequestToDatabaseMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.SaveFriendRequestToDatabaseMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-155`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SendFriendRequestMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.SendFriendRequestMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-156`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to FindFriendRequestsMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.FindFriendRequestsMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-157`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SendFriendRequestsMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.SendFriendRequestsMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-158`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to DeleteFriendRequestMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.DeleteFriendRequestMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-159`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SendFriendRequestDeletedResponseMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.SendFriendRequestDeletedResponseMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-160`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to RetreiveFriendRequestMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.RetreiveFriendRequestMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-161`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to UpdateFriendRequestStatusMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.UpdateFriendRequestStatusMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-162`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to PatchFriendRequestMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(ErrorType.PatchFriendRequestMiddleware);
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-163`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to SendUpdatedFriendRequestMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.SendUpdatedFriendRequestMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-164`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to PopulateFriendRequestMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.PopulateFriendRequestsMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-165`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to PopulateFriendRequestMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.PopulateFriendRequestMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-166`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to PopulateUpdatedFriendRequestMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.PopulateUpdatedFriendRequestMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-167`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to PopulateGroupStreakMembersInformation`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.PopulateGroupStreakMembersInformation
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-168`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to RetreiveCreatedGroupStreakCreatorInformationMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.RetreiveCreatedGroupStreakCreatorInformationMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-169`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });

  test(`creates correct error when type is set to AddUserToFriendsFriendListMiddleware`, () => {
    expect.assertions(3);

    const customError = new CustomError(
      ErrorType.AddUserToFriendsFriendListMiddleware
    );
    const { code, message, httpStatusCode } = customError;

    expect(code).toBe(`500-170`);
    expect(message).toBe("Internal Server Error.");
    expect(httpStatusCode).toBe(500);
  });
});
