import completeTasks from "./completeTasks";
import soloStreaks from "./soloStreaks";
import stripe from "./stripe";
import users from "./users";
import friends from "./friends";
import groupStreaks from "./groupStreaks";
import streakTrackingEvents from "./streakTrackingEvents";
import agendaJobs from "./agendaJobs";
import feedbacks from "./feedbacks";
import groupMemberStreaks from "./groupMemberStreaks";

export default {
  completeTasks,
  soloStreaks,
  stripe,
  users: {
    ...users,
    friends
  },
  groupStreaks,
  streakTrackingEvents,
  agendaJobs,
  feedbacks,
  groupMemberStreaks
};
