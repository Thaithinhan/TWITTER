import { Router } from 'express';
import multer from 'multer';

import storage from '../../Configs/cloudinary.config';
import TweetController from '../Controllers/tweet.controller';
import { authenticateJWT } from '../Middlewares/user.middleware';

const upload = multer({ storage })

const tweetRouter = Router()

tweetRouter.post("/", upload.array('images', 3), authenticateJWT, TweetController.createTweet)
tweetRouter.get("/", authenticateJWT, TweetController.getRelevantTweets)
tweetRouter.get("/alltweets", TweetController.getAllTweets)
tweetRouter.post('/comments', upload.array('images', 3), authenticateJWT, TweetController.createComment);//Tạo comment 
tweetRouter.get("/:id", authenticateJWT, TweetController.getTweetById)
tweetRouter.get("/user/:id", authenticateJWT, TweetController.getTweetsByUserId)
tweetRouter.delete("/:id", authenticateJWT, TweetController.deleteTweetById)
tweetRouter.patch("/:id", upload.array('medias', 1), authenticateJWT, TweetController.updateTweet)
tweetRouter.post('/:id/like', authenticateJWT, TweetController.likeTweet);
tweetRouter.post('/:id/unlike', authenticateJWT, TweetController.unlikeTweet);
tweetRouter.get('/:id/likes', TweetController.getUsersWhoLikedTweet);
tweetRouter.get("/comments/get-comment/:parentId", authenticateJWT, TweetController.getCommentsByParentId)//Get comments by parentId


export default tweetRouter