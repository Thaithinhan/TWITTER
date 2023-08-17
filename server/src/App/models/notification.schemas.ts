import mongoose, { model, Schema } from 'mongoose';

import { INotification } from '../Types/type';

const DOCUMENT_NAME = 'Notification';
const COLLECTION_NAME = 'Notifications';

const notificationsSchema = new Schema<INotification>(
    {
        senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // User schema reference
        receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // User schema reference
        type: {
            type: String,
            enum: ["like", "comment"],
        }, // Loại thông báo
        tweetId: { type: Schema.Types.ObjectId, ref: 'Tweet' }, // ID của tweet liên quan
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

const NotificationModel = model<INotification>(DOCUMENT_NAME, notificationsSchema);

export default NotificationModel;
