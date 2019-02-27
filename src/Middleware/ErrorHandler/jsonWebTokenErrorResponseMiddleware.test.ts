import { getJsonWebTokenErrorResponseMiddleware } from "../../Middleware/ErrorHandler/jsonWebTokenErrorResponseMiddleware";
import { AuthResponseObject } from "Server/response";

const errorMessage = 'Failure'
const errorStatusCode = 401

describe(`jsonWebTokenErrorResponseMiddleware`, () => {
    test("should send jsonWebToken error if it is defined in response.locals", () => {

        const jsonWebTokenError = {
            auth: false,
            name: "TokenExpiredError",
            message: "jwt expired",
            expiredAt: "2019-01-16T06:15:39.000Z"
        }

        const send = jest.fn()
        const status = jest.fn(() => ({ send }))
        const response: any = { locals: { jsonWebTokenError }, status };

        const request: any = {}
        const next = jest.fn();

        const jsonWebTokenErrorResponse: AuthResponseObject = {
            message: errorMessage,
            auth: false
        }


        const middleware = getJsonWebTokenErrorResponseMiddleware(
            errorMessage,
            errorStatusCode);
        middleware(request, response, next)

        expect.assertions(4);
        expect(response.locals.jsonWebTokenError).toBeDefined()
        expect(next).not.toBeCalled()
        expect(status).toBeCalledWith(errorStatusCode)
        expect(send).toBeCalledWith(jsonWebTokenErrorResponse)
    });

    test("should call next with no paramaters when jsonWebTokenError is not defined.", () => {
        const response: any = { locals: {} };
        const request: any = {}
        const next = jest.fn();

        const middleware = getJsonWebTokenErrorResponseMiddleware(
            errorMessage,
            errorStatusCode)
        middleware(request, response, next)

        expect.assertions(1);
        expect(next).toBeCalled()
    })


    test("should call next with an error on failure", () => {

        const request: any = {}
        const response: any = {}
        const next = jest.fn();

        const middleware = getJsonWebTokenErrorResponseMiddleware(
            errorMessage,
            errorStatusCode)
        middleware(request, response, next)

        expect.assertions(1);
        expect(next).toBeCalledWith(new TypeError("Cannot destructure property `jsonWebTokenError` of 'undefined' or 'null'."))
    })


});