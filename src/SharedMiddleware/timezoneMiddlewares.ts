import { Request, Response, NextFunction } from 'express';
import * as moment from 'moment-timezone';
import { CustomError, ErrorType } from '../customError';
import SupportedRequestHeaders from '@streakoid/streakoid-models/lib/Types/SupportedRequestHeaders';

export const retrieveTimezoneHeaderMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const timezone = request.header(SupportedRequestHeaders.Timezone);
        if (!timezone) {
            throw new CustomError(ErrorType.MissingTimezoneHeader);
        }
        response.locals.timezone = timezone;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.RetrieveTimezoneHeaderMiddleware, err));
    }
};

export const getValidateTimezoneMiddleware = (isValidTimezone: Function) => (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { timezone } = response.locals;
        const validTimezone = isValidTimezone(timezone);
        if (!validTimezone) {
            throw new CustomError(ErrorType.InvalidTimezone);
        }
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.ValidateTimezoneMiddleware, err));
    }
};

export const validateTimezoneMiddleware = getValidateTimezoneMiddleware(moment.tz.zone);

export const timezoneMiddlewares = [retrieveTimezoneHeaderMiddleware, validateTimezoneMiddleware];
