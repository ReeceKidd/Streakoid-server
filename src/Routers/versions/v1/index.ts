import { Router } from 'express';

import { soloStreaksRouter } from './soloStreaksRouter';
import { usersRouter } from './usersRouter';
import { stripeRouter } from './stripeRouter';
import { completeSoloStreakTasksRouter } from './completeSoloStreakTasksRouter';
import { completeTeamMemberStreakTasksRouter } from './completeTeamMemberStreakTaskRouter';
import { teamStreaksRouter } from './teamStreakRouter';
import { streakTrackingEventRouter } from './streakTrackingEventRouter';
import { agendaJobsRouter } from './agendaJobRouter';
import { feedbackRouter } from './feedbackRouter';
import { teamMemberStreaksRouter } from './teamMemberStreaksRouter';
import { friendRequestsRouter } from './friendRequestRouter';
import { timezoneMiddlewares } from '../../../SharedMiddleware/timezoneMiddlewares';
import { authenticationMiddlewares } from '../../../SharedMiddleware/authenticationMiddlewares';
import { incompleteSoloStreakTasksRouter } from './incompleteSoloStreakTaskRouter';
import { incompleteTeamMemberStreakTasksRouter } from './incompleteTeamMemberStreakTaskRouter';
import { dailyJobsRouter } from './dailyJobsRouter';
import { completeTeamStreakTasksRouter } from './completeTeamStreakTasksRouter';
import { RouterCategories } from '@streakoid/streakoid-sdk/lib';
import { registerUserMiddlewares } from '../../../RouteMiddlewares/User/registerUserMiddlewares';

const v1Router = Router();

v1Router.use(...timezoneMiddlewares);

// Unauthenticated routes
v1Router.post(`/${RouterCategories.users}`, ...registerUserMiddlewares);

// Temporarily unauthenticated so agenda jobs still work.
v1Router.use(`/${RouterCategories.soloStreaks}`, soloStreaksRouter);
v1Router.use(`/${RouterCategories.teamStreaks}`, teamStreaksRouter);
v1Router.use(`/${RouterCategories.streakTrackingEvents}`, streakTrackingEventRouter);
v1Router.use(`/${RouterCategories.teamMemberStreaks}`, teamMemberStreaksRouter);
v1Router.use(`/${RouterCategories.completeSoloStreakTasks}`, completeSoloStreakTasksRouter);
v1Router.use(`/${RouterCategories.completeTeamStreakTasks}`, completeTeamStreakTasksRouter);
v1Router.use(`/${RouterCategories.completeTeamMemberStreakTasks}`, completeTeamMemberStreakTasksRouter);

// Should be admin only routes
v1Router.use(`/${RouterCategories.dailyJobs}`, dailyJobsRouter);
v1Router.use(`/${RouterCategories.agendaJobs}`, agendaJobsRouter);

// Authenticated User Routes
v1Router.use(...authenticationMiddlewares);
v1Router.use(`/${RouterCategories.users}`, usersRouter);
v1Router.use(`/${RouterCategories.stripe}`, stripeRouter);
v1Router.use(`/${RouterCategories.incompleteSoloStreakTasks}`, incompleteSoloStreakTasksRouter);
v1Router.use(`/${RouterCategories.incompleteTeamMemberStreakTasks}`, incompleteTeamMemberStreakTasksRouter);
v1Router.use(`/${RouterCategories.feedbacks}`, feedbackRouter);
v1Router.use(`/${RouterCategories.friendRequests}`, friendRequestsRouter);

export default v1Router;
