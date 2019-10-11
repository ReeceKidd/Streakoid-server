import * as mongoose from 'mongoose';
import { Collections } from './Collections';
import { Models } from './Models';
import { TimezoneJob, StreakTypes, AgendaJobNames, GroupStreakTypes } from '@streakoid/streakoid-sdk/lib';
import { number } from 'joi';

export type TimezoneJobModel = TimezoneJob & mongoose.Document;

export const timezoneJobSchema = new mongoose.Schema(
    {
        jobName: {
            type: AgendaJobNames,
            required: true,
        },
        streakType: {
            type: StreakTypes,
            required: true,
        },
        numberOfStreaks: {
            type: Number,
            required: true,
        },
        groupStreakType: {
            type: GroupStreakTypes,
        },
    },
    {
        timestamps: true,
        collection: Collections.TimezoneJobs,
    },
);

export const timezoneJobModel: mongoose.Model<TimezoneJobModel> = mongoose.model<TimezoneJobModel>(
    Models.TimezoneJob,
    timezoneJobSchema,
);
