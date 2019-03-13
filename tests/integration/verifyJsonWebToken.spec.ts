import * as request from 'supertest'
import server from '../../src/app'
import { userModel } from '../../src/Models/User';

const registeredEmail = "jsonwebtoken@gmail.com"
const registeredPassword = "12345678"

const registrationRoute = '/user/register'
const loginRoute = '/auth/login'
const verifyJsonWebTokenRoute = '/test/verify-json-web-token'


describe('auth/verify-json-web-token', () => {

    let jsonWebToken: string

    beforeAll(async () => {
        await userModel.deleteMany({});
        await request(server).post(registrationRoute).send(
            {
                "userName": "jsonwebtokenuser",
                "email": registeredEmail,
                "password": registeredPassword
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

    test(`that request passes when json web token is valid`, async () => {
        expect.assertions(3)
        const response = await request(server)
            .post(verifyJsonWebTokenRoute)
            .set({ 'x-access-token': jsonWebToken })
        expect(response.status).toEqual(200)
        expect(response.body.auth).toBe(true)
        expect(response.type).toEqual('application/json')
    })

    test('that request fails when json web token is invalid', async () => {
        const invalidJsonWebToken = 'OiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtaW5pbXVtVXNlckRhdGEiOnsiX2lkIjoiNWMzNTExNjA1OWY3YmExOWU0ZTI0OGE5IiwidXNlck5hbWUiOiJ0ZXN0ZXIifSwiaWF0IjoxNTQ3MDE0NTM5LCJleHAiOjE1NDc2MTkzMzl9.tGUQo9W8SOgktnaVvGQn6i33wUmUQPbnUDDTllIzPLw'
        expect.assertions(3)
        const response = await request(server)
            .post(verifyJsonWebTokenRoute)
            .set({ 'x-access-token': invalidJsonWebToken })
        expect(response.status).toEqual(401)
        expect(response.body.auth).toBe(false)
        expect(response.type).toEqual('application/json')
    })

    test(`that request fails when json web token is out of date.`, async () => {
        const outOfDateToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtaW5pbXVtVXNlckRhdGEiOnsiX2lkIjoiNWMzNTExNjA1OWY3YmExOWU0ZTI0OGE5IiwidXNlck5hbWUiOiJ0ZXN0ZXIifSwiaWF0IjoxNTQ3MDE0NTM5LCJleHAiOjE1NDc2MTkzMzl9.tGUQo9W8SOgktnaVvGQn6i33wUmUQPbnUDDTllIzPLw'
        expect.assertions(3)
        const response = await request(server)
            .post(verifyJsonWebTokenRoute)
            .set({ 'x-access-token': outOfDateToken })
        expect(response.status).toEqual(401)
        expect(response.body.auth).toBe(false)
        expect(response.type).toEqual('application/json')
    })


    test(`that request fails when json web token is missing from header`, async () => {
        expect.assertions(4)
        const response = await request(server).post(verifyJsonWebTokenRoute)
        expect(response.status).toEqual(401)
        expect(response.body.auth).toBe(false)
        expect(response.body.message).toBe('JSON web token is missing from header')
        expect(response.type).toEqual('application/json')
    })
})