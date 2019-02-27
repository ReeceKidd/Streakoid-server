import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { jwtSecret } from '../../../secret/jwt-secret';
import { IMinimumUserData } from '../../Models/User';
import { VerifyJsonWebTokenResponseLocals } from '../../Utils/verifyUsersJsonWebTokenMiddlewares';

export interface DecodedJsonWebToken {
  minimumUserData: IMinimumUserData
}

export const getDecodeJsonWebTokenMiddleware = (
  verify: Function,
  jsonWebTokenSecret: string,
) => (request: Request, response: Response, next: NextFunction) => {
  try {
    const { jsonWebToken } = response.locals as VerifyJsonWebTokenResponseLocals;
    try {
      (response.locals as VerifyJsonWebTokenResponseLocals).decodedJsonWebToken = verify(
        jsonWebToken,
        jsonWebTokenSecret,
      );
      next();
    } catch (err) {
      (response.locals as VerifyJsonWebTokenResponseLocals).jsonWebTokenError = err
      next()
    }
  } catch (err) {
    next(err);
  }
};

export const decodeJsonWebTokenMiddleware = getDecodeJsonWebTokenMiddleware(jwt.verify, jwtSecret);