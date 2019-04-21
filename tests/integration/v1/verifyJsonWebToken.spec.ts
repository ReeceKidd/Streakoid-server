import * as request from 'supertest'

import server, { ApiVersions } from '../../../src/app'
import { RouteCategories } from '../../../src/versions/v1'
import { userModel } from '../../../src/Models/User';
import { UserPaths } from '../../../src/Routers/userRouter';
import { AuthPaths } from '../../../src/Routers/authRouter';
import { TestPaths } from '../../../src/Routers/testRouter';
import { ResponseCodes } from '../../../src/REST/responseCodes';

const registeredEmail = "jsonwebtoken@gmail.com"
const registeredPassword = "12345678"
const registeredUserName = "json-web-token-user"

const registrationRoute = `/${ApiVersions.v1}/${RouteCategories.user}/${UserPaths.register}`
const loginRoute = `/${ApiVersions.v1}/${RouteCategories.auth}/${AuthPaths.login}`
const verifyJsonWebTokenRoute = `/${ApiVersions.v1}/${RouteCategories.test}/${TestPaths.verifyJsonWebToken}`


describe(verifyJsonWebTokenRoute, () => {

    let jsonWebToken: string

    beforeAll(async () => {
        await request(server).post(registrationRoute).send(
            {
                userName: registeredUserName,
                email: registeredEmail,
                password: registeredPassword
            }
        )
        const loginResponse = await request(server).post(loginRoute).send(
            {
                email: registeredEmail,
                password: registeredPassword
            }
        )
        jsonWebToken = loginResponse.body.jsonWebToken
    })

    afterAll(async () => {
        await userModel.deleteOne({ email: registeredEmail })
    })

    test(`that request passes when json web token is valid`, async () => {
        expect.assertions(3)
        const response = await request(server)
            .post(verifyJsonWebTokenRoute)
            .set({ 'x-access-token': jsonWebToken })
        expect(response.status).toEqual(ResponseCodes.success)
        expect(response.body.auth).toBe(true)
        expect(response.type).toEqual('application/json')
    })

    test('that request fails when json web token is invalid', async () => {
        const invalidJsonWebToken = 'OiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtaW5pbXVtVXNlckRhdGEiOnsiX2lkIjoiNWMzNTExNjA1OWY3YmExOWU0ZTI0OGE5IiwidXNlck5hbWUiOiJ0ZXN0ZXIifSwiaWF0IjoxNTQ3MDE0NTM5LCJleHAiOjE1NDc2MTkzMzl9.tGUQo9W8SOgktnaVvGQn6i33wUmUQPbnUDDTllIzPLw'
        expect.assertions(3)
        const response = await request(server)
            .post(verifyJsonWebTokenRoute)
            .set({ 'x-access-token': invalidJsonWebToken })
        expect(response.status).toEqual(ResponseCodes.unautohorized)
        expect(response.body.auth).toBe(false)
        expect(response.type).toEqual('application/json')
    })

    test(`that request fails when json web token is out of date.`, async () => {
        const outOfDateToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtaW5pbXVtVXNlckRhdGEiOnsiX2lkIjoiNWMzNTExNjA1OWY3YmExOWU0ZTI0OGE5IiwidXNlck5hbWUiOiJ0ZXN0ZXIifSwiaWF0IjoxNTQ3MDE0NTM5LCJleHAiOjE1NDc2MTkzMzl9.tGUQo9W8SOgktnaVvGQn6i33wUmUQPbnUDDTllIzPLw'
        expect.assertions(3)
        const response = await request(server)
            .post(verifyJsonWebTokenRoute)
            .set({ 'x-access-token': outOfDateToken })
        expect(response.status).toEqual(ResponseCodes.unautohorized)
        expect(response.body.auth).toBe(false)
        expect(response.type).toEqual('application/json')
    })


    test(`that request fails when json web token is missing from header`, async () => {
        expect.assertions(4)
        const response = await request(server).post(verifyJsonWebTokenRoute)
        expect(response.status).toEqual(ResponseCodes.unautohorized)
        expect(response.body.auth).toBe(false)
        expect(response.body.message).toBe('JSON web token is missing from header')
        expect(response.type).toEqual('application/json')
    })
})