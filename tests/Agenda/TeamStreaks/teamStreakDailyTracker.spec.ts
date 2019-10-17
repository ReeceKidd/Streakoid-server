/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';

import streakoid from '../../../src/streakoid';
import { createTeamStreakDailyTrackerJob } from '../../../src/scripts/initaliseTeamStreakTimezoneCheckers';
import { StreakTypes, StreakStatus, StreakTrackingEventTypes, AgendaJobNames } from '@streakoid/streakoid-sdk/lib';
import { londonTimezone } from '@streakoid/streakoid-sdk/lib/streakoid';

import { getServiceConfig } from '../../../src/getServiceConfig';
import { teamStreakModel } from '../../../src/Models/TeamStreak';
import { streakTrackingEventModel } from '../../../src/Models/StreakTrackingEvent';
import { teamMemberStreakModel } from '../../../src/Models/TeamMemberStreak';
import { completeTeamMemberStreakTaskModel } from '../../../src/Models/CompleteTeamMemberStreakTask';
import { dailyJobModel } from '../../../src/Models/DailyJob';

const { TEST_DATABASE_URI, NODE_ENV } = getServiceConfig();

const username = 'solo-streak-daily-tracker-name';
const email = 'solostreaktracker@gmail.com';

const friendUsername = 'friend';
const friendEmail = 'friend@gmail.com';

jest.setTimeout(120000);

describe('teamStreakDailyTracker', () => {
    let userId: string;
    let friendId: string;

    beforeAll(async () => {
        if (NODE_ENV === 'test' && TEST_DATABASE_URI.includes('TEST')) {
            mongoose.connect(TEST_DATABASE_URI, { useNewUrlParser: true, useFindAndModify: false });
            const user = await streakoid.users.create({ username, email });
            userId = user._id;
            const friend = await streakoid.users.create({ username: friendUsername, email: friendEmail });
            friendId = friend._id;
        }
    });

    afterAll(async () => {
        if (NODE_ENV === 'test' && TEST_DATABASE_URI.includes('TEST')) {
            mongoose.connection.dropDatabase();
            mongoose.disconnect();
        }
    });

    afterEach(async () => {
        if (NODE_ENV === 'test' && TEST_DATABASE_URI.includes('TEST')) {
            await teamStreakModel.deleteMany({});
            await streakTrackingEventModel.deleteMany({});
            await teamMemberStreakModel.deleteMany({});
            await completeTeamMemberStreakTaskModel.deleteMany({});
            await dailyJobModel.deleteMany({});
        }
    });

    test('initialises teamStreakDailyTracker job correctly', async () => {
        expect.assertions(10);
        const timezone = 'Europe/London';
        const job = await createTeamStreakDailyTrackerJob(timezone);
        const { attrs } = job as any;
        const { name, data, type, priority, nextRunAt, _id, repeatInterval, repeatTimezone } = attrs;
        expect(name).toEqual('teamStreakDailyTracker');
        expect(data.timezone).toEqual('Europe/London');
        expect(Object.keys(data)).toEqual(['timezone']);
        expect(type).toEqual('normal');
        expect(priority).toEqual(10);
        expect(nextRunAt).toBeDefined();
        expect(_id).toBeDefined();
        expect(repeatInterval).toBeDefined();
        expect(repeatTimezone).toEqual(null);
        expect(Object.keys(attrs)).toEqual([
            'name',
            'data',
            'type',
            'priority',
            'nextRunAt',
            'repeatInterval',
            'repeatTimezone',
            '_id',
        ]);
    });

    test('maintains team streaks correctly when a lone user has completed their task', async () => {
        expect.assertions(60);

        const timezone = 'Europe/London';

        const streakName = 'Painting';
        const streakDescription = 'Everyday we must paint for 30 minutes';

        const creatorId = userId;
        const members = [{ memberId: userId }];

        const teamStreak = await streakoid.teamStreaks.create({
            creatorId,
            streakName,
            streakDescription,
            members,
        });

        const teamMemberStreaks = await streakoid.teamMemberStreaks.getAll({
            userId: userId,
            teamStreakId: teamStreak._id,
        });
        const teamMemberStreak = teamMemberStreaks[0];

        await streakoid.completeTeamMemberStreakTasks.create({
            userId: userId,
            teamStreakId: teamStreak._id,
            teamMemberStreakId: teamMemberStreak._id,
        });

        const job = await createTeamStreakDailyTrackerJob(timezone);

        await job.run();

        const updatedTeamStreak = await streakoid.teamStreaks.getOne(teamStreak._id);

        expect(updatedTeamStreak.streakName).toEqual(streakName);
        expect(updatedTeamStreak.status).toEqual(StreakStatus.live);
        expect(updatedTeamStreak.streakDescription).toEqual(streakDescription);
        expect(updatedTeamStreak.completedToday).toEqual(false);
        expect(updatedTeamStreak.active).toEqual(true);
        expect(updatedTeamStreak.pastStreaks.length).toEqual(0);
        expect(updatedTeamStreak.timezone).toEqual(expect.any(String));

        const currentStreak = updatedTeamStreak.currentStreak;
        expect(currentStreak.numberOfDaysInARow).toEqual(1);
        expect(currentStreak.startDate).toEqual(expect.any(String));
        expect(Object.keys(currentStreak).sort()).toEqual(['numberOfDaysInARow', 'startDate'].sort());

        expect(updatedTeamStreak._id).toEqual(expect.any(String));
        expect(updatedTeamStreak.creatorId).toEqual(expect.any(String));
        expect(updatedTeamStreak.creator._id).toEqual(userId);
        expect(updatedTeamStreak.creator.username).toEqual(username);
        expect(Object.keys(updatedTeamStreak.creator).sort()).toEqual(['_id', 'username'].sort());
        expect(updatedTeamStreak.members.length).toEqual(1);

        const member = updatedTeamStreak.members[0];
        expect(member._id).toEqual(userId);
        expect(member.teamMemberStreak).toEqual(expect.any(Object));
        expect(member.username).toEqual(username);
        expect(Object.keys(member).sort()).toEqual(['_id', 'teamMemberStreak', 'username'].sort());
        expect(updatedTeamStreak.createdAt).toEqual(expect.any(String));
        expect(updatedTeamStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(updatedTeamStreak).sort()).toEqual(
            [
                '_id',
                'status',
                'currentStreak',
                'completedToday',
                'active',
                'pastStreaks',
                'streakName',
                'streakDescription',
                'timezone',
                'creator',
                'creatorId',
                'members',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );

        const teamStreakTrackingEvents = await streakoid.streakTrackingEvents.getAll({
            streakId: teamStreak._id,
        });
        const teamStreakTrackingEvent = teamStreakTrackingEvents[0];

        expect(teamStreakTrackingEvent.type).toEqual(StreakTrackingEventTypes.maintainedStreak);
        expect(teamStreakTrackingEvent.streakId).toEqual(teamStreak._id);
        expect(teamStreakTrackingEvent.streakType).toEqual(StreakTypes.team);
        expect(teamStreakTrackingEvent._id).toEqual(expect.any(String));
        expect(teamStreakTrackingEvent.createdAt).toEqual(expect.any(String));
        expect(teamStreakTrackingEvent.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(teamStreakTrackingEvent).sort()).toEqual(
            ['_id', 'type', 'streakId', 'streakType', 'createdAt', 'updatedAt', '__v'].sort(),
        );

        const updatedTeamMemberStreak = await streakoid.teamMemberStreaks.getOne(teamMemberStreak._id);

        expect(updatedTeamMemberStreak._id).toEqual(expect.any(String));
        expect(updatedTeamMemberStreak.currentStreak.startDate).toEqual(expect.any(String));
        expect(updatedTeamMemberStreak.currentStreak.numberOfDaysInARow).toEqual(1);
        expect(Object.keys(updatedTeamMemberStreak.currentStreak).sort()).toEqual(
            ['numberOfDaysInARow', 'startDate'].sort(),
        );
        expect(updatedTeamMemberStreak.completedToday).toEqual(false);
        expect(updatedTeamMemberStreak.active).toEqual(true);
        expect(updatedTeamMemberStreak.pastStreaks).toEqual([]);
        expect(updatedTeamMemberStreak.userId).toEqual(expect.any(String));
        expect(updatedTeamMemberStreak.teamStreakId).toEqual(teamStreak._id);
        expect(updatedTeamMemberStreak.timezone).toEqual(londonTimezone);
        expect(updatedTeamMemberStreak.createdAt).toEqual(expect.any(String));
        expect(updatedTeamMemberStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(updatedTeamMemberStreak).sort()).toEqual(
            [
                '_id',
                'currentStreak',
                'completedToday',
                'active',
                'pastStreaks',
                'userId',
                'teamStreakId',
                'timezone',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );

        const teamMemberStreakTrackingEvents = await streakoid.streakTrackingEvents.getAll({
            streakId: teamMemberStreak._id,
        });
        const teamMemberStreakTrackingEvent = teamMemberStreakTrackingEvents[0];

        expect(teamMemberStreakTrackingEvent.type).toEqual(StreakTrackingEventTypes.maintainedStreak);
        expect(teamMemberStreakTrackingEvent.streakId).toEqual(teamMemberStreak._id);
        expect(teamMemberStreakTrackingEvent.streakType).toEqual(StreakTypes.teamMember);
        expect(teamMemberStreakTrackingEvent.userId).toEqual(userId);
        expect(teamMemberStreakTrackingEvent._id).toEqual(expect.any(String));
        expect(teamMemberStreakTrackingEvent.createdAt).toEqual(expect.any(String));
        expect(teamMemberStreakTrackingEvent.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(teamMemberStreakTrackingEvent).sort()).toEqual(
            ['_id', 'type', 'streakId', 'streakType', 'userId', 'createdAt', 'updatedAt', '__v'].sort(),
        );

        const agendaJobId = String(job.attrs._id);
        const dailyJobs = await streakoid.dailyJobs.getAll({ agendaJobId });
        const dailyJob = dailyJobs[0];

        expect(dailyJob._id).toEqual(expect.any(String));
        expect(dailyJob.agendaJobId).toEqual(agendaJobId);
        expect(dailyJob.jobName).toEqual(AgendaJobNames.teamStreakDailyTracker);
        expect(dailyJob.timezone).toEqual('Europe/London');
        expect(dailyJob.localisedJobCompleteTime).toEqual(expect.any(String));
        expect(dailyJob.streakType).toEqual(StreakTypes.team);
        expect(dailyJob.createdAt).toEqual(expect.any(String));
        expect(dailyJob.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(dailyJob).sort()).toEqual(
            [
                '_id',
                'agendaJobId',
                'jobName',
                'timezone',
                'localisedJobCompleteTime',
                'streakType',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );
    });

    test('maintains team streaks correctly when all team members have completed their task', async () => {
        expect.assertions(81);

        const timezone = 'Europe/London';

        const streakName = 'Painting';
        const streakDescription = 'Everyday we must paint for 30 minutes';

        const creatorId = userId;
        const members = [{ memberId: userId }, { memberId: friendId }];

        const teamStreak = await streakoid.teamStreaks.create({
            creatorId,
            streakName,
            streakDescription,
            members,
        });

        const teamMemberStreaks = await streakoid.teamMemberStreaks.getAll({
            teamStreakId: teamStreak._id,
        });
        const userTeamMemberStreak = teamMemberStreaks[0];

        await streakoid.completeTeamMemberStreakTasks.create({
            userId: userId,
            teamStreakId: teamStreak._id,
            teamMemberStreakId: userTeamMemberStreak._id,
        });

        const friendTeamMemberStreak = teamMemberStreaks[1];

        await streakoid.completeTeamMemberStreakTasks.create({
            userId: userId,
            teamStreakId: teamStreak._id,
            teamMemberStreakId: friendTeamMemberStreak._id,
        });

        const job = await createTeamStreakDailyTrackerJob(timezone);

        await job.run();

        const updatedTeamStreak = await streakoid.teamStreaks.getOne(teamStreak._id);

        expect(updatedTeamStreak.streakName).toEqual(streakName);
        expect(updatedTeamStreak.status).toEqual(StreakStatus.live);
        expect(updatedTeamStreak.streakDescription).toEqual(streakDescription);
        expect(updatedTeamStreak.completedToday).toEqual(false);
        expect(updatedTeamStreak.active).toEqual(true);
        expect(updatedTeamStreak.pastStreaks.length).toEqual(0);
        expect(updatedTeamStreak.timezone).toEqual(expect.any(String));

        const currentStreak = updatedTeamStreak.currentStreak;
        expect(currentStreak.numberOfDaysInARow).toEqual(1);
        expect(currentStreak.startDate).toEqual(expect.any(String));
        expect(Object.keys(currentStreak).sort()).toEqual(['numberOfDaysInARow', 'startDate'].sort());

        expect(updatedTeamStreak._id).toEqual(expect.any(String));
        expect(updatedTeamStreak.creatorId).toEqual(expect.any(String));
        expect(updatedTeamStreak.creator._id).toEqual(userId);
        expect(updatedTeamStreak.creator.username).toEqual(username);
        expect(Object.keys(updatedTeamStreak.creator).sort()).toEqual(['_id', 'username'].sort());
        expect(updatedTeamStreak.members.length).toEqual(2);

        const member = updatedTeamStreak.members[0];
        expect(member._id).toEqual(userId);
        expect(member.teamMemberStreak).toEqual(expect.any(Object));
        expect(member.username).toEqual(username);
        expect(Object.keys(member).sort()).toEqual(['_id', 'teamMemberStreak', 'username'].sort());
        expect(updatedTeamStreak.createdAt).toEqual(expect.any(String));
        expect(updatedTeamStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(updatedTeamStreak).sort()).toEqual(
            [
                '_id',
                'status',
                'currentStreak',
                'completedToday',
                'active',
                'pastStreaks',
                'streakName',
                'streakDescription',
                'timezone',
                'creator',
                'creatorId',
                'members',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );

        const teamStreakTrackingEvents = await streakoid.streakTrackingEvents.getAll({
            streakId: teamStreak._id,
        });
        const teamStreakTrackingEvent = teamStreakTrackingEvents[0];

        expect(teamStreakTrackingEvent.type).toEqual(StreakTrackingEventTypes.maintainedStreak);
        expect(teamStreakTrackingEvent.streakId).toEqual(teamStreak._id);
        expect(teamStreakTrackingEvent.streakType).toEqual(StreakTypes.team);
        expect(teamStreakTrackingEvent._id).toEqual(expect.any(String));
        expect(teamStreakTrackingEvent.createdAt).toEqual(expect.any(String));
        expect(teamStreakTrackingEvent.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(teamStreakTrackingEvent).sort()).toEqual(
            ['_id', 'type', 'streakId', 'streakType', 'createdAt', 'updatedAt', '__v'].sort(),
        );

        const updatedUserTeamMemberStreak = await streakoid.teamMemberStreaks.getOne(userTeamMemberStreak._id);

        expect(updatedUserTeamMemberStreak._id).toEqual(expect.any(String));
        expect(updatedUserTeamMemberStreak.currentStreak.startDate).toEqual(expect.any(String));
        expect(updatedUserTeamMemberStreak.currentStreak.numberOfDaysInARow).toEqual(1);
        expect(Object.keys(updatedUserTeamMemberStreak.currentStreak).sort()).toEqual(
            ['numberOfDaysInARow', 'startDate'].sort(),
        );
        expect(updatedUserTeamMemberStreak.completedToday).toEqual(false);
        expect(updatedUserTeamMemberStreak.active).toEqual(true);
        expect(updatedUserTeamMemberStreak.pastStreaks).toEqual([]);
        expect(updatedUserTeamMemberStreak.userId).toEqual(expect.any(String));
        expect(updatedUserTeamMemberStreak.teamStreakId).toEqual(teamStreak._id);
        expect(updatedUserTeamMemberStreak.timezone).toEqual(londonTimezone);
        expect(updatedUserTeamMemberStreak.createdAt).toEqual(expect.any(String));
        expect(updatedUserTeamMemberStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(updatedUserTeamMemberStreak).sort()).toEqual(
            [
                '_id',
                'currentStreak',
                'completedToday',
                'active',
                'pastStreaks',
                'userId',
                'teamStreakId',
                'timezone',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );

        const teamMemberStreakTrackingEvents = await streakoid.streakTrackingEvents.getAll({
            streakId: updatedUserTeamMemberStreak._id,
        });
        const userTeamMemberStreakTrackingEvent = teamMemberStreakTrackingEvents[0];

        expect(userTeamMemberStreakTrackingEvent.type).toEqual(StreakTrackingEventTypes.maintainedStreak);
        expect(userTeamMemberStreakTrackingEvent.streakId).toEqual(updatedUserTeamMemberStreak._id);
        expect(userTeamMemberStreakTrackingEvent.streakType).toEqual(StreakTypes.teamMember);
        expect(userTeamMemberStreakTrackingEvent.userId).toEqual(expect.any(String));
        expect(userTeamMemberStreakTrackingEvent._id).toEqual(expect.any(String));
        expect(userTeamMemberStreakTrackingEvent.createdAt).toEqual(expect.any(String));
        expect(userTeamMemberStreakTrackingEvent.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(userTeamMemberStreakTrackingEvent).sort()).toEqual(
            ['_id', 'type', 'streakId', 'streakType', 'userId', 'createdAt', 'updatedAt', '__v'].sort(),
        );

        const updatedFriendTeamMemberStreak = await streakoid.teamMemberStreaks.getOne(userTeamMemberStreak._id);

        expect(updatedFriendTeamMemberStreak._id).toEqual(expect.any(String));
        expect(updatedFriendTeamMemberStreak.currentStreak.startDate).toEqual(expect.any(String));
        expect(updatedFriendTeamMemberStreak.currentStreak.numberOfDaysInARow).toEqual(1);
        expect(Object.keys(updatedFriendTeamMemberStreak.currentStreak).sort()).toEqual(
            ['numberOfDaysInARow', 'startDate'].sort(),
        );
        expect(updatedFriendTeamMemberStreak.completedToday).toEqual(false);
        expect(updatedFriendTeamMemberStreak.active).toEqual(true);
        expect(updatedFriendTeamMemberStreak.pastStreaks).toEqual([]);
        expect(updatedFriendTeamMemberStreak.userId).toEqual(expect.any(String));
        expect(updatedFriendTeamMemberStreak.teamStreakId).toEqual(teamStreak._id);
        expect(updatedFriendTeamMemberStreak.timezone).toEqual(londonTimezone);
        expect(updatedFriendTeamMemberStreak.createdAt).toEqual(expect.any(String));
        expect(updatedFriendTeamMemberStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(updatedFriendTeamMemberStreak).sort()).toEqual(
            [
                '_id',
                'currentStreak',
                'completedToday',
                'active',
                'pastStreaks',
                'userId',
                'teamStreakId',
                'timezone',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );

        const friendTeamMemberStreakTrackingEvents = await streakoid.streakTrackingEvents.getAll({
            streakId: updatedFriendTeamMemberStreak._id,
        });
        const friendTeamMemberStreakTrackingEvent = friendTeamMemberStreakTrackingEvents[0];

        expect(friendTeamMemberStreakTrackingEvent.type).toEqual(StreakTrackingEventTypes.maintainedStreak);
        expect(friendTeamMemberStreakTrackingEvent.streakId).toEqual(updatedFriendTeamMemberStreak._id);
        expect(friendTeamMemberStreakTrackingEvent.streakType).toEqual(StreakTypes.teamMember);
        expect(friendTeamMemberStreakTrackingEvent.userId).toEqual(expect.any(String));
        expect(friendTeamMemberStreakTrackingEvent._id).toEqual(expect.any(String));
        expect(friendTeamMemberStreakTrackingEvent.createdAt).toEqual(expect.any(String));
        expect(friendTeamMemberStreakTrackingEvent.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(friendTeamMemberStreakTrackingEvent).sort()).toEqual(
            ['_id', 'type', 'streakId', 'streakType', 'userId', 'createdAt', 'updatedAt', '__v'].sort(),
        );

        const agendaJobId = String(job.attrs._id);
        const dailyJobs = await streakoid.dailyJobs.getAll({ agendaJobId });
        const dailyJob = dailyJobs[0];

        expect(dailyJob._id).toEqual(expect.any(String));
        expect(dailyJob.agendaJobId).toEqual(agendaJobId);
        expect(dailyJob.jobName).toEqual(AgendaJobNames.teamStreakDailyTracker);
        expect(dailyJob.timezone).toEqual('Europe/London');
        expect(dailyJob.localisedJobCompleteTime).toEqual(expect.any(String));
        expect(dailyJob.streakType).toEqual(StreakTypes.team);
        expect(dailyJob.createdAt).toEqual(expect.any(String));
        expect(dailyJob.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(dailyJob).sort()).toEqual(
            [
                '_id',
                'agendaJobId',
                'jobName',
                'timezone',
                'localisedJobCompleteTime',
                'streakType',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );
    });

    test('resets lost team streaks correctly when a lone user does not complete their task for the day', async () => {
        expect.assertions(76);

        const timezone = 'Europe/London';

        const streakName = 'Painting';
        const streakDescription = 'Everyday we must paint for 30 minutes';

        const creatorId = userId;
        const members = [{ memberId: userId }];

        const teamStreak = await streakoid.teamStreaks.create({
            creatorId,
            streakName,
            streakDescription,
            members,
        });

        const teamMemberStreaks = await streakoid.teamMemberStreaks.getAll({
            userId: userId,
            teamStreakId: teamStreak._id,
        });
        const teamMemberStreak = teamMemberStreaks[0];

        await streakoid.completeTeamMemberStreakTasks.create({
            userId: userId,
            teamStreakId: teamStreak._id,
            teamMemberStreakId: teamMemberStreak._id,
        });

        const job = await createTeamStreakDailyTrackerJob(timezone);

        await job.run();
        // Simulates an additional day passing where team member does not complete task.
        await job.run();

        const updatedTeamStreak = await streakoid.teamStreaks.getOne(teamStreak._id);

        expect(updatedTeamStreak.streakName).toEqual(streakName);
        expect(updatedTeamStreak.status).toEqual(StreakStatus.live);
        expect(updatedTeamStreak.streakDescription).toEqual(streakDescription);
        expect(updatedTeamStreak.completedToday).toEqual(false);
        expect(updatedTeamStreak.active).toEqual(false);
        expect(updatedTeamStreak.pastStreaks.length).toEqual(1);
        const pastStreak = updatedTeamStreak.pastStreaks[0];
        expect(pastStreak.endDate).toEqual(expect.any(String));
        expect(pastStreak.numberOfDaysInARow).toEqual(1);
        expect(pastStreak.startDate).toEqual(expect.any(String));
        expect(Object.keys(pastStreak).sort()).toEqual(['endDate', 'numberOfDaysInARow', 'startDate'].sort());
        expect(updatedTeamStreak.timezone).toEqual(expect.any(String));
        const currentStreak = updatedTeamStreak.currentStreak;
        expect(currentStreak.numberOfDaysInARow).toEqual(0);
        expect(currentStreak.startDate).toEqual(null);
        expect(Object.keys(currentStreak).sort()).toEqual(['numberOfDaysInARow', 'startDate'].sort());

        expect(updatedTeamStreak._id).toEqual(expect.any(String));
        expect(updatedTeamStreak.creatorId).toEqual(expect.any(String));
        expect(updatedTeamStreak.creator._id).toEqual(userId);
        expect(updatedTeamStreak.creator.username).toEqual(username);
        expect(Object.keys(updatedTeamStreak.creator).sort()).toEqual(['_id', 'username'].sort());
        expect(updatedTeamStreak.members.length).toEqual(1);

        const member = updatedTeamStreak.members[0];
        expect(member._id).toEqual(userId);
        expect(member.teamMemberStreak).toEqual(expect.any(Object));
        expect(member.username).toEqual(username);
        expect(Object.keys(member).sort()).toEqual(['_id', 'teamMemberStreak', 'username'].sort());
        expect(updatedTeamStreak.createdAt).toEqual(expect.any(String));
        expect(updatedTeamStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(updatedTeamStreak).sort()).toEqual(
            [
                '_id',
                'status',
                'currentStreak',
                'completedToday',
                'active',
                'pastStreaks',
                'streakName',
                'streakDescription',
                'timezone',
                'creator',
                'creatorId',
                'members',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );

        const teamStreakTrackingEvents = await streakoid.streakTrackingEvents.getAll({
            streakId: teamStreak._id,
        });
        const teamStreakTrackingEvent = teamStreakTrackingEvents[1];

        expect(teamStreakTrackingEvent.type).toEqual(StreakTrackingEventTypes.lostStreak);
        expect(teamStreakTrackingEvent.streakId).toEqual(teamStreak._id);
        expect(teamStreakTrackingEvent.streakType).toEqual(StreakTypes.team);
        expect(teamStreakTrackingEvent._id).toEqual(expect.any(String));
        expect(teamStreakTrackingEvent.createdAt).toEqual(expect.any(String));
        expect(teamStreakTrackingEvent.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(teamStreakTrackingEvent).sort()).toEqual(
            ['_id', 'type', 'streakId', 'streakType', 'createdAt', 'updatedAt', '__v'].sort(),
        );

        const updatedTeamMemberStreak = await streakoid.teamMemberStreaks.getOne(teamMemberStreak._id);

        expect(updatedTeamMemberStreak._id).toEqual(expect.any(String));
        expect(updatedTeamMemberStreak.currentStreak.startDate).toEqual(null);
        expect(updatedTeamMemberStreak.currentStreak.numberOfDaysInARow).toEqual(0);
        expect(Object.keys(updatedTeamMemberStreak.currentStreak).sort()).toEqual(
            ['numberOfDaysInARow', 'startDate'].sort(),
        );
        expect(updatedTeamMemberStreak.completedToday).toEqual(false);
        expect(updatedTeamMemberStreak.active).toEqual(false);
        expect(updatedTeamMemberStreak.pastStreaks.length).toEqual(1);
        const teamMemberPastStreak = updatedTeamMemberStreak.pastStreaks[0];
        expect(teamMemberPastStreak.endDate).toEqual(expect.any(String));
        expect(teamMemberPastStreak.numberOfDaysInARow).toEqual(1);
        expect(teamMemberPastStreak.startDate).toEqual(expect.any(String));
        expect(Object.keys(teamMemberPastStreak).sort()).toEqual(['endDate', 'numberOfDaysInARow', 'startDate'].sort());
        expect(updatedTeamMemberStreak.teamStreakId).toEqual(teamStreak._id);
        expect(updatedTeamMemberStreak.timezone).toEqual(londonTimezone);
        expect(updatedTeamMemberStreak.createdAt).toEqual(expect.any(String));
        expect(updatedTeamMemberStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(updatedTeamMemberStreak).sort()).toEqual(
            [
                '_id',
                'currentStreak',
                'completedToday',
                'active',
                'pastStreaks',
                'userId',
                'teamStreakId',
                'timezone',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );

        const teamMemberStreakTrackingEvents = await streakoid.streakTrackingEvents.getAll({
            streakId: teamMemberStreak._id,
        });
        const teamMemberStreakTrackingEvent = teamMemberStreakTrackingEvents[1];

        expect(teamMemberStreakTrackingEvent.type).toEqual(StreakTrackingEventTypes.lostStreak);
        expect(teamMemberStreakTrackingEvent.streakId).toEqual(teamMemberStreak._id);
        expect(teamMemberStreakTrackingEvent.streakType).toEqual(StreakTypes.teamMember);
        expect(teamMemberStreakTrackingEvent.userId).toEqual(userId);
        expect(teamMemberStreakTrackingEvent._id).toEqual(expect.any(String));
        expect(teamMemberStreakTrackingEvent.createdAt).toEqual(expect.any(String));
        expect(teamMemberStreakTrackingEvent.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(teamMemberStreakTrackingEvent).sort()).toEqual(
            ['_id', 'type', 'streakId', 'streakType', 'userId', 'createdAt', 'updatedAt', '__v'].sort(),
        );

        const forcedToLoseTeamStreakEvents = await streakoid.streakTrackingEvents.getAll({
            type: StreakTrackingEventTypes.forcedToLoseStreakBecauseTeamMemberDidNotCompleteTask,
        });

        expect(forcedToLoseTeamStreakEvents.length).toEqual(1);

        const forcedToLoseStreakEvent = forcedToLoseTeamStreakEvents[0];

        expect(forcedToLoseStreakEvent.type).toEqual(
            StreakTrackingEventTypes.forcedToLoseStreakBecauseTeamMemberDidNotCompleteTask,
        );
        expect(forcedToLoseStreakEvent.streakId).toEqual(teamMemberStreak._id);
        expect(forcedToLoseStreakEvent.streakType).toEqual(StreakTypes.teamMember);
        expect(forcedToLoseStreakEvent.userId).toEqual(expect.any(String));
        expect(forcedToLoseStreakEvent._id).toEqual(expect.any(String));
        expect(forcedToLoseStreakEvent.createdAt).toEqual(expect.any(String));
        expect(forcedToLoseStreakEvent.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(forcedToLoseStreakEvent).sort()).toEqual(
            ['_id', 'type', 'streakId', 'streakType', 'userId', 'createdAt', 'updatedAt', '__v'].sort(),
        );

        const agendaJobId = String(job.attrs._id);
        const dailyJobs = await streakoid.dailyJobs.getAll({ agendaJobId });
        const dailyJob = dailyJobs[0];

        expect(dailyJob._id).toEqual(expect.any(String));
        expect(dailyJob.agendaJobId).toEqual(agendaJobId);
        expect(dailyJob.jobName).toEqual(AgendaJobNames.teamStreakDailyTracker);
        expect(dailyJob.timezone).toEqual('Europe/London');
        expect(dailyJob.localisedJobCompleteTime).toEqual(expect.any(String));
        expect(dailyJob.streakType).toEqual(StreakTypes.team);
        expect(dailyJob.createdAt).toEqual(expect.any(String));
        expect(dailyJob.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(dailyJob).sort()).toEqual(
            [
                '_id',
                'agendaJobId',
                'jobName',
                'timezone',
                'localisedJobCompleteTime',
                'streakType',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );
    });

    test('resets lost team streaks correctly when not everyone in the team has completed their task', async () => {
        expect.assertions(101);

        const timezone = 'Europe/London';

        const streakName = 'Painting';
        const streakDescription = 'Everyday we must paint for 30 minutes';

        const creatorId = userId;
        const members = [{ memberId: userId }, { memberId: friendId }];

        const teamStreak = await streakoid.teamStreaks.create({
            creatorId,
            streakName,
            streakDescription,
            members,
        });

        const teamMemberStreaks = await streakoid.teamMemberStreaks.getAll({
            teamStreakId: teamStreak._id,
        });
        const userTeamMemberStreak = teamMemberStreaks[0];

        await streakoid.completeTeamMemberStreakTasks.create({
            userId: userId,
            teamStreakId: teamStreak._id,
            teamMemberStreakId: userTeamMemberStreak._id,
        });

        const friendTeamMemberStreak = teamMemberStreaks[1];

        await streakoid.completeTeamMemberStreakTasks.create({
            userId: friendId,
            teamStreakId: teamStreak._id,
            teamMemberStreakId: friendTeamMemberStreak._id,
        });

        const job = await createTeamStreakDailyTrackerJob(timezone);

        await job.run();
        // Simulates a day passing with only one user completing streak

        await streakoid.completeTeamMemberStreakTasks.create({
            userId: userId,
            teamStreakId: teamStreak._id,
            teamMemberStreakId: userTeamMemberStreak._id,
        });
        await job.run();

        const updatedTeamStreak = await streakoid.teamStreaks.getOne(teamStreak._id);

        expect(updatedTeamStreak.streakName).toEqual(streakName);
        expect(updatedTeamStreak.status).toEqual(StreakStatus.live);
        expect(updatedTeamStreak.streakDescription).toEqual(streakDescription);
        expect(updatedTeamStreak.completedToday).toEqual(false);
        expect(updatedTeamStreak.active).toEqual(false);
        expect(updatedTeamStreak.pastStreaks.length).toEqual(1);
        const pastStreak = updatedTeamStreak.pastStreaks[0];
        expect(pastStreak.endDate).toEqual(expect.any(String));
        expect(pastStreak.numberOfDaysInARow).toEqual(1);
        expect(pastStreak.startDate).toEqual(expect.any(String));
        expect(Object.keys(pastStreak).sort()).toEqual(['endDate', 'numberOfDaysInARow', 'startDate'].sort());
        expect(updatedTeamStreak.timezone).toEqual(expect.any(String));

        const currentStreak = updatedTeamStreak.currentStreak;
        expect(currentStreak.numberOfDaysInARow).toEqual(0);
        expect(currentStreak.startDate).toEqual(null);
        expect(Object.keys(currentStreak).sort()).toEqual(['numberOfDaysInARow', 'startDate'].sort());

        expect(updatedTeamStreak._id).toEqual(expect.any(String));
        expect(updatedTeamStreak.creatorId).toEqual(expect.any(String));
        expect(updatedTeamStreak.creator._id).toEqual(userId);
        expect(updatedTeamStreak.creator.username).toEqual(username);
        expect(Object.keys(updatedTeamStreak.creator).sort()).toEqual(['_id', 'username'].sort());
        expect(updatedTeamStreak.members.length).toEqual(2);

        const member = updatedTeamStreak.members[0];
        expect(member._id).toEqual(userId);
        expect(member.teamMemberStreak).toEqual(expect.any(Object));
        expect(member.username).toEqual(username);
        expect(Object.keys(member).sort()).toEqual(['_id', 'teamMemberStreak', 'username'].sort());
        expect(updatedTeamStreak.createdAt).toEqual(expect.any(String));
        expect(updatedTeamStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(updatedTeamStreak).sort()).toEqual(
            [
                '_id',
                'status',
                'currentStreak',
                'completedToday',
                'active',
                'pastStreaks',
                'streakName',
                'streakDescription',
                'timezone',
                'creator',
                'creatorId',
                'members',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );

        const teamStreakTrackingEvents = await streakoid.streakTrackingEvents.getAll({
            streakId: teamStreak._id,
        });
        const teamStreakTrackingEvent = teamStreakTrackingEvents[1];

        expect(teamStreakTrackingEvent.type).toEqual(StreakTrackingEventTypes.lostStreak);
        expect(teamStreakTrackingEvent.streakId).toEqual(teamStreak._id);
        expect(teamStreakTrackingEvent.streakType).toEqual(StreakTypes.team);
        expect(teamStreakTrackingEvent._id).toEqual(expect.any(String));
        expect(teamStreakTrackingEvent.createdAt).toEqual(expect.any(String));
        expect(teamStreakTrackingEvent.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(teamStreakTrackingEvent).sort()).toEqual(
            ['_id', 'type', 'streakId', 'streakType', 'createdAt', 'updatedAt', '__v'].sort(),
        );

        const updatedUserTeamMemberStreak = await streakoid.teamMemberStreaks.getOne(userTeamMemberStreak._id);

        expect(updatedUserTeamMemberStreak._id).toEqual(expect.any(String));
        expect(updatedUserTeamMemberStreak.currentStreak.startDate).toEqual(null);
        expect(updatedUserTeamMemberStreak.currentStreak.numberOfDaysInARow).toEqual(0);
        expect(Object.keys(updatedUserTeamMemberStreak.currentStreak).sort()).toEqual(
            ['numberOfDaysInARow', 'startDate'].sort(),
        );
        expect(updatedUserTeamMemberStreak.completedToday).toEqual(false);
        expect(updatedUserTeamMemberStreak.active).toEqual(false);
        const userPastStreak = updatedTeamStreak.pastStreaks[0];
        expect(userPastStreak.endDate).toEqual(expect.any(String));
        expect(userPastStreak.numberOfDaysInARow).toEqual(1);
        expect(userPastStreak.startDate).toEqual(expect.any(String));
        expect(Object.keys(userPastStreak).sort()).toEqual(['endDate', 'numberOfDaysInARow', 'startDate'].sort());
        expect(updatedUserTeamMemberStreak.userId).toEqual(expect.any(String));
        expect(updatedUserTeamMemberStreak.teamStreakId).toEqual(teamStreak._id);
        expect(updatedUserTeamMemberStreak.timezone).toEqual(londonTimezone);
        expect(updatedUserTeamMemberStreak.createdAt).toEqual(expect.any(String));
        expect(updatedUserTeamMemberStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(updatedUserTeamMemberStreak).sort()).toEqual(
            [
                '_id',
                'currentStreak',
                'completedToday',
                'active',
                'pastStreaks',
                'userId',
                'teamStreakId',
                'timezone',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );

        const teamMemberStreakTrackingEvents = await streakoid.streakTrackingEvents.getAll({
            streakId: updatedUserTeamMemberStreak._id,
        });
        const userTeamMemberStreakTrackingEvent = teamMemberStreakTrackingEvents[1];

        expect(userTeamMemberStreakTrackingEvent.type).toEqual(StreakTrackingEventTypes.maintainedStreak);
        expect(userTeamMemberStreakTrackingEvent.streakId).toEqual(updatedUserTeamMemberStreak._id);
        expect(userTeamMemberStreakTrackingEvent.streakType).toEqual(StreakTypes.teamMember);
        expect(userTeamMemberStreakTrackingEvent.userId).toEqual(expect.any(String));
        expect(userTeamMemberStreakTrackingEvent._id).toEqual(expect.any(String));
        expect(userTeamMemberStreakTrackingEvent.createdAt).toEqual(expect.any(String));
        expect(userTeamMemberStreakTrackingEvent.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(userTeamMemberStreakTrackingEvent).sort()).toEqual(
            ['_id', 'type', 'streakId', 'streakType', 'userId', 'createdAt', 'updatedAt', '__v'].sort(),
        );

        const updatedFriendTeamMemberStreak = await streakoid.teamMemberStreaks.getOne(friendTeamMemberStreak._id);

        expect(updatedFriendTeamMemberStreak._id).toEqual(expect.any(String));
        expect(updatedFriendTeamMemberStreak.currentStreak.startDate).toEqual(null);
        expect(updatedFriendTeamMemberStreak.currentStreak.numberOfDaysInARow).toEqual(0);
        expect(Object.keys(updatedFriendTeamMemberStreak.currentStreak).sort()).toEqual(
            ['numberOfDaysInARow', 'startDate'].sort(),
        );
        expect(updatedFriendTeamMemberStreak.completedToday).toEqual(false);
        expect(updatedFriendTeamMemberStreak.active).toEqual(false);
        expect(updatedFriendTeamMemberStreak.pastStreaks.length).toEqual(1);
        const friendPastStreak = updatedTeamStreak.pastStreaks[0];
        expect(friendPastStreak.endDate).toEqual(expect.any(String));
        expect(friendPastStreak.numberOfDaysInARow).toEqual(1);
        expect(friendPastStreak.startDate).toEqual(expect.any(String));
        expect(Object.keys(friendPastStreak).sort()).toEqual(['endDate', 'numberOfDaysInARow', 'startDate'].sort());
        expect(updatedFriendTeamMemberStreak.userId).toEqual(expect.any(String));
        expect(updatedFriendTeamMemberStreak.teamStreakId).toEqual(teamStreak._id);
        expect(updatedFriendTeamMemberStreak.timezone).toEqual(londonTimezone);
        expect(updatedFriendTeamMemberStreak.createdAt).toEqual(expect.any(String));
        expect(updatedFriendTeamMemberStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(updatedFriendTeamMemberStreak).sort()).toEqual(
            [
                '_id',
                'currentStreak',
                'completedToday',
                'active',
                'pastStreaks',
                'userId',
                'teamStreakId',
                'timezone',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );

        const friendTeamMemberStreakTrackingEvents = await streakoid.streakTrackingEvents.getAll({
            streakId: updatedFriendTeamMemberStreak._id,
        });
        const friendTeamMemberStreakTrackingEvent = friendTeamMemberStreakTrackingEvents[1];

        expect(friendTeamMemberStreakTrackingEvent.type).toEqual(StreakTrackingEventTypes.lostStreak);
        expect(friendTeamMemberStreakTrackingEvent.streakId).toEqual(updatedFriendTeamMemberStreak._id);
        expect(friendTeamMemberStreakTrackingEvent.streakType).toEqual(StreakTypes.teamMember);
        expect(friendTeamMemberStreakTrackingEvent.userId).toEqual(expect.any(String));
        expect(friendTeamMemberStreakTrackingEvent._id).toEqual(expect.any(String));
        expect(friendTeamMemberStreakTrackingEvent.createdAt).toEqual(expect.any(String));
        expect(friendTeamMemberStreakTrackingEvent.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(friendTeamMemberStreakTrackingEvent).sort()).toEqual(
            ['_id', 'type', 'streakId', 'streakType', 'userId', 'createdAt', 'updatedAt', '__v'].sort(),
        );

        const forcedToLoseTeamStreakEvents = await streakoid.streakTrackingEvents.getAll({
            type: StreakTrackingEventTypes.forcedToLoseStreakBecauseTeamMemberDidNotCompleteTask,
        });

        expect(forcedToLoseTeamStreakEvents.length).toEqual(2);

        const forcedToLoseStreakEvent = forcedToLoseTeamStreakEvents[0];

        expect(forcedToLoseStreakEvent.type).toEqual(
            StreakTrackingEventTypes.forcedToLoseStreakBecauseTeamMemberDidNotCompleteTask,
        );
        expect(forcedToLoseStreakEvent.streakId).toEqual(expect.any(String));
        expect(forcedToLoseStreakEvent.streakType).toEqual(StreakTypes.teamMember);
        expect(forcedToLoseStreakEvent.userId).toEqual(expect.any(String));
        expect(forcedToLoseStreakEvent._id).toEqual(expect.any(String));
        expect(forcedToLoseStreakEvent.createdAt).toEqual(expect.any(String));
        expect(forcedToLoseStreakEvent.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(forcedToLoseStreakEvent).sort()).toEqual(
            ['_id', 'type', 'streakId', 'streakType', 'userId', 'createdAt', 'updatedAt', '__v'].sort(),
        );

        const agendaJobId = String(job.attrs._id);
        const dailyJobs = await streakoid.dailyJobs.getAll({ agendaJobId });
        const dailyJob = dailyJobs[0];

        expect(dailyJob._id).toEqual(expect.any(String));
        expect(dailyJob.agendaJobId).toEqual(agendaJobId);
        expect(dailyJob.jobName).toEqual(AgendaJobNames.teamStreakDailyTracker);
        expect(dailyJob.timezone).toEqual('Europe/London');
        expect(dailyJob.localisedJobCompleteTime).toEqual(expect.any(String));
        expect(dailyJob.streakType).toEqual(StreakTypes.team);
        expect(dailyJob.createdAt).toEqual(expect.any(String));
        expect(dailyJob.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(dailyJob).sort()).toEqual(
            [
                '_id',
                'agendaJobId',
                'jobName',
                'timezone',
                'localisedJobCompleteTime',
                'streakType',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );
    });

    test('manages inactive team streaks correctly when all members have been inactive', async () => {
        expect.assertions(81);

        const timezone = 'Europe/London';

        const streakName = 'Painting';
        const streakDescription = 'Everyday we must paint for 30 minutes';

        const creatorId = userId;
        const members = [{ memberId: userId }, { memberId: friendId }];

        const teamStreak = await streakoid.teamStreaks.create({
            creatorId,
            streakName,
            streakDescription,
            members,
        });

        const teamMemberStreaks = await streakoid.teamMemberStreaks.getAll({
            teamStreakId: teamStreak._id,
        });
        const userTeamMemberStreak = teamMemberStreaks[0];

        const friendTeamMemberStreak = teamMemberStreaks[1];

        const job = await createTeamStreakDailyTrackerJob(timezone);

        await job.run();

        const updatedTeamStreak = await streakoid.teamStreaks.getOne(teamStreak._id);

        expect(updatedTeamStreak.streakName).toEqual(streakName);
        expect(updatedTeamStreak.status).toEqual(StreakStatus.live);
        expect(updatedTeamStreak.streakDescription).toEqual(streakDescription);
        expect(updatedTeamStreak.completedToday).toEqual(false);
        expect(updatedTeamStreak.active).toEqual(false);
        expect(updatedTeamStreak.pastStreaks.length).toEqual(0);
        expect(updatedTeamStreak.timezone).toEqual(expect.any(String));

        const currentStreak = updatedTeamStreak.currentStreak;
        expect(currentStreak.numberOfDaysInARow).toEqual(0);
        expect(currentStreak.startDate).toBeUndefined();
        expect(Object.keys(currentStreak).sort()).toEqual(['numberOfDaysInARow'].sort());

        expect(updatedTeamStreak._id).toEqual(expect.any(String));
        expect(updatedTeamStreak.creatorId).toEqual(expect.any(String));
        expect(updatedTeamStreak.creator._id).toEqual(userId);
        expect(updatedTeamStreak.creator.username).toEqual(username);
        expect(Object.keys(updatedTeamStreak.creator).sort()).toEqual(['_id', 'username'].sort());
        expect(updatedTeamStreak.members.length).toEqual(2);

        const member = updatedTeamStreak.members[0];
        expect(member._id).toEqual(userId);
        expect(member.teamMemberStreak).toEqual(expect.any(Object));
        expect(member.username).toEqual(username);
        expect(Object.keys(member).sort()).toEqual(['_id', 'teamMemberStreak', 'username'].sort());
        expect(updatedTeamStreak.createdAt).toEqual(expect.any(String));
        expect(updatedTeamStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(updatedTeamStreak).sort()).toEqual(
            [
                '_id',
                'status',
                'currentStreak',
                'completedToday',
                'active',
                'pastStreaks',
                'streakName',
                'streakDescription',
                'timezone',
                'creator',
                'creatorId',
                'members',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );

        const teamStreakTrackingEvents = await streakoid.streakTrackingEvents.getAll({
            streakId: teamStreak._id,
        });
        const teamStreakTrackingEvent = teamStreakTrackingEvents[0];

        expect(teamStreakTrackingEvent.type).toEqual(StreakTrackingEventTypes.inactiveStreak);
        expect(teamStreakTrackingEvent.streakId).toEqual(teamStreak._id);
        expect(teamStreakTrackingEvent.streakType).toEqual(StreakTypes.team);
        expect(teamStreakTrackingEvent._id).toEqual(expect.any(String));
        expect(teamStreakTrackingEvent.createdAt).toEqual(expect.any(String));
        expect(teamStreakTrackingEvent.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(teamStreakTrackingEvent).sort()).toEqual(
            ['_id', 'type', 'streakId', 'streakType', 'createdAt', 'updatedAt', '__v'].sort(),
        );

        const updatedUserTeamMemberStreak = await streakoid.teamMemberStreaks.getOne(userTeamMemberStreak._id);

        expect(updatedUserTeamMemberStreak._id).toEqual(expect.any(String));
        expect(updatedUserTeamMemberStreak.currentStreak.startDate).toBeUndefined();
        expect(updatedUserTeamMemberStreak.currentStreak.numberOfDaysInARow).toEqual(0);
        expect(Object.keys(updatedUserTeamMemberStreak.currentStreak).sort()).toEqual(['numberOfDaysInARow'].sort());
        expect(updatedUserTeamMemberStreak.completedToday).toEqual(false);
        expect(updatedUserTeamMemberStreak.active).toEqual(false);
        expect(updatedUserTeamMemberStreak.pastStreaks).toEqual([]);
        expect(updatedUserTeamMemberStreak.userId).toEqual(expect.any(String));
        expect(updatedUserTeamMemberStreak.teamStreakId).toEqual(teamStreak._id);
        expect(updatedUserTeamMemberStreak.timezone).toEqual(londonTimezone);
        expect(updatedUserTeamMemberStreak.createdAt).toEqual(expect.any(String));
        expect(updatedUserTeamMemberStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(updatedUserTeamMemberStreak).sort()).toEqual(
            [
                '_id',
                'currentStreak',
                'completedToday',
                'active',
                'pastStreaks',
                'userId',
                'teamStreakId',
                'timezone',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );

        const teamMemberStreakTrackingEvents = await streakoid.streakTrackingEvents.getAll({
            streakId: updatedUserTeamMemberStreak._id,
        });
        const userTeamMemberStreakTrackingEvent = teamMemberStreakTrackingEvents[0];

        expect(userTeamMemberStreakTrackingEvent.type).toEqual(StreakTrackingEventTypes.inactiveStreak);
        expect(userTeamMemberStreakTrackingEvent.streakId).toEqual(updatedUserTeamMemberStreak._id);
        expect(userTeamMemberStreakTrackingEvent.streakType).toEqual(StreakTypes.teamMember);
        expect(userTeamMemberStreakTrackingEvent.userId).toEqual(expect.any(String));
        expect(userTeamMemberStreakTrackingEvent._id).toEqual(expect.any(String));
        expect(userTeamMemberStreakTrackingEvent.createdAt).toEqual(expect.any(String));
        expect(userTeamMemberStreakTrackingEvent.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(userTeamMemberStreakTrackingEvent).sort()).toEqual(
            ['_id', 'type', 'streakId', 'streakType', 'userId', 'createdAt', 'updatedAt', '__v'].sort(),
        );

        const updatedFriendTeamMemberStreak = await streakoid.teamMemberStreaks.getOne(friendTeamMemberStreak._id);

        expect(updatedFriendTeamMemberStreak._id).toEqual(expect.any(String));
        expect(updatedFriendTeamMemberStreak.currentStreak.startDate).toBeUndefined();
        expect(updatedFriendTeamMemberStreak.currentStreak.numberOfDaysInARow).toEqual(0);
        expect(Object.keys(updatedFriendTeamMemberStreak.currentStreak).sort()).toEqual(['numberOfDaysInARow'].sort());
        expect(updatedFriendTeamMemberStreak.completedToday).toEqual(false);
        expect(updatedFriendTeamMemberStreak.active).toEqual(false);
        expect(updatedFriendTeamMemberStreak.pastStreaks).toEqual([]);
        expect(updatedFriendTeamMemberStreak.userId).toEqual(expect.any(String));
        expect(updatedFriendTeamMemberStreak.teamStreakId).toEqual(teamStreak._id);
        expect(updatedFriendTeamMemberStreak.timezone).toEqual(londonTimezone);
        expect(updatedFriendTeamMemberStreak.createdAt).toEqual(expect.any(String));
        expect(updatedFriendTeamMemberStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(updatedFriendTeamMemberStreak).sort()).toEqual(
            [
                '_id',
                'currentStreak',
                'completedToday',
                'active',
                'pastStreaks',
                'userId',
                'teamStreakId',
                'timezone',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );

        const friendTeamMemberStreakTrackingEvents = await streakoid.streakTrackingEvents.getAll({
            streakId: updatedFriendTeamMemberStreak._id,
        });
        const friendTeamMemberStreakTrackingEvent = friendTeamMemberStreakTrackingEvents[0];

        expect(friendTeamMemberStreakTrackingEvent.type).toEqual(StreakTrackingEventTypes.inactiveStreak);
        expect(friendTeamMemberStreakTrackingEvent.streakId).toEqual(updatedFriendTeamMemberStreak._id);
        expect(friendTeamMemberStreakTrackingEvent.streakType).toEqual(StreakTypes.teamMember);
        expect(friendTeamMemberStreakTrackingEvent.userId).toEqual(expect.any(String));
        expect(friendTeamMemberStreakTrackingEvent._id).toEqual(expect.any(String));
        expect(friendTeamMemberStreakTrackingEvent.createdAt).toEqual(expect.any(String));
        expect(friendTeamMemberStreakTrackingEvent.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(friendTeamMemberStreakTrackingEvent).sort()).toEqual(
            ['_id', 'type', 'streakId', 'streakType', 'userId', 'createdAt', 'updatedAt', '__v'].sort(),
        );

        const agendaJobId = String(job.attrs._id);
        const dailyJobs = await streakoid.dailyJobs.getAll({ agendaJobId });
        const dailyJob = dailyJobs[0];

        expect(dailyJob._id).toEqual(expect.any(String));
        expect(dailyJob.agendaJobId).toEqual(agendaJobId);
        expect(dailyJob.jobName).toEqual(AgendaJobNames.teamStreakDailyTracker);
        expect(dailyJob.timezone).toEqual('Europe/London');
        expect(dailyJob.localisedJobCompleteTime).toEqual(expect.any(String));
        expect(dailyJob.streakType).toEqual(StreakTypes.team);
        expect(dailyJob.createdAt).toEqual(expect.any(String));
        expect(dailyJob.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(dailyJob).sort()).toEqual(
            [
                '_id',
                'agendaJobId',
                'jobName',
                'timezone',
                'localisedJobCompleteTime',
                'streakType',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );
    });
});
