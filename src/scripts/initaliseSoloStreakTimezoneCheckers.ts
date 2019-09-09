import moment from "moment";

import { agendaJobModel } from "../Models/AgendaJob";
import {
  agenda,
  AgendaJobs,
  AgendaTimeRanges,
  AgendaProcessTimes
} from "../Agenda/agenda";
import { dayFormat } from "../RouteMiddlewares/CompleteTask/createCompleteTaskMiddlewares";

export const initialiseSoloStreakTimezoneCheckerJobs = async () => {
  const timezones = moment.tz.names();
  const numberOfTimezones = timezones.length;

  const numberOfSoloStreakTimezoneCheckerJobs = await agendaJobModel.countDocuments(
    {
      name: AgendaJobs.soloStreakDailyTracker,
      "data.custom": false
    }
  );
  console.log(
    `Number of solo streak daily tracker jobs: ${numberOfSoloStreakTimezoneCheckerJobs}`
  );
  console.log(`Number of timezones: ${numberOfTimezones}`);
  if (numberOfTimezones === numberOfSoloStreakTimezoneCheckerJobs) {
    console.log(
      "Number of timezones matches number of solo streak timezone checker jobs. No jobs need to be created"
    );
    return;
  }

  return timezones.map(async (timezone: string) => {
    const existingTimezone = await agendaJobModel.findOne({
      name: AgendaJobs.soloStreakDailyTracker,
      "data.timezone": timezone
    });

    if (!existingTimezone) {
      await createSoloStreakDailyTrackerJob(timezone);
    }
  });
};

export const createSoloStreakDailyTrackerJob = async (timezone: string) => {
  const endOfDay = moment.tz(timezone).endOf(AgendaTimeRanges.day);
  const date = endOfDay.toDate();
  (async () => {
    const soloStreakDailyTrackerJob = agenda.create(
      AgendaJobs.soloStreakDailyTracker,
      { timezone }
    );
    soloStreakDailyTrackerJob.schedule(date);
    await agenda.start();
    await soloStreakDailyTrackerJob
      .repeatEvery(AgendaProcessTimes.oneDay)
      .save();
  })();
};
