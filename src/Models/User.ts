import * as mongoose from 'mongoose';
import { Collections } from './Collections';
import { Models } from './Models';
import { User } from '@streakoid/streakoid-models/lib';
import UserTypes from '@streakoid/streakoid-models/lib/Types/UserTypes';

export type UserModel = User & mongoose.Document;

export const originalImageUrl = 'https://streakoid-profile-pictures.s3-eu-west-1.amazonaws.com/steve.jpg';

export const userSchema = new mongoose.Schema(
    {
        username: {
            required: true,
            type: String,
            unique: true,
            trim: true,
            index: true,
        },
        membershipInformation: {
            isPayingMember: {
                type: Boolean,
                default: false,
            },
            currentMembershipStartDate: {
                type: Date,
                default: null,
            },
            pastMemberships: {
                type: Array,
                default: [],
            },
        },
        email: {
            required: true,
            type: String,
            unique: true,
            trim: true,
        },
        userType: {
            type: String,
            enum: [UserTypes.basic, UserTypes.admin],
            default: UserTypes.basic,
        },
        timezone: {
            type: String,
            required: true,
        },
        profileImages: {
            type: Object,
            default: {
                originalImageUrl,
            },
        },
        followers: {
            type: Array,
            default: [],
        },
        following: {
            type: Array,
            default: [],
        },
        stripe: {
            customer: {
                type: String,
                default: null,
            },
            subscription: {
                type: String,
                default: null,
            },
        },
        pushNotificationToken: {
            type: String,
            default: null,
        },
        pushNotifications: {
            completeAllStreaksReminder: {
                type: {
                    enabled: {
                        type: Boolean,
                    },
                    expoId: {
                        type: String,
                    },
                    reminderHour: {
                        type: Number,
                    },
                    reminderMinute: {
                        type: Number,
                    },
                    streakReminderType: {
                        type: String,
                    },
                },
                required: false,
            },
            customStreakReminders: {
                type: Array,
                default: [],
            },
            teamStreakUpdates: {
                enabled: {
                    type: Boolean,
                    default: true,
                },
            },
            newFollowerUpdates: {
                enabled: {
                    type: Boolean,
                    default: true,
                },
            },
            achievementUpdates: {
                enabled: {
                    type: Boolean,
                    default: true,
                },
            },
        },
        hasCompletedIntroduction: {
            type: Boolean,
            default: false,
        },
        achievements: {
            type: Array,
            default: [],
        },
    },
    {
        timestamps: true,
        collection: Collections.Users,
    },
);

export const userModel: mongoose.Model<UserModel> = mongoose.model<UserModel>(Models.User, userSchema);
