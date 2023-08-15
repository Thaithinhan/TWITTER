// middlewares/checkFollow.ts

import { NextFunction, Request, Response } from 'express';

import FollowModel from '../models/follow.schemas';

export const checkAlreadyFollowing = async (req: Request, res: Response, next: NextFunction) => {
    const currentUserId = req.userId;
    const userIdToFollow = req.body.userIdToFollow;

    const existingFollow = await FollowModel.findOne({
        current_userId: currentUserId,
        followed_userId: userIdToFollow
    });

    if (existingFollow) {
        return res.status(400).json({ error: 'You are already following this user' });
    }

    next();
};
