/* eslint-disable @typescript-eslint/no-explicit-any */
import { resetIncompleteTeamStreaks } from './resetIncompleteTeamStreaks';
import streakoid from '../../streakoid';
import { StreakTrackingEventTypes, StreakTypes } from '@streakoid/streakoid-sdk/lib';

describe('resetIncompleteTeamStreaks', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('that incomplete team streaks default current streak is reset and old streak is pushed to past streaks and lost streak activity is recorded', async () => {
        expect.assertions(2);
        streakoid.teamStreaks.update = jest.fn().mockResolvedValue({ data: {} });
        streakoid.streakTrackingEvents.create = jest.fn().mockResolvedValue(true);
        const _id = '1234';
        const endDate = new Date().toString();
        const currentStreak = {
            startDate: undefined,
            numberOfDaysInARow: 0,
        };
        const userId = '5c35116059f7ba19e4e248a9';
        const incompleteTeamStreaks = [
            {
                _id,
                currentStreak,
                startDate: new Date().toString(),
                completedToday: false,
                pastStreaks: [],
                streakName: 'Daily Danish',
                streakDescription: 'Each day I must do Danish',
                userId,
                timezone: 'Europe/London',
                createdAt: new Date().toString(),
                updatedAt: new Date().toString(),
            } as any,
        ];
        const pastStreaks = [{ numberOfDaysInARow: 0, endDate, startDate: endDate }];
        await resetIncompleteTeamStreaks(incompleteTeamStreaks as any, endDate);

        expect(streakoid.teamStreaks.update).toBeCalledWith({
            teamStreakId: _id,
            updateData: {
                currentStreak: { startDate: '', numberOfDaysInARow: 0 },
                pastStreaks,
                active: false,
            },
        });

        expect(streakoid.streakTrackingEvents.create).toBeCalledWith({
            type: StreakTrackingEventTypes.lostStreak,
            streakId: _id,
            streakType: StreakTypes.team,
        });
    });
});