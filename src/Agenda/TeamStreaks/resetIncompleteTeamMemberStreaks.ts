import { teamMemberStreakModel } from '../../../src/Models/TeamMemberStreak';
import { teamStreakModel } from '../../../src/Models/TeamStreak';
import { TeamMemberStreak } from '@streakoid/streakoid-models/lib/Models/TeamMemberStreak';
import { StreakTrackingEvent } from '@streakoid/streakoid-models/lib/Models/StreakTrackingEvent';
import { PastStreak } from '@streakoid/streakoid-models/lib/Models/PastStreak';
import { CurrentStreak } from '@streakoid/streakoid-models/lib/Models/CurrentStreak';
import { ActivityFeedItemType } from '@streakoid/streakoid-models/lib/Models/ActivityFeedItemType';
import ActivityFeedItemTypes from '@streakoid/streakoid-models/lib/Types/ActivityFeedItemTypes';
import StreakTrackingEventTypes from '@streakoid/streakoid-models/lib/Types/StreakTrackingEventTypes';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
import { createActivityFeedItem } from '../../helpers/createActivityFeedItem';
import { createStreakTrackingEvent } from '../../helpers/createStreakTrackingEvent';
import { userModel } from '../../Models/User';
import { User } from '@streakoid/streakoid-models/lib/Models/User';
import { UserStreakHelper } from '../../helpers/UserStreakHelper';

export const resetIncompleteTeamMemberStreaks = async (
    incompleteTeamMemberStreaks: TeamMemberStreak[],
    endDate: string,
): Promise<StreakTrackingEvent[]> => {
    return Promise.all(
        incompleteTeamMemberStreaks.map(async teamMemberStreak => {
            const pastStreak: PastStreak = {
                endDate: endDate,
                startDate: teamMemberStreak.currentStreak.startDate || endDate,
                numberOfDaysInARow: teamMemberStreak.currentStreak.numberOfDaysInARow,
            };

            const pastStreaks: PastStreak[] = [...teamMemberStreak.pastStreaks, pastStreak];

            const currentStreak: CurrentStreak = {
                startDate: '',
                numberOfDaysInARow: 0,
            };

            await teamMemberStreakModel.findByIdAndUpdate(teamMemberStreak._id, {
                $set: {
                    currentStreak,
                    pastStreaks,
                    active: false,
                },
            });

            const teamStreak = await teamStreakModel.findByIdAndUpdate(teamMemberStreak.teamStreakId, {
                $set: {
                    completedToday: false,
                },
            });

            const user: User | null = await userModel.findById(teamMemberStreak.userId);

            const longestCurrentStreak = user && user.longestCurrentStreak;

            if (
                longestCurrentStreak &&
                longestCurrentStreak.streakType === StreakTypes.teamMember &&
                longestCurrentStreak.teamMemberStreakId &&
                longestCurrentStreak.teamMemberStreakId === teamMemberStreak._id &&
                user
            ) {
                await UserStreakHelper.updateUsersLongestCurrentStreak({ userId: user._id });
            }

            const longestEverStreak = user && user.longestEverStreak;

            if (
                longestEverStreak &&
                longestEverStreak.streakType === StreakTypes.teamMember &&
                longestEverStreak.teamMemberStreakId &&
                longestEverStreak.teamMemberStreakId === teamMemberStreak._id &&
                user
            ) {
                await userModel.findByIdAndUpdate(user._id, {
                    $set: { longestEverStreak: { ...longestEverStreak, endDate } },
                });
            }

            const longestTeamMemberStreak = user && user.longestTeamMemberStreak;

            if (
                longestTeamMemberStreak &&
                longestTeamMemberStreak.streakType === StreakTypes.teamMember &&
                longestTeamMemberStreak.teamMemberStreakId &&
                longestTeamMemberStreak.teamMemberStreakId === teamMemberStreak._id &&
                user
            ) {
                await userModel.findByIdAndUpdate(user._id, {
                    $set: { longestTeamMemberStreak: { ...longestTeamMemberStreak, endDate } },
                });
            }

            const lostTeamStreakActivityFeedItem: ActivityFeedItemType = {
                activityFeedItemType: ActivityFeedItemTypes.lostTeamStreak,
                userId: teamMemberStreak.userId,
                username: (user && user.username) || '',
                userProfileImage: (user && user.profileImages && user.profileImages.originalImageUrl) || '',
                teamStreakId: (teamStreak && teamStreak._id) || '',
                teamStreakName: (teamStreak && teamStreak.streakName) || '',
                numberOfDaysLost:
                    (teamStreak && teamStreak.currentStreak && teamStreak.currentStreak.numberOfDaysInARow) ||
                    pastStreak.numberOfDaysInARow,
            };

            await createActivityFeedItem(lostTeamStreakActivityFeedItem);

            return createStreakTrackingEvent({
                type: StreakTrackingEventTypes.lostStreak,
                streakId: teamMemberStreak._id,
                userId: teamMemberStreak.userId,
                streakType: StreakTypes.teamMember,
            });
        }),
    );
};
