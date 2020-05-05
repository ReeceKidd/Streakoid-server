/* eslint-disable @typescript-eslint/no-explicit-any */
import { resetIncompleteTeamStreaks } from './resetIncompleteTeamStreaks';
import streakoid from '../../streakoid';
import { teamStreakModel } from '../../../src/Models/TeamStreak';
import { teamMemberStreakModel } from '../../../src/Models/TeamMemberStreak';
import StreakTrackingEventTypes from '@streakoid/streakoid-models/lib/Types/StreakTrackingEventTypes';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';

describe('resetIncompleteTeamStreaks', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('incomplete team streaks current streak is reset and old streak is pushed to past streaks, lost streak activity is recorded and each teamMemberStreak is reset', async () => {
        expect.assertions(2);
        teamStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue({ data: {} }) as any;
        teamMemberStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue({ data: {} }) as any;
        streakoid.streakTrackingEvents.create = jest.fn().mockResolvedValue(true);
        const _id = '1234';
        const endDate = new Date().toString();
        const currentStreak = {
            startDate: undefined,
            numberOfDaysInARow: 0,
        };
        const userId = '5c35116059f7ba19e4e248a9';
        const member = {
            _id,
            teamMemberStreak: {
                _id,
                currentStreak,
                startDate: new Date().toString(),
                completedToday: false,
                pastStreaks: [],
                userId,
                timezone: 'Europe/London',
                createdAt: new Date().toString(),
                updatedAt: new Date().toString(),
            },
        };
        const members = [member];
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
                members,
            } as any,
        ];
        const pastStreaks = [{ numberOfDaysInARow: 0, endDate, startDate: endDate }];
        await resetIncompleteTeamStreaks(incompleteTeamStreaks as any, endDate);

        expect(teamStreakModel.findByIdAndUpdate).toBeCalledWith(_id, {
            $set: {
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
