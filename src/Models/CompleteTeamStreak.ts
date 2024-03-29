import * as mongoose from 'mongoose';
import { Models } from './Models';
import { Collections } from './Collections';
import { CompleteTeamStreak } from '@streakoid/streakoid-models/lib/Models/CompleteTeamStreak';

export type CompleteTeamStreakModel = CompleteTeamStreak & mongoose.Document;

export const completeTeamStreakSchema = new mongoose.Schema(
    {
        teamStreakId: {
            required: true,
            index: true,
            type: String,
        },
        taskCompleteTime: {
            required: true,
            type: Date,
        },
        taskCompleteDay: {
            required: true,
            type: String,
        },
    },
    {
        timestamps: true,
        collection: Collections.CompleteTeamStreaks,
    },
);

export const completeTeamStreakModel: mongoose.Model<CompleteTeamStreakModel> = mongoose.model<CompleteTeamStreakModel>(
    Models.CompleteTeamStreak,
    completeTeamStreakSchema,
);
