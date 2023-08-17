import { Document, ObjectId } from 'mongoose';

export interface IUser extends Document {
    fullname: string;
    username: string;
    email: string;
    password: string;
    status: 0 | 1;
    email_verify_token: string;
    forgot_password_token: string;
    verify: 0 | 1 | 2;
    role: 0 | 1;
    avatar: string;
    cover_photo: string;
}

export interface IErrorValidate {
    errorPassword: string;
    errorFullname: string;
    errorEmail: string;
    errorUsername: string;
}

export interface UploadFiles {
    avatar?: Express.Multer.File[];
    cover_photo?: Express.Multer.File[];
}

//TYPE FOLLOW 
export interface IFollow extends Document {
    current_userId: ObjectId;
    followed_userId: ObjectId;
}

//TYPE TWEET
export interface ITweet extends Document {
    type: 'tweet' | 'comment' | 'retweet' | 'quote';
    author: ObjectId;
    content: string;
    parentId?: ObjectId | null;
    hashtags?: string[] | null;
    mentions?: ObjectId[] | null;
    medias?: string[] | null;
    likes: ObjectId[];
}

//TYPE NOTIFICATION 
export interface INotification extends Document {
    senderId: ObjectId;
    receiverId: ObjectId;
    type: 'like' | 'comment'; // Loại thông báo
    tweetId: ObjectId; // ID của tweet liên quan
}