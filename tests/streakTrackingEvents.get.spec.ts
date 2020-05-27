// import { StreakoidFactory } from '../src/streakoid';
// import { streakoidTest } from './setup/streakoidTest';
// import { getPayingUser } from './setup/getPayingUser';
// import { isTestEnvironment } from './setup/isTestEnvironment';
// import { setUpDatabase } from './setup/setUpDatabase';
// import { tearDownDatabase } from './setup/tearDownDatabase';
// import StreakTrackingEventTypes from '@streakoid/streakoid-models/lib/Types/StreakTrackingEventTypes';
// import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';

// jest.setTimeout(120000);

// describe('GET /complete-solo-streak-tasks', () => {
//     let streakoid: StreakoidFactory;
//     let userId: string;
//     let soloStreakId: string;
//     const streakName = 'Daily Spanish';
//     const streakDescription = 'Everyday I must do 30 minutes of Spanish';

//     beforeAll(async () => {
//         if (isTestEnvironment()) {
//             await setUpDatabase();
//             const user = await getPayingUser();
//             userId = user._id;
//             streakoid = await streakoidTest();
//             const soloStreak = await streakoid.soloStreaks.create({
//                 userId,
//                 streakName,
//                 streakDescription,
//             });
//             soloStreakId = soloStreak._id;

//             await streakoid.streakTrackingEvents.create({
//                 type: StreakTrackingEventTypes.lostStreak,
//                 streakId: soloStreakId,
//                 userId,
//                 streakType: StreakTypes.solo,
//             });
//         }
//     });

//     afterAll(async () => {
//         if (isTestEnvironment()) {
//             await tearDownDatabase();
//         }
//     });

//     test(`streak tracking events can be retrieved without a query paramter`, async () => {
//         expect.assertions(8);

//         const streakTrackingEvents = await streakoid.streakTrackingEvents.getAll({});
//         expect(streakTrackingEvents.length).toBeGreaterThanOrEqual(1);

//         const streakTrackingEvent = streakTrackingEvents[0];
//         expect(streakTrackingEvent._id).toEqual(expect.any(String));
//         expect(streakTrackingEvent.userId).toBeDefined();
//         expect(streakTrackingEvent.streakId).toBeDefined();
//         expect(streakTrackingEvent.streakType).toEqual(StreakTypes.solo);

//         expect(streakTrackingEvent.createdAt).toEqual(expect.any(String));
//         expect(streakTrackingEvent.updatedAt).toEqual(expect.any(String));
//         expect(Object.keys(streakTrackingEvent).sort()).toEqual(
//             ['_id', 'type', 'streakId', 'userId', 'streakType', 'createdAt', 'updatedAt', '__v'].sort(),
//         );
//     });
// });
