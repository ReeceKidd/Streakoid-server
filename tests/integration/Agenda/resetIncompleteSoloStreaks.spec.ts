import { soloStreakModel } from "../../../src/Models/SoloStreak";
import request from "supertest";

import server from "../../../src/app";
import ApiVersions from "../../../src/Server/versions";
import { RouteCategories } from "../../../src/routeCategories";
import { AuthPaths } from "../../../src/Routers/authRouter";
import { SupportedRequestHeaders } from "../../../src/Server/headers";
import { userModel } from "../../../src/Models/User";
import { agendaJobModel } from "../../../src/Models/AgendaJob";
import { getIncompleteSoloStreaks } from "../../../src/Agenda/getIncompleteSoloStreaks";
import { resetIncompleteSoloStreaks } from "../../../src/Agenda/resetIncompleteSoloStreaks";

const registeredUserName = "resetIncompleteSoloStreaksUsername";
const registeredEmail = "resetIncompleteSoloStreaks@gmail.com";
const registeredPassword = "resetSoloStreaksPassword";

const registrationRoute = `/${ApiVersions.v1}/${RouteCategories.users}`;
const loginRoute = `/${ApiVersions.v1}/${RouteCategories.auth}/${AuthPaths.login}`;
const soloStreakRoute = `/${ApiVersions.v1}/${RouteCategories.soloStreaks}`;

jest.setTimeout(120000);

describe("resetIncompleteSoloStreaks", () => {

    let userId;
    let jsonWebToken;
    let soloStreakId;
    const name = "Daily Programming";
    const description = "I will program for one hour everyday";
    const timezone = "Africa/Banjul";

    beforeAll(async () => {
        const registrationResponse = await request(server)
            .post(registrationRoute)
            .send(
                {
                    userName: registeredUserName,
                    email: registeredEmail,
                    password: registeredPassword
                }
            );
        userId = registrationResponse.body._id;
        const loginResponse = await request(server)
            .post(loginRoute)
            .send(
                {
                    email: registeredEmail,
                    password: registeredPassword
                }
            );
        jsonWebToken = loginResponse.body.jsonWebToken;
        const createSoloStreakResponse = await request(server)
            .post(soloStreakRoute)
            .send({
                userId,
                name,
                description
            })
            .set({ [SupportedRequestHeaders.xAccessToken]: jsonWebToken })
            .set({ [SupportedRequestHeaders.xTimezone]: timezone });
        soloStreakId = createSoloStreakResponse.body._id;
    });

    afterAll(async () => {
        await userModel.deleteOne({ email: registeredEmail });
        await soloStreakModel.deleteOne({ _id: soloStreakId });
        await agendaJobModel.deleteOne({ "data.timezone": timezone });
    });

    test("that resetIncompleteSoloStreaks updates the current and past values of a streak", async () => {
        expect.assertions(3);
        /*
        Have to force soloStreak to have new date because streaks without a new date aren't
        considered incomplete as they haven't been started
        */
        await soloStreakModel.findByIdAndUpdate(soloStreakId, { startDate: new Date() });
        const incompleteSoloStreaks = await getIncompleteSoloStreaks(soloStreakModel, timezone);
        const defaultCurrentStreak = {
            startDate: undefined,
            numberOfDaysInARow: 0
        };
        const endDate = new Date();
        const resetIncompleteSoloStreaksPromise = await resetIncompleteSoloStreaks(soloStreakModel, incompleteSoloStreaks, defaultCurrentStreak, endDate);
        await Promise.all(resetIncompleteSoloStreaksPromise);
        const updatedSoloStreak = await soloStreakModel.findById(soloStreakId);
        expect(updatedSoloStreak.currentStreak.endDate).toBeUndefined();
        expect(updatedSoloStreak.pastStreaks.length).toBe(1);
        expect(updatedSoloStreak.pastStreaks[0].endDate).toEqual(endDate);
    });
});