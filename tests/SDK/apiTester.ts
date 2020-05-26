/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import app from '../../src/app';
import supertest from 'supertest';
import { getIdToken } from '../setup/getIdToken';
import SupportedRequestHeaders from '@streakoid/streakoid-models/lib/Types/SupportedRequestHeaders';

export const apiTester = ({ databaseURI }: { databaseURI: string }) => {
    const request = supertest(app({ databaseURI }));
    const getRequest = async ({ route }: { route: string }): Promise<any> => {
        const idToken = await getIdToken();
        const response = await request
            .get(route)
            .set(SupportedRequestHeaders.Timezone, 'Europe/London')
            .set(SupportedRequestHeaders.Authorization, idToken);
        return response.body;
    };

    const getRequestActivityFeed = async ({ route }: { route: string }): Promise<any> => {
        const idToken = await getIdToken();
        return request
            .get(route)
            .set(SupportedRequestHeaders.Timezone, 'Europe/London')
            .set(SupportedRequestHeaders.Authorization, idToken);
    };

    const postRequest = async ({ route, params }: { route: string; params: any }): Promise<any> => {
        const idToken = await getIdToken();
        const response = await request
            .post(route)
            .send(params)
            .set(SupportedRequestHeaders.Timezone, 'Europe/London')
            .set(SupportedRequestHeaders.Authorization, idToken);
        return response.body;
    };

    const patchRequest = async ({ route, params }: { route: string; params: any }): Promise<any> => {
        const idToken = await getIdToken();
        const response = await request
            .patch(route)
            .send(params)
            .set(SupportedRequestHeaders.Timezone, 'Europe/London')
            .set(SupportedRequestHeaders.Authorization, idToken);
        return response.body;
    };

    const deleteRequest = async ({ route }: { route: string }): Promise<any> => {
        const idToken = await getIdToken();
        const response = await request
            .delete(route)
            .set(SupportedRequestHeaders.Timezone, 'Europe/London')
            .set(SupportedRequestHeaders.Authorization, idToken);
        return response.body;
    };

    return {
        getRequest,
        getRequestActivityFeed,
        postRequest,
        patchRequest,
        deleteRequest,
    };
};
