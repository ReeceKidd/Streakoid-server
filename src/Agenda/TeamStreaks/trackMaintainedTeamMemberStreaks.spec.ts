/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('../../helpers/createStreakTrackingEvent', () => ({
    __esModule: true,
    createStreakTrackingEvent: jest.fn().mockResolvedValue(true),
}));
import { trackMaintainedTeamMemberStreaks } from './trackMaintainedTeamMemberStreaks';
import { teamMemberStreakModel } from '../../../src/Models/TeamMemberStreak';
import StreakTrackingEventTypes from '@streakoid/streakoid-models/lib/Types/StreakTrackingEventTypes';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
import { createStreakTrackingEvent } from '../../helpers/createStreakTrackingEvent';
import { getMockUser } from '../../testHelpers/getMockUser';
import { getMockTeamStreak } from '../../testHelpers/getMockTeamStreak';
import { userModel } from '../../Models/User';
import { getMockTeamMemberStreak } from '../../testHelpers/getMockTeamMemberStreak';

describe('trackMaintainedTeamMemberStreaks', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('sets completed today to false when streak is maintained.', async () => {
        expect.assertions(1);
        const user = getMockUser({ _id: 'userId' });
        teamMemberStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue({ data: {} }) as any;
        userModel.findById = jest.fn().mockResolvedValue(user) as any;
        userModel.findByIdAndUpdate = jest.fn().mockResolvedValue(user) as any;

        const currentStreak = {
            startDate: '24/02/95',
            numberOfDaysInARow: 1,
        };
        const teamStreak = getMockTeamStreak({ creatorId: user._id });
        const teamMemberStreak = getMockTeamMemberStreak({ teamStreak, user });
        const maintainedTeamMemberStreaks = [{ ...teamMemberStreak, currentStreak }];
        await trackMaintainedTeamMemberStreaks(maintainedTeamMemberStreaks as any);
        expect(teamMemberStreakModel.findByIdAndUpdate).toBeCalledWith(teamMemberStreak._id, {
            $set: {
                completedToday: false,
            },
        });
    });

    test('if team member streak current streak is longer than the teamMemberStreaks longestTeamMemberStreak streak it updates the users longest team member streak.', async () => {
        expect.assertions(2);
        const user = getMockUser({ _id: 'userId' });
        teamMemberStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue({ data: {} }) as any;

        userModel.findById = jest.fn().mockResolvedValue(user) as any;
        userModel.findByIdAndUpdate = jest.fn().mockResolvedValue(user) as any;

        const currentStreak = {
            startDate: '24/02/95',
            numberOfDaysInARow: 100,
        };
        const teamStreak = getMockTeamStreak({ creatorId: user._id });
        const teamMemberStreak = getMockTeamMemberStreak({ teamStreak, user });
        const maintainedTeamMemberStreaks = [{ ...teamMemberStreak, currentStreak }];
        await trackMaintainedTeamMemberStreaks(maintainedTeamMemberStreaks as any);
        expect(teamMemberStreakModel.findByIdAndUpdate).toBeCalledWith(teamMemberStreak._id, {
            $set: {
                completedToday: false,
            },
        });
        expect(teamMemberStreakModel.findByIdAndUpdate).toBeCalledWith(teamMemberStreak._id, {
            $set: {
                longestTeamMemberStreak: {
                    teamMemberStreakId: teamMemberStreak._id,
                    teamStreakName: teamStreak.streakName,
                    teamStreakId: teamStreak._id,
                    numberOfDays: currentStreak.numberOfDaysInARow,
                    startDate: currentStreak.startDate,
                    streakType: StreakTypes.teamMember,
                },
            },
        });
    });

    test('if team member streak current streak is longer than the users longest ever streak it updates the users longest ever streak.', async () => {
        expect.assertions(1);
        const user = getMockUser({ _id: 'userId' });
        teamMemberStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue({ data: {} }) as any;

        userModel.findById = jest.fn().mockResolvedValue(user) as any;
        userModel.findByIdAndUpdate = jest.fn().mockResolvedValue(user) as any;

        const currentStreak = {
            startDate: '24/02/95',
            numberOfDaysInARow: 100,
        };
        const teamStreak = getMockTeamStreak({ creatorId: user._id });
        const teamMemberStreak = getMockTeamMemberStreak({ teamStreak, user });
        const maintainedTeamMemberStreaks = [{ ...teamMemberStreak, currentStreak }];
        await trackMaintainedTeamMemberStreaks(maintainedTeamMemberStreaks as any);
        expect(userModel.findByIdAndUpdate).toBeCalledWith(user._id, {
            $set: {
                longestEverStreak: {
                    teamMemberStreakId: teamMemberStreak._id,
                    teamStreakName: teamStreak.streakName,
                    teamStreakId: teamStreak._id,
                    numberOfDays: currentStreak.numberOfDaysInARow,
                    startDate: currentStreak.startDate,
                    streakType: StreakTypes.teamMember,
                },
            },
        });
    });

    test('if team member streak current streak is longer than the users longest current streak it updates the users longest current streak.', async () => {
        expect.assertions(1);
        const user = getMockUser({ _id: 'userId' });
        teamMemberStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue({ data: {} }) as any;

        userModel.findById = jest.fn().mockResolvedValue(user) as any;
        userModel.findByIdAndUpdate = jest.fn().mockResolvedValue(user) as any;

        const currentStreak = {
            startDate: '24/02/95',
            numberOfDaysInARow: 100,
        };
        const teamStreak = getMockTeamStreak({ creatorId: user._id });
        const teamMemberStreak = getMockTeamMemberStreak({ teamStreak, user });
        const maintainedTeamMemberStreaks = [{ ...teamMemberStreak, currentStreak }];
        await trackMaintainedTeamMemberStreaks(maintainedTeamMemberStreaks as any);
        expect(userModel.findByIdAndUpdate).toBeCalledWith(user._id, {
            $set: {
                longestCurrentStreak: {
                    teamMemberStreakId: teamMemberStreak._id,
                    teamStreakName: teamStreak.streakName,
                    teamStreakId: teamStreak._id,
                    numberOfDays: currentStreak.numberOfDaysInARow,
                    startDate: currentStreak.startDate,
                    streakType: StreakTypes.teamMember,
                },
            },
        });
    });

    test('if team member streak current streak is longer than the users longest team member streak update the users longestTeamMemberStreak', async () => {
        expect.assertions(1);
        const user = getMockUser({ _id: 'userId' });
        teamMemberStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue({ data: {} }) as any;

        userModel.findById = jest.fn().mockResolvedValue({
            ...user,
            longestEverStreak: {
                currentStreak: {
                    numberOfDays: 100,
                },
            },
            longestCurrentStreak: {
                currentStreak: {
                    numberOfDays: 100,
                },
            },
        }) as any;
        userModel.findByIdAndUpdate = jest.fn().mockResolvedValue(user) as any;

        const currentStreak = {
            startDate: '24/02/95',
            numberOfDaysInARow: 100,
        };
        const teamStreak = getMockTeamStreak({ creatorId: user._id });
        const teamMemberStreak = getMockTeamMemberStreak({ teamStreak, user });
        const maintainedTeamMemberStreaks = [{ ...teamMemberStreak, currentStreak }];
        await trackMaintainedTeamMemberStreaks(maintainedTeamMemberStreaks as any);
        expect(userModel.findByIdAndUpdate).toBeCalledWith(user._id, {
            $set: {
                longestTeamMemberStreak: {
                    teamMemberStreakId: teamMemberStreak._id,
                    teamStreakName: teamStreak.streakName,
                    teamStreakId: teamStreak._id,
                    numberOfDays: currentStreak.numberOfDaysInARow,
                    startDate: currentStreak.startDate,
                    streakType: StreakTypes.teamMember,
                },
            },
        });
    });

    test('creates a streak maintained tracking event.', async () => {
        expect.assertions(1);
        const user = getMockUser({ _id: 'userId' });
        teamMemberStreakModel.findByIdAndUpdate = jest.fn().mockResolvedValue({ data: {} }) as any;

        userModel.findById = jest.fn().mockResolvedValue(user) as any;
        userModel.findByIdAndUpdate = jest.fn().mockResolvedValue(user) as any;

        const currentStreak = {
            startDate: '24/02/95',
            numberOfDaysInARow: 1,
        };
        const teamStreak = getMockTeamStreak({ creatorId: user._id });
        const teamMemberStreak = getMockTeamMemberStreak({ teamStreak, user });
        const maintainedTeamMemberStreaks = [{ ...teamMemberStreak, currentStreak }];
        await trackMaintainedTeamMemberStreaks(maintainedTeamMemberStreaks as any);

        expect(createStreakTrackingEvent).toBeCalledWith({
            type: StreakTrackingEventTypes.maintainedStreak,
            streakId: teamMemberStreak._id,
            userId: user._id,
            streakType: StreakTypes.teamMember,
        });
    });
});
