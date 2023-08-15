import mongoose, { model, Schema } from 'mongoose';

import { IUser } from '../Types/type';

const DOCUMENT_NAME = "User"
const COLLECTION_NAME = "Users"

const userSchemas = new Schema<IUser>({
    fullname: {
        type: String,
    },
    username: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    status: {
        type: Number,
        enum: [0, 1], default: 1
    },
    email_verify_token: {
        type: String,
        default: '',
    },
    forgot_password_token: {
        type: String,
        default: '',
    },
    verify: {
        type: Number,
        enum: [0, 1, 2],
        default: 0,
    },
    role: {
        type: Number,
        enum: [0, 1],
        default: 0,
    },
    avatar: {
        type: String,
        default: 'https://sangtao.sawaco.com.vn/wwwimages/Avatar/defaultavatar.png',
    },
    cover_photo: {
        type: String,
        default: 'https://hocnhanh.vn/wp-content/uploads/2022/02/ultimate-guide-to-your-twitter-header-size-and-cover-photo-twitter-600x240.png',
    },
},
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    });

const UserModel = model<IUser>(DOCUMENT_NAME, userSchemas)
export default UserModel