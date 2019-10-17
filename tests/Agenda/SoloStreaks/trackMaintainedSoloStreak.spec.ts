import mongoose from 'mongoose';

import { trackMaintainedSoloStreaks } from '.../../../src/Agenda/SoloStreaks/trackMaintainedSoloStreaks';
import streakoid from '.../../../src/streakoid';

import StreakStatus from '@streakoid/streakoid-sdk/lib/StreakStatus';
import { StreakTrackingEventTypes, StreakTypes } from '@streakoid/streakoid-sdk/lib';
import { getServiceConfig } from '../../../src/getServiceConfig';

const { TEST_DATABASE_URI, NODE_ENV } = getServiceConfig();

const username = 'trackMaintainedSoloStreakUsername';
const email = 'trackMaintainedSoloStreak@gmail.com';

jest.setTimeout(120000);

describe('trackMaintainedSoloStreak', () => {
    let userId: string;
    const streakName = 'Daily Spanish';
    const streakDescription = 'Everyday I must do 30 minutes of Spanish';

    beforeAll(async () => {
        if (NODE_ENV === 'test' && TEST_DATABASE_URI.includes('TEST')) {
            mongoose.connect(TEST_DATABASE_URI, { useNewUrlParser: true, useFindAndModify: false });
            const user = await streakoid.users.create({ username, email });
            userId = user._id;
        }
    });

    afterAll(async () => {
        if (NODE_ENV === 'test' && TEST_DATABASE_URI.includes('TEST')) {
            mongoose.connection.dropDatabase();
            mongoose.disconnect();
        }
    });

    test('updates solo streak activity and creates a streak maintained tracking event', async () => {
        expect.assertions(23);

        const soloStreak = await streakoid.soloStreaks.create({ userId, streakName, streakDescription });
        const soloStreakId = soloStreak._id;

        await streakoid.completeSoloStreakTasks.create({
            userId,
            soloStreakId,
        });

        const maintainedSoloStreaks = await streakoid.soloStreaks.getAll({
            completedToday: true,
        });

        await trackMaintainedSoloStreaks(maintainedSoloStreaks);

        const updatedSoloStreak = await streakoid.soloStreaks.getOne(soloStreakId);

        expect(updatedSoloStreak.streakName).toEqual(streakName);
        expect(updatedSoloStreak.status).toEqual(StreakStatus.live);
        expect(updatedSoloStreak.streakDescription).toEqual(streakDescription);
        expect(updatedSoloStreak.userId).toEqual(userId);
        expect(updatedSoloStreak.completedToday).toEqual(false);
        expect(updatedSoloStreak.active).toEqual(true);
        expect(updatedSoloStreak.pastStreaks.length).toEqual(0);
        expect(updatedSoloStreak.timezone).toEqual(expect.any(String));
        const currentStreak = updatedSoloStreak.currentStreak;
        expect(currentStreak.numberOfDaysInARow).toEqual(1);
        expect(currentStreak.startDate).toEqual(expect.any(String));
        expect(Object.keys(currentStreak)).toEqual(['startDate', 'numberOfDaysInARow']);
        expect(updatedSoloStreak._id).toEqual(expect.any(String));
        expect(updatedSoloStreak.createdAt).toEqual(expect.any(String));
        expect(updatedSoloStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(updatedSoloStreak).sort()).toEqual(
            [
                '_id',
                'status',
                'currentStreak',
                'completedToday',
                'active',
                'pastStreaks',
                'streakName',
                'streakDescription',
                'userId',
                'timezone',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );

        const streakTrackingEvents = await streakoid.streakTrackingEvents.getAll({
            userId,
        });
        const streakTrackingEvent = streakTrackingEvents[0];

        expect(streakTrackingEvent.type).toEqual(StreakTrackingEventTypes.maintainedStreak);
        expect(streakTrackingEvent.userId).toBeDefined();
        expect(streakTrackingEvent.streakId).toBeDefined();
        expect(streakTrackingEvent.streakType).toEqual(StreakTypes.solo);
        expect(streakTrackingEvent._id).toEqual(expect.any(String));
        expect(streakTrackingEvent.createdAt).toEqual(expect.any(String));
        expect(streakTrackingEvent.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(streakTrackingEvent).sort()).toEqual(
            ['_id', 'type', 'streakId', 'streakType', 'userId', 'createdAt', 'updatedAt', '__v'].sort(),
        );
    });
});
