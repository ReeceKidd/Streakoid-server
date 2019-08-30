import { Router } from "express";

import { getSoloStreaksMiddlewares } from "../../../RouteMiddlewares/SoloStreak/getSoloStreaksMiddlewares";
import { createSoloStreakMiddlewares } from "../../../RouteMiddlewares/SoloStreak/createSoloStreakMiddlewares";
import { getSoloStreakMiddlewares } from "../../../RouteMiddlewares/SoloStreak/getSoloStreakMiddlewares";
import { patchSoloStreakMiddlewares } from "../../../RouteMiddlewares/SoloStreak/patchSoloStreakMiddlewares";
import { deleteSoloStreakMiddlewares } from "../../../RouteMiddlewares/SoloStreak/deleteSoloStreakMiddlewares";
import { timezoneMiddlewares } from "../../../SharedMiddleware/timezoneMiddlewares";

export const soloStreakId = "soloStreakId";

const soloStreaksRouter = Router();

soloStreaksRouter.get(`/`, ...getSoloStreaksMiddlewares);

soloStreaksRouter.get(`/:${soloStreakId}`, ...getSoloStreakMiddlewares);

soloStreaksRouter.delete(`/:${soloStreakId}`, ...deleteSoloStreakMiddlewares);

soloStreaksRouter.use(...timezoneMiddlewares);

soloStreaksRouter.post(`/`, ...createSoloStreakMiddlewares);

soloStreaksRouter.patch(`/:${soloStreakId}`, ...patchSoloStreakMiddlewares);

export default soloStreaksRouter;