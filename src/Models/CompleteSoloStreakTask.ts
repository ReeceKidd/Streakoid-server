import * as mongoose from "mongoose";
import { Models } from "./Models";
import { Collections } from "./Collections";
import { CompleteSoloStreakTask } from "@streakoid/streakoid-sdk/lib";

export type CompleteSoloStreakTaskModel = CompleteSoloStreakTask &
  mongoose.Document;

export const completeSoloStreakTaskSchema = new mongoose.Schema(
  {
    streakId: {
      required: true,
      index: true,
      type: String
    },
    userId: {
      required: true,
      index: true,
      type: String
    },
    taskCompleteTime: {
      required: true,
      type: Date
    },
    taskCompleteDay: {
      required: true,
      type: String
    },
    streakType: {
      required: true,
      type: String
    }
  },
  {
    timestamps: true,
    collection: Collections.CompleteSoloStreakTasks
  }
);

completeSoloStreakTaskSchema.index({ userId: 1, streakId: 1 });

export const completeSoloStreakTaskModel: mongoose.Model<
  CompleteSoloStreakTaskModel
> = mongoose.model<CompleteSoloStreakTaskModel>(
  Models.CompleteSoloStreakTask,
  completeSoloStreakTaskSchema
);