/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-ignore */
// @ts-ignore

import jwtDecode from 'jwt-decode';
import { getServiceConfig } from '../../src/getServiceConfig';

export const getIdToken = (): string => {
    const cognitoAuthorizationToken =
        'eyJraWQiOiJkc3lrWWlWd25lakFtKzVac1wvY0JWQ3F0b3BzRng5WEpta1hkcUp4TXhyTT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJhOTgzYmE3Ni00M2M1LTQ4OTktOTJmOS1kNDIyNzNjNmI2MDgiLCJhdWQiOiI2OGFncDhiY205YmlkaGg0cDk3cmoxa2UxZyIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJldmVudF9pZCI6ImY3MTUwMWYwLTE5YjAtNDAyYy1iZjI5LTFlZWI2Y2Q5N2E2YiIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNTkwNzQxNzc1LCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuZXUtd2VzdC0xLmFtYXpvbmF3cy5jb21cL2V1LXdlc3QtMV9qek5HMnNrZTkiLCJjb2duaXRvOnVzZXJuYW1lIjoidGVzdGVyIiwiZXhwIjoxNTkwNzQ1Mzc1LCJpYXQiOjE1OTA3NDE3NzUsImVtYWlsIjoicmVlY2VAc3RyZWFrb2lkLmNvbSJ9.wAKxaMg3MKH0RI1RneukkQPdrYd2GV516z67vOZGRU-vZpp3CRkJJSYRc3nHXxd1N9yjlYbIgej5Y4DpRhBDuCgTMaerqmaVPu8RAW1jYXdHHgyEhL8UE1Zlb1cVxD0VOlXyjK6ZwR3NiRCmOt6xmAxDjlw8ODhGwJLqjhNT5zKUITsbaurA6VtW5RUl_HA6wG643DomR9nPRQpXEgdh9c7zhegR2cCrWytKA2uEFE8aKNEMoKZBxXApzkbnAtxXJbszNKi4C3Fnd9zNfHha3TcqjIPFBf8wEeNjKf1aYiSDNyWwEbwx2Etx1U_2WkU924Fpne8BpgeCeIx-lZSFSw';
    const decodedJWT: any = jwtDecode(cognitoAuthorizationToken);
    if (decodedJWT['cognito:username'] !== getServiceConfig().COGNITO_USERNAME) {
        throw new Error('You need to update your cognito authorization token to math the cognito username');
    }
    return cognitoAuthorizationToken;
};
