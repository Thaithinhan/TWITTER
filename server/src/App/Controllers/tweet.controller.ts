import e, { Request, Response } from 'express';
import mongoose, { Types } from 'mongoose';

import FollowModel from '../models/follow.schemas';
import NotificationModel from '../models/notification.schemas';
import TweetModel from '../models/tweet.schemas';
import UserModel from '../models/user.schemas';

class TweetController {

    //Create new Tweet
    static async createTweet(req: Request, res: Response) {
        try {
            const { content } = req.body;
            const author = req.userId

            let mediaUrls: string[] = [];

            // Kiểm tra nếu có ảnh được đính kèm
            if (req.files) {
                const images: Express.Multer.File[] = req.files as Express.Multer.File[];
                mediaUrls = images.map(file => file.path);
            }

            const newTweet = await TweetModel.create({
                content,
                medias: mediaUrls, // nếu không có ảnh, sẽ không thêm trường medias vào tweet
                author
            });

            res.status(200).json({ success: true, newTweet });
        } catch (error) {
            res.status(500).json({ success: false, message: error });
        }
    }
    //GET ALL TWEET BUY CURRENT USER OR CURRENT USER FOLLOWING OR TRENDY
    static async getRelevantTweets(req: Request, res: Response) {
        try {
            const userId = req.userId;

            // Lấy danh sách người mà user hiện tại theo dõi từ FollowModel
            const followingRecords = await FollowModel.find({ current_userId: userId });
            const followingIds = followingRecords.map(record => record.followed_userId);

            // Truy vấn lấy tweets
            const tweets = await TweetModel.find({
                type: 'tweet',
                $or: [
                    { 'likes.length': { $gte: 5 } },
                    { 'author': userId },
                    { 'author': { $in: followingIds } }
                ]
            })
                .sort({ createdAt: -1 })
                .populate('author') // Lấy tất cả thông tin của người tạo tweet
                .exec();

            res.status(200).json({ success: true, tweets });
        } catch (error) {
            console.log(error);

            res.status(500).json({ success: false, message: error });
        }
    }
    //GET ALL TWEET 
    static async getAllTweets(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const perPage: number = 10; // Số lượng tweets trên mỗi trang

            const totalTweets = await TweetModel.countDocuments();
            const totalPages = Math.ceil(totalTweets / perPage);

            const tweets = await TweetModel.find()
                .sort({ createdAt: -1 })
                .skip((page - 1) * perPage)
                .limit(perPage)
                .populate('author')
                .exec();

            res.status(200).json({ success: true, tweets, totalPages });
        } catch (error) {
            res.status(500).json({ success: false, message: error });
        }
    }
    //GET TWEET BY ID TWEET
    static async getTweetById(req: Request, res: Response) {
        try {
            const tweetId = req.params.id; // Giả sử rằng ID của tweet được truyền qua route params như /tweets/:id

            const tweet = await TweetModel.findById(tweetId)
                .populate('author') // Nếu bạn muốn lấy thông tin chi tiết về tác giả của tweet
                .exec();

            if (!tweet) {
                return res.status(404).json({ success: false, message: "Tweet not found" });
            }

            res.status(200).json({ success: true, tweet });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
        }
    }
    // GET TWEETS BY USER ID
    static async getTweetsByUserId(req: Request, res: Response) {
        try {
            const userId = req.params.id; // Giả sử rằng ID của user được truyền qua route params như /tweets/user/:userId

            const tweets = await TweetModel.find({ author: userId, type: "tweet" })
                .populate('author') // Lấy thông tin chi tiết về tác giả của tweet
                .sort({ createdAt: -1 }) // Sắp xếp theo thứ tự từ mới nhất
                .exec();

            // if (!tweets || tweets.length === 0) {
            //     return res.status(404).json({ success: false, message: "No tweets found for this user", tweets: [] });
            // }

            res.status(200).json({ success: true, tweets });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
        }
    }

    // DELETE TWEET by ID
    static async deleteTweetById(req: Request, res: Response) {
        try {
            const tweetId = req.params.id; // Giả sử rằng ID của tweet được truyền qua route params như /tweets/:id
            const deletedTweet = await TweetModel.findByIdAndDelete(tweetId);

            if (!deletedTweet) {
                return res.status(404).json({ success: false, message: "Tweet not found" });
            }
            // Lấy danh sách các tweet sau khi xóa
            // const tweetsAfterDeletion = await TweetController.getRelevantTweets(req, res);
            res.status(200).json({ success: true, message: "Tweet successfully deleted" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
        }
    }

    // UPDATE TWEET BY TWEET ID
    static async updateTweet(req: Request, res: Response) {
        try {
            const tweetId = req.params.id; // Assuming ID of the tweet is passed as a route param like /tweets/:id

            // Check if tweet exists
            const tweet = await TweetModel.findById(tweetId);
            if (!tweet) {
                return res.status(404).json({ success: false, message: "Tweet not found" });
            }

            const { content } = req.body;

            let mediaUrls: string[] = [];

            // Check if there are new images attached
            if (req.files) {
                const images: Express.Multer.File[] = req.files as Express.Multer.File[];
                mediaUrls = images.map(file => file.path);
            }

            // If new content is provided, update it
            if (content) {
                tweet.content = content;
            }

            // If new media files are provided, replace old ones
            if (mediaUrls.length > 0) {
                tweet.medias = mediaUrls;
            }

            await tweet.save();

            res.status(200).json({ success: true, message: "Tweet updated successfully", tweet });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
        }
    }
    // ADD LIKE TWEET 
    static async likeTweet(req: Request, res: Response) {
        try {
            const tweetId = req.params.id;
            const userId: any = req.userId;
            const tweet = await TweetModel.findById(tweetId);
            if (!tweet) {
                return res.status(404).json({ success: false, message: "Tweet not found" });
            }
            // Kiểm tra xem người dùng đã like bài tweet này chưa
            if (!tweet.likes.includes(userId)) {
                tweet.likes.push(userId);
                await tweet.save();
            }
            //XỬ LÝ SOCKET 
            // Kiểm tra xem người dùng có tự like bài viết của mình không
            if (userId.toString() !== tweet.author.toString()) {
                //XỬ LÝ SOCKET 
                // Tạo thông báo và lưu vào cơ sở dữ liệu
                const newNotification: any = await NotificationModel.create({
                    senderId: userId, // Người thích bài tweet
                    receiverId: tweet.author, // Người tạo bài tweet
                    type: 'like', // Loại thông báo là "like"
                    tweetId: tweet._id, // ID của bài tweet
                });
                // Thêm thông báo notifications database
                await newNotification.save();

                // Gửi thông báo tới người tạo tweet qua socket.io
                const io = req.app.get('socketio');
                io.emit('notification', { receiverId: tweet?.author, data: newNotification })
            }

            res.status(200).json({ success: true, message: "Liked successfully" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
        }
    }
    //UNLIKE TWEET
    static async unlikeTweet(req: Request, res: Response) {
        try {
            const tweetId = req.params.id;
            const userId: any = req.userId;

            const tweet = await TweetModel.findById(tweetId);
            // console.log(tweet?.likes);
            if (!tweet) {
                return res.status(404).json({ success: false, message: "Tweet not found" });
            }
            // Using mongoose.Schema.Types.ObjectId for creating a new ObjectId
            const index = tweet.likes.indexOf(userId);
            if (index !== -1) {
                tweet.likes.splice(index, 1);
                await tweet.save();
            }
            res.status(200).json({ success: true, message: "Unliked successfully" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
        }
    }
    //GET PEOPLE LIKE TWEETS
    static async getUsersWhoLikedTweet(req: Request, res: Response) {
        try {
            const tweetId = req.params.id;

            const tweet = await TweetModel.findById(tweetId).populate('likes');
            if (!tweet) {
                return res.status(404).json({ success: false, message: "Tweet not found" });
            }

            res.status(200).json({ success: true, users: tweet.likes });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
        }
    }
    //CREATE COMMENT 
    static async createComment(req: Request, res: Response) {
        try {
            const { content, parentId } = req.body;
            const author = req.userId;
            // console.log(1111111, author);
            // console.log(22222222, req.body);
            // Kiểm tra parentID
            const parentTweet = await TweetModel.findById(parentId);
            if (!parentTweet) {
                return res.status(404).json({ success: false, message: "Parent tweet not found" });
            }

            let mediaUrls: string[] = [];

            // Kiểm tra nếu có ảnh được đính kèm
            if (req.files) {
                const images: Express.Multer.File[] = req.files as Express.Multer.File[];
                mediaUrls = images.map(file => file.path);
            }
            const newComment = await TweetModel.create({
                content,
                medias: mediaUrls,
                author,
                type: 'comment',
                parentId
            });
            await newComment.save();
            // Kiểm tra xem người dùng có tự comment bài viết của mình không
            if (author?.toString() !== parentTweet.author.toString()) {
                // Tạo thông báo Socket và lưu vào cơ sở dữ liệu
                const newNotification = await NotificationModel.create({
                    senderId: author, // Người bình luận
                    receiverId: parentTweet.author, // Người tạo bài tweet gốc
                    type: 'comment', // Loại thông báo là "comment"
                    tweetId: parentTweet._id, // ID của bài tweet gốc
                });
                // Thêm thông báo vào comment vào cơ sở dữ liệu
                await newNotification.save();
                // Gửi thông báo tới người tạo tweet gốc qua socket.io
                const io = req.app.get('socketio');
                io.emit('notification', { receiverId: newComment?.author, data: newNotification })
            }
            res.status(200).json({ success: true, newComment });
        } catch (error) {
            console.log(error);

            res.status(500).json({ success: false, message: error });
        }
    }
    // GET LIST OF COMMENTS BY PARENT TWEET ID
    static async getCommentsByParentId(req: Request, res: Response) {
        try {
            const parentId = req.params.parentId; // Giả sử rằng ID của parent tweet được truyền qua route params như /comments/:id
            const comments = await TweetModel.find({ type: 'comment', parentId: parentId })
                .populate('author') // Lấy thông tin chi tiết về tác giả của comment
                .sort({ createdAt: -1 }) // Sắp xếp theo thứ tự từ mới nhất
                .exec();

            res.status(200).json({ success: true, comments });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
        }
    }
}
export default TweetController;

