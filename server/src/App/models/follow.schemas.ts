import mongoose, { model, Schema } from 'mongoose';

import { IFollow } from '../Types/type';

const DOCUMENT_NAME = 'following';
const COLLECTION_NAME = 'Following';

const followingsSchema = new Schema<IFollow>(
  {
    current_userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    followed_userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

const FollowModel = model<IFollow>(DOCUMENT_NAME, followingsSchema);

export default FollowModel;
