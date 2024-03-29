import * as mongoose from 'mongoose';
import { Collections } from './Collections';
import { Models } from './Models';
import ActivityFeedItemTypes from '@streakoid/streakoid-models/lib/Types/ActivityFeedItemTypes';

export type ActivityFeedItemModel = mongoose.Document;

export const activityFeedItemSchema = new mongoose.Schema(
    {
        activityFeedItemType: {
            type: ActivityFeedItemTypes,
            required: true,
        },
        userId: {
            type: String,
        },
        username: {
            type: String,
        },
        userProfileImage: {
            type: String,
        },
        soloStreakId: {
            type: String,
        },
        soloStreakName: {
            type: String,
        },
        soloStreakDescription: {
            type: String,
        },
        challengeStreakId: {
            type: String,
        },
        challengeId: {
            type: String,
        },
        challengeName: {
            type: String,
        },
        teamMemberStreakId: {
            type: String,
        },
        teamStreakId: {
            type: String,
        },
        teamStreakName: {
            type: String,
        },
        streakNumberOfDays: {
            type: Number,
        },
        teamStreakDescription: {
            type: String,
        },
        userFollowedId: {
            type: String,
        },
        userFollowedUsername: {
            type: String,
        },
        numberOfDaysLost: {
            type: Number,
        },
    },
    {
        timestamps: true,
        collection: Collections.ActivityFeedItems,
    },
);

export const activityFeedItemModel: mongoose.Model<ActivityFeedItemModel> = mongoose.model<ActivityFeedItemModel>(
    Models.ActivityFeedItem,
    activityFeedItemSchema,
);
