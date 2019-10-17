import { getServiceConfig } from './getServiceConfig';

describe('getServiceConfig', () => {
    const environmentMock = {
        NODE_ENV: 'NODE_ENV',
        PORT: 'PORT',
        DATABASE_URI: 'DATABASE_URI',
        TEST_DATABASE_URI: 'TEST_DATABASE_URI',
        AWS_ACCESS_KEY_ID: 'AWS_ACCESS_KEY_ID',
        AWS_SECRET_ACCESS_KEY: 'AWS_SECRET_ACCESS_KEY',
        AWS_REGION: 'AWS_REGION',
        STRIPE_SHAREABLE_KEY: 'STRIPE_SHAREABLE_KEY',
        STRIPE_PLAN: 'STRIPE_PLAN',
        APPLICATION_URL: 'APPLICATION_URL',
        EMAIL_USER: 'EMAIL_USER',
        EMAIL_PASSWORD: 'EMAIL_PASSWORD',
        EMAIL_FROM: 'EMAIL_FROM',
        EMAIL_TO: 'EMAIL_TO',
        COGNITO_APP_CLIENT_ID: 'COGNITO_APP_CLIENT_ID',
        COGNITO_REGION: 'COGNITO_REGION',
        COGNITO_USER_POOL_ID: 'COGNITO_USER_POOL_ID',
        COGNITO_USERNAME: 'COGNITO_USERNAME',
        COGNITO_EMAIL: 'COGNITO_EMAIL',
        COGNITO_PASSWORD: 'COGNITO_PASSWORD',
    };

    test('that correct error is thrown when NODE_ENV is not provided', () => {
        expect.assertions(1);
        const environment = {
            ...environmentMock,
            NODE_ENV: undefined,
        };

        try {
            getServiceConfig(environment);
        } catch (err) {
            expect(err.message).toEqual('NODE_ENV is not provided.');
        }
    });

    test('that correct error is thrown when PORT is not provided', () => {
        expect.assertions(1);
        const environment = {
            ...environmentMock,
            PORT: undefined,
        };

        try {
            getServiceConfig(environment);
        } catch (err) {
            expect(err.message).toEqual('PORT is not provided.');
        }
    });

    test('that correct error is thrown when DATABASE_URI is not provided', () => {
        expect.assertions(1);
        const environment = {
            ...environmentMock,
            DATABASE_URI: undefined,
        };

        try {
            getServiceConfig(environment);
        } catch (err) {
            expect(err.message).toEqual('DATABASE_URI is not provided.');
        }
    });

    test('that correct error is thrown when TEST_DATABASE_URI is not provided', () => {
        expect.assertions(1);
        const environment = {
            ...environmentMock,
            TEST_DATABASE_URI: undefined,
        };

        try {
            getServiceConfig(environment);
        } catch (err) {
            expect(err.message).toEqual('TEST_DATABASE_URI is not provided.');
        }
    });

    test('that correct error is thrown when AWS_ACCESS_KEY_ID is not provided', () => {
        expect.assertions(1);
        const environment = {
            ...environmentMock,
            AWS_ACCESS_KEY_ID: undefined,
        };

        try {
            getServiceConfig(environment);
        } catch (err) {
            expect(err.message).toEqual('AWS_ACCESS_KEY_ID is not provided.');
        }
    });

    test('that correct error is thrown when AWS_SECRET_ACCESS_KEY is not provided', () => {
        expect.assertions(1);
        const environment = {
            ...environmentMock,
            AWS_SECRET_ACCESS_KEY: undefined,
        };

        try {
            getServiceConfig(environment);
        } catch (err) {
            expect(err.message).toEqual('AWS_SECRET_ACCESS_KEY is not provided.');
        }
    });

    test('that correct error is thrown when AWS_REGION is not provided.', () => {
        expect.assertions(1);
        const environment = {
            ...environmentMock,
            AWS_REGION: undefined,
        };

        try {
            getServiceConfig(environment);
        } catch (err) {
            expect(err.message).toEqual('AWS_REGION is not provided.');
        }
    });

    test('that correct error is thrown when STRIPE_SHAREABLE_KEY is not provided.', () => {
        expect.assertions(1);
        const environment = {
            ...environmentMock,
            STRIPE_SHAREABLE_KEY: undefined,
        };

        try {
            getServiceConfig(environment);
        } catch (err) {
            expect(err.message).toEqual('STRIPE_SHAREABLE_KEY is not provided.');
        }
    });

    test('that correct error is thrown when STRIPE_PLAN is not provided.', () => {
        expect.assertions(1);
        const environment = {
            ...environmentMock,
            STRIPE_PLAN: undefined,
        };

        try {
            getServiceConfig(environment);
        } catch (err) {
            expect(err.message).toEqual('STRIPE_PLAN is not provided.');
        }
    });

    test('that correct error is thrown when APPLICATION_URL is not provided.', () => {
        expect.assertions(1);
        const environment = {
            ...environmentMock,
            APPLICATION_URL: undefined,
        };

        try {
            getServiceConfig(environment);
        } catch (err) {
            expect(err.message).toEqual('APPLICATION_URL is not provided.');
        }
    });

    test('that correct error is thrown when EMAIL_USER is not provided.', () => {
        expect.assertions(1);
        const environment = {
            ...environmentMock,
            EMAIL_USER: undefined,
        };

        try {
            getServiceConfig(environment);
        } catch (err) {
            expect(err.message).toEqual('EMAIL_USER is not provided.');
        }
    });

    test('that correct error is thrown when EMAIL_PASSWORD is not provided.', () => {
        expect.assertions(1);
        const environment = {
            ...environmentMock,
            EMAIL_PASSWORD: undefined,
        };

        try {
            getServiceConfig(environment);
        } catch (err) {
            expect(err.message).toEqual('EMAIL_PASSWORD is not provided.');
        }
    });

    test('that correct error is thrown when EMAIL_FROM is not provided.', () => {
        expect.assertions(1);
        const environment = {
            ...environmentMock,
            EMAIL_FROM: undefined,
        };

        try {
            getServiceConfig(environment);
        } catch (err) {
            expect(err.message).toEqual('EMAIL_FROM is not provided.');
        }
    });

    test('that correct error is thrown when EMAIL_TO is not provided.', () => {
        expect.assertions(1);
        const environment = {
            ...environmentMock,
            EMAIL_TO: undefined,
        };

        try {
            getServiceConfig(environment);
        } catch (err) {
            expect(err.message).toEqual('EMAIL_TO is not provided.');
        }
    });

    test('that correct error is thrown when COGNITO_APP_CLIENT_ID is not provided.', () => {
        expect.assertions(1);
        const environment = {
            ...environmentMock,
            COGNITO_APP_CLIENT_ID: undefined,
        };

        try {
            getServiceConfig(environment);
        } catch (err) {
            expect(err.message).toEqual('COGNTIO_APP_CLIENT_ID is not provided.');
        }
    });

    test('that correct error is thrown when COGNITO_REGION is not provided.', () => {
        expect.assertions(1);
        const environment = {
            ...environmentMock,
            COGNITO_REGION: undefined,
        };

        try {
            getServiceConfig(environment);
        } catch (err) {
            expect(err.message).toEqual('COGNTIO_REGION is not provided.');
        }
    });

    test('that correct error is thrown when COGNITO_USER_POOL_ID is not provided.', () => {
        expect.assertions(1);
        const environment = {
            ...environmentMock,
            COGNITO_USER_POOL_ID: undefined,
        };

        try {
            getServiceConfig(environment);
        } catch (err) {
            expect(err.message).toEqual('COGNITO_USER_POOL_ID is not provided.');
        }
    });

    test('that correct error is thrown when COGNITO_USERNAME is not provided.', () => {
        expect.assertions(1);
        const environment = {
            ...environmentMock,
            COGNITO_USERNAME: undefined,
        };

        try {
            getServiceConfig(environment);
        } catch (err) {
            expect(err.message).toEqual('COGNITO_USERNAME is not provided.');
        }
    });

    test('that correct error is thrown when COGNITO_EMAIL is not provided.', () => {
        expect.assertions(1);
        const environment = {
            ...environmentMock,
            COGNITO_EMAIL: undefined,
        };

        try {
            getServiceConfig(environment);
        } catch (err) {
            expect(err.message).toEqual('COGNITO_EMAIL is not provided.');
        }
    });

    test('that correct error is thrown when COGNITO_PASSWORD is not provided.', () => {
        expect.assertions(1);
        const environment = {
            ...environmentMock,
            COGNITO_PASSWORD: undefined,
        };

        try {
            getServiceConfig(environment);
        } catch (err) {
            expect(err.message).toEqual('COGNITO_PASSWORD is not provided.');
        }
    });
});
