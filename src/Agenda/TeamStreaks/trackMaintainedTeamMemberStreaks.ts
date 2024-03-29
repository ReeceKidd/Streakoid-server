import { teamMemberStreakModel } from '../../../src/Models/TeamMemberStreak';
import { TeamMemberStreak } from '@streakoid/streakoid-models/lib/Models/TeamMemberStreak';
import { StreakTrackingEvent } from '@streakoid/streakoid-models/lib/Models/StreakTrackingEvent';
import StreakTrackingEventTypes from '@streakoid/streakoid-models/lib/Types/StreakTrackingEventTypes';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
import { createStreakTrackingEvent } from '../../helpers/createStreakTrackingEvent';
import { userModel } from '../../Models/User';
import { LongestEverTeamMemberStreak } from '@streakoid/streakoid-models/lib/Models/LongestEverTeamMemberStreak';
import { LongestCurrentTeamMemberStreak } from '@streakoid/streakoid-models/lib/Models/LongestCurrentTeamMemberStreak';

export const trackMaintainedTeamMemberStreaks = async (
    maintainedTeamMemberStreaks: TeamMemberStreak[],
): Promise<StreakTrackingEvent[]> => {
    return Promise.all(
        maintainedTeamMemberStreaks.map(async teamMemberStreak => {
            await teamMemberStreakModel.findByIdAndUpdate(teamMemberStreak._id, { $set: { completedToday: false } });
            if (
                teamMemberStreak.longestTeamMemberStreak.numberOfDays <
                teamMemberStreak.currentStreak.numberOfDaysInARow
            ) {
                const longestTeamMemberStreak: LongestEverTeamMemberStreak = {
                    teamMemberStreakId: teamMemberStreak._id,
                    teamStreakId: teamMemberStreak.teamStreakId,
                    teamStreakName: teamMemberStreak.streakName,
                    numberOfDays: teamMemberStreak.currentStreak.numberOfDaysInARow,
                    startDate: teamMemberStreak.currentStreak.startDate,
                    streakType: StreakTypes.teamMember,
                };
                await teamMemberStreakModel.findByIdAndUpdate(teamMemberStreak._id, {
                    $set: { longestTeamMemberStreak },
                });
            }

            const user = await userModel.findById(teamMemberStreak.userId);
            if (user) {
                if (user.longestEverStreak.numberOfDays < teamMemberStreak.currentStreak.numberOfDaysInARow) {
                    const longestEverStreak: LongestEverTeamMemberStreak = {
                        teamMemberStreakId: teamMemberStreak._id,
                        teamStreakId: teamMemberStreak.teamStreakId,
                        teamStreakName: teamMemberStreak.streakName,
                        numberOfDays: teamMemberStreak.currentStreak.numberOfDaysInARow,
                        startDate: teamMemberStreak.currentStreak.startDate,
                        streakType: StreakTypes.teamMember,
                    };
                    await userModel.findByIdAndUpdate(user._id, {
                        $set: {
                            longestEverStreak,
                        },
                    });
                }

                if (user.longestCurrentStreak.numberOfDays < teamMemberStreak.currentStreak.numberOfDaysInARow) {
                    const longestCurrentStreak: LongestCurrentTeamMemberStreak = {
                        teamMemberStreakId: teamMemberStreak._id,
                        teamStreakId: teamMemberStreak.teamStreakId,
                        teamStreakName: teamMemberStreak.streakName,
                        numberOfDays: teamMemberStreak.currentStreak.numberOfDaysInARow,
                        startDate: teamMemberStreak.currentStreak.startDate,
                        streakType: StreakTypes.teamMember,
                    };
                    await userModel.findByIdAndUpdate(user._id, {
                        $set: {
                            longestCurrentStreak,
                        },
                    });
                }

                if (user.longestTeamMemberStreak.numberOfDays < teamMemberStreak.currentStreak.numberOfDaysInARow) {
                    const longestTeamMemberStreak: LongestEverTeamMemberStreak = {
                        teamMemberStreakId: teamMemberStreak._id,
                        teamStreakId: teamMemberStreak.teamStreakId,
                        teamStreakName: teamMemberStreak.streakName,
                        numberOfDays: teamMemberStreak.currentStreak.numberOfDaysInARow,
                        startDate: teamMemberStreak.currentStreak.startDate,
                        streakType: StreakTypes.teamMember,
                    };
                    await userModel.findByIdAndUpdate(user._id, {
                        $set: { longestTeamMemberStreak },
                    });
                }
            }
            return createStreakTrackingEvent({
                type: StreakTrackingEventTypes.maintainedStreak,
                streakId: teamMemberStreak._id,
                userId: teamMemberStreak.userId,
                streakType: StreakTypes.teamMember,
            });
        }),
    );
};
