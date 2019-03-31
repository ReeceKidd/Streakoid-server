import { Router } from "express";

import { verifyJsonWebTokenMiddlewares } from "../../src/RouteMiddlewares/Utils/verifyJsonWebTokenMiddlewares";
import { getFriendsMiddlewares } from "RouteMiddlewares/Friends/getFriendsMiddlewares";

export const FriendsPaths = {
    add: "add",
};

export const userId = "userId"

const friendsRouter = Router();

friendsRouter.use('*', ...verifyJsonWebTokenMiddlewares)

friendsRouter.get(`/:${userId}`, getFriendsMiddlewares)


export default friendsRouter;