import * as mongoose from 'mongoose';
import { Collections } from './Collections';
import { Models } from './Models';
import AgendaJobNames from '@streakoid/streakoid-models/lib/Types/AgendaJobNames';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
import { DailyJob } from '@streakoid/streakoid-models/lib/Models/DailyJob';

export type DailyJobModel = DailyJob & mongoose.Document;

export const dailyJobSchema = new mongoose.Schema(
    {
        agendaJobId: {
            type: String,
            required: true,
        },
        jobName: {
            type: AgendaJobNames,
            required: true,
        },
        timezone: {
            type: String,
            required: true,
        },
        localisedJobCompleteTime: {
            type: String,
            required: true,
        },
        streakType: {
            type: StreakTypes,
            required: true,
        },
    },
    {
        timestamps: true,
        collection: Collections.DailyJobs,
    },
);

export const dailyJobModel: mongoose.Model<DailyJobModel> = mongoose.model<DailyJobModel>(
    Models.DailyJob,
    dailyJobSchema,
);
