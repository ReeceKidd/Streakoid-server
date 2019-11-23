import streakoid from '../../streakoid';
import {
    ChallengeStreak,
    CurrentStreak,
    PastStreak,
    StreakTrackingEvent,
    StreakTrackingEventTypes,
    StreakTypes,
} from '@streakoid/streakoid-sdk/lib';
import { challengeStreakModel } from '../../../src/Models/ChallengeStreak';

export const resetIncompleteChallengeStreaks = async (
    incompleteChallengeStreaks: ChallengeStreak[],
    endDate: string,
): Promise<StreakTrackingEvent[]> => {
    return Promise.all(
        incompleteChallengeStreaks.map(async challengeStreak => {
            const pastStreak: PastStreak = {
                endDate: endDate,
                startDate: challengeStreak.currentStreak.startDate || endDate,
                numberOfDaysInARow: challengeStreak.currentStreak.numberOfDaysInARow,
            };

            const pastStreaks: PastStreak[] = [...challengeStreak.pastStreaks, pastStreak];

            const currentStreak: CurrentStreak = {
                startDate: '',
                numberOfDaysInARow: 0,
            };

            await challengeStreakModel.findByIdAndUpdate(challengeStreak._id, {
                $set: {
                    currentStreak,
                    pastStreaks,
                    active: false,
                },
            });

            return streakoid.streakTrackingEvents.create({
                type: StreakTrackingEventTypes.lostStreak,
                streakId: challengeStreak._id,
                userId: challengeStreak.userId,
                streakType: StreakTypes.challenge,
            });
        }),
    );
};