import mongoose, { Schema } from 'mongoose';

import { ITweet } from '../Types/type';

const DOCUMENT_NAME = 'Tweet';
const COLLECTION_NAME = 'Tweets';

const tweetSchema = new mongoose.Schema<ITweet>(
    {
        type: {
            type: String,
            enum: ['tweet', 'comment', 'retweet', 'quote'],
            required: true,
            default: 'tweet'
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            require: true
        },
        content: {
            type: String,
            required: true,
        },
        parentId: {
            type: Schema.Types.ObjectId,
            ref: 'Tweet',
            default: null,
        },
        hashtags: {
            type: [String],
            default: null,
        },
        mentions: {
            type: [Schema.Types.ObjectId],
            default: null,
        },
        medias: {
            type: [String],
            default: [],
        },
        likes: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

//Export model
const TweetModel = mongoose.model<ITweet>(DOCUMENT_NAME, tweetSchema);
export default TweetModel