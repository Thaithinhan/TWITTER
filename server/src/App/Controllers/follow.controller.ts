// controllers/FollowController.ts

import { Request, Response } from 'express';
import mongoose from 'mongoose';

import FollowModel from '../models/follow.schemas';
import UserModel from '../models/user.schemas';

class FollowController {
    static async followUser(req: Request, res: Response): Promise<void> {
        try {
            const currentUserId = req.userId;  // Lấy từ middleware xác thực
            const userIdToFollow = req.body.userIdToFollow;

            const newFollow = new FollowModel({
                current_userId: currentUserId,
                followed_userId: userIdToFollow
            });

            await newFollow.save();

            // Truy vấn để lấy thông tin chi tiết về người dùng được theo dõi
            const followedUser = await UserModel.findById(userIdToFollow);

            if (!followedUser) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            res.status(200).json({ message: 'Followed successfully', user: followedUser });
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async unfollowUser(req: Request, res: Response): Promise<void> {
        try {
            const currentUserId = req.userId;
            const userIdToUnfollow = req.params.id

            await FollowModel.deleteOne({
                current_userId: currentUserId,
                followed_userId: userIdToUnfollow
            });
            res.status(200).json({ message: 'Unfollowed successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async getRandomUsersToFollow(req: Request, res: Response): Promise<void> {
        try {
            const currentUserId = req.userId
            if (!currentUserId) {
                res.status(400).json({ error: 'User ID not provided' });
                return;
            }
            // Lấy danh sách ID của những người dùng mà người dùng hiện tại đã follow
            const followedUsers = await FollowModel.find({ current_userId: currentUserId });
            const followedUserIds = followedUsers.map(follow => new mongoose.Types.ObjectId(follow?.followed_userId?.toString()));

            // Thêm ID của người dùng hiện tại vào danh sách để tránh lấy thông tin của chính họ
            followedUserIds.push(new mongoose.Types.ObjectId(currentUserId));

            // Lấy 10 người dùng mà người dùng hiện tại chưa follow và không phải là admin
            const usersToFollow = await UserModel.aggregate([
                { $match: { _id: { $nin: followedUserIds }, role: { $ne: 1 } } },
                { $sample: { size: 10 } }
            ]);

            res.status(200).json(usersToFollow);
        } catch (error) {

            res.status(500).json({ error: 'Server error' });
        }
    }

    //CHECK FOLLOWING USER 
    static async isFollowing(req: Request, res: Response): Promise<void> {
        try {
            const currentUserId = req.userId;  // Lấy từ middleware xác thực
            const userIdToCheck = req.params.id; // ID của user mà chúng ta muốn kiểm tra

            const existingFollow = await FollowModel.findOne({
                current_userId: currentUserId,
                followed_userId: userIdToCheck
            });
            if (existingFollow) {
                res.status(200).json({ isFollowing: true });
            } else {
                res.status(200).json({ isFollowing: false });
            }
        } catch (error) {
            console.log(error);

            res.status(500).json({ error: 'Server error' });
        }
    }
    //GET FOLLOWING USER BY ID
    static async getUsersFollowingByUserId(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.id;

            if (!userId) {
                res.status(400).json({ error: 'User ID not provided' });
                return;
            }
            // Lấy danh sách ID của những người dùng mà ID người dùng này đang follow
            const followings = await FollowModel.find({ current_userId: userId })

            const followingUserIds = followings.map(follow => follow?.followed_userId?.toString());
            // Lấy thông tin chi tiết của những người dùng mà ID người dùng này đang follow
            const users = await UserModel.find({ _id: { $in: followingUserIds } });

            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
        }
    }
    // GET USERS WHO ARE FOLLOWING A PARTICULAR USER BY ID
    static async getUsersWhoFollowUserById(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.id;

            if (!userId) {
                res.status(400).json({ error: 'User ID not provided' });
                return;
            }

            // Lấy danh sách ID của những người dùng theo dõi người dùng này
            const followers = await FollowModel.find({ followed_userId: userId });
            const followerUserIds = followers.map(follow => follow.current_userId.toString());

            // Lấy thông tin chi tiết của những người dùng đang theo dõi người dùng này
            const users = await UserModel.find({ _id: { $in: followerUserIds } });

            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
        }
    }

}

export default FollowController;
