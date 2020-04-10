import { resetIncompleteChallengeStreaks } from '../../../src/Agenda/ChallengeStreaks/resetIncompleteChallengeStreaks';
import StreakStatus from '@streakoid/streakoid-sdk/lib/StreakStatus';
import { StreakTrackingEventTypes, StreakTypes, ActivityFeedItemTypes } from '@streakoid/streakoid-sdk/lib';
import { StreakoidFactory } from '@streakoid/streakoid-sdk/lib/streakoid';

import { isTestEnvironment } from '../../../tests/setup/isTestEnvironment';
import { setupDatabase } from '../../setup/setupDatabase';
import { getPayingUser } from '../../setup/getPayingUser';
import { streakoidTest } from '../../../tests/setup/streakoidTest';
import { tearDownDatabase } from '../../setup/tearDownDatabase';

jest.setTimeout(120000);

describe('resetIncompleteChallengeStreaks', () => {
    let streakoid: StreakoidFactory;
    let userId: string;
    let challengeStreakId: string;
    const name = 'Duolingo';
    const description = 'Everyday I must complete a duolingo lesson';
    const icon = 'duolingo';
    const color = 'blue';
    const levels = [{ level: 0, criteria: 'criteria' }];

    beforeAll(async () => {
        if (isTestEnvironment()) {
            await setupDatabase();
            const user = await getPayingUser();
            userId = user._id;
            streakoid = await streakoidTest();
            const { challenge } = await streakoid.challenges.create({
                name,
                description,
                icon,
                color,
                levels,
            });
            const challengeStreak = await streakoid.challengeStreaks.create({
                userId,
                challengeId: challenge._id,
            });
            challengeStreakId = challengeStreak._id;
        }
    });

    afterAll(async () => {
        if (isTestEnvironment()) {
            await tearDownDatabase();
        }
    });

    test('adds current streak to past streak,  resets the current streak and creats a lost streak tracking event.', async () => {
        expect.assertions(28);

        const incompleteChallengeStreaks = await streakoid.challengeStreaks.getAll({
            completedToday: false,
        });

        const endDate = new Date();
        await resetIncompleteChallengeStreaks(incompleteChallengeStreaks, endDate.toString());

        const updatedChallengeStreak = await streakoid.challengeStreaks.getOne({ challengeStreakId });

        expect(updatedChallengeStreak.status).toEqual(StreakStatus.live);
        expect(updatedChallengeStreak.userId).toEqual(expect.any(String));
        expect(updatedChallengeStreak.completedToday).toEqual(false);
        expect(updatedChallengeStreak.active).toEqual(false);
        expect(updatedChallengeStreak.pastStreaks.length).toEqual(1);
        const pastStreak = updatedChallengeStreak.pastStreaks[0];
        expect(pastStreak.endDate).toEqual(expect.any(String));
        expect(pastStreak.numberOfDaysInARow).toEqual(0);
        expect(pastStreak.startDate).toEqual(expect.any(String));
        expect(Object.keys(pastStreak).sort()).toEqual(['endDate', 'numberOfDaysInARow', 'startDate'].sort());
        expect(updatedChallengeStreak.timezone).toEqual(expect.any(String));
        const currentStreak = updatedChallengeStreak.currentStreak;
        expect(currentStreak.numberOfDaysInARow).toEqual(0);
        expect(currentStreak.startDate).toEqual(null);
        expect(Object.keys(currentStreak)).toEqual(['startDate', 'numberOfDaysInARow']);
        expect(updatedChallengeStreak._id).toEqual(expect.any(String));
        expect(updatedChallengeStreak.createdAt).toEqual(expect.any(String));
        expect(updatedChallengeStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(updatedChallengeStreak).sort()).toEqual(
            [
                '_id',
                'status',
                'currentStreak',
                'completedToday',
                'active',
                'pastStreaks',
                'userId',
                'challengeId',
                'badgeId',
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

        expect(streakTrackingEvent.type).toEqual(StreakTrackingEventTypes.lostStreak);
        expect(streakTrackingEvent.userId).toBeDefined();
        expect(streakTrackingEvent.streakId).toBeDefined();
        expect(streakTrackingEvent.streakType).toEqual(StreakTypes.challenge);
        expect(streakTrackingEvent._id).toEqual(expect.any(String));
        expect(streakTrackingEvent.createdAt).toEqual(expect.any(String));
        expect(streakTrackingEvent.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(streakTrackingEvent).sort()).toEqual(
            ['_id', 'type', 'streakId', 'streakType', 'userId', 'createdAt', 'updatedAt', '__v'].sort(),
        );

        const lostChallengeStreakItems = await streakoid.activityFeedItems.getAll({
            activityFeedItemType: ActivityFeedItemTypes.lostChallengeStreak,
        });
        const lostChallengeStreakItem = lostChallengeStreakItems.activityFeedItems[0];
        expect(lostChallengeStreakItem.activityFeedItemType).toEqual(ActivityFeedItemTypes.lostChallengeStreak);
        expect(lostChallengeStreakItem.userId).toEqual(String(userId));
        expect(Object.keys(lostChallengeStreakItem).sort()).toEqual(
            [
                '_id',
                'activityFeedItemType',
                'challengeStreakId',
                'challengeId',
                'challengeName',
                'userId',
                'username',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );
    });
});
