import { Request, Response, NextFunction } from "express";
import { UserModel } from "../../Models/User";

export const getCreateUserFromRequestMiddleware = (User) => (request: Request, response: Response, next: NextFunction) => {
    const { hashedPassword } = response.locals
    const { userName, email } = request.body
    response.locals.newUser = new User({userName, email, password: hashedPassword})
    next();
}

export const createUserFromRequestMiddleware = getCreateUserFromRequestMiddleware(UserModel)


