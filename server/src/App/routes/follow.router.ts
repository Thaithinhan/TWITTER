// routes/follow.ts
import express from 'express';

import FollowController from '../Controllers/follow.controller';
import { checkAlreadyFollowing } from '../Middlewares/follow.middleware';
import { authenticateJWT } from '../Middlewares/user.middleware';

const followRouter = express.Router();

followRouter.get("/random-follower", authenticateJWT, FollowController.getRandomUsersToFollow)//lấy gọi ý follow
followRouter.get("/following/:id", FollowController.getUsersFollowingByUserId)//lấy danh sách đang follow theo userID
followRouter.get("/followers/:id", FollowController.getUsersWhoFollowUserById)//lấy danh sách những người đang follow userID
followRouter.post("/follow-user", authenticateJWT, checkAlreadyFollowing, FollowController.followUser)// follow user
followRouter.delete("/unfollow-user/:id", authenticateJWT, FollowController.unfollowUser)// unfollow user
followRouter.get("/checkFollow/:id", authenticateJWT, FollowController.isFollowing)// check có đang follow user không

export default followRouter;
