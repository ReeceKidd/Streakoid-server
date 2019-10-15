/* eslint-disable @typescript-eslint/no-explicit-any */
import { resetIncompleteTeamMemberStreaks } from './resetIncompleteTeamMemberStreaks';
import streakoid from '../../streakoid';
import { StreakTrackingEventTypes, StreakTypes } from '@streakoid/streakoid-sdk/lib';

describe('resetIncompleteSoloStreaks', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('that incomplete teamMemberStreaks default current streak is reset, past streak is pushed to past streaks, and the teamStreak the teamMemberStreak belongs to completed today gets set to false and lost streak activity is recorded', async () => {
        expect.assertions(3);
        streakoid.teamMemberStreaks.update = jest.fn().mockResolvedValue({ data: {} });
        streakoid.teamStreaks.update = jest.fn().mockResolvedValue({ data: {} });
        streakoid.streakTrackingEvents.create = jest.fn().mockResolvedValue(true);
        const _id = '1234';
        const endDate = new Date().toString();
        const currentStreak = {
            startDate: undefined,
            numberOfDaysInARow: 0,
        };
        const userId = '5c35116059f7ba19e4e248a9';
        const teamStreakId = 'teamStreakId';
        const incompleteTeamMemberStreaks = [
            {
                _id,
                teamStreakId,
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
        await resetIncompleteTeamMemberStreaks(incompleteTeamMemberStreaks as any, endDate);

        expect(streakoid.teamMemberStreaks.update).toBeCalledWith({
            teamMemberStreakId: _id,
            updateData: {
                currentStreak: { startDate: '', numberOfDaysInARow: 0 },
                pastStreaks,
                active: false,
            },
        });

        expect(streakoid.teamStreaks.update).toBeCalledWith({
            teamStreakId,
            updateData: {
                completedToday: false,
            },
        });

        expect(streakoid.streakTrackingEvents.create).toBeCalledWith({
            type: StreakTrackingEventTypes.lostStreak,
            streakId: _id,
            userId,
            streakType: StreakTypes.teamMember,
        });
    });
});
