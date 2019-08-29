import mongoose from 'mongoose';

export interface IPost extends mongoose.Document {
  body: string;
  category: string;
  created_at: Date;
  poster: mongoose.Schema.Types.ObjectId;
  topic: mongoose.Schema.Types.ObjectId;
  updated: boolean;
  updated_at: Date;
}

export default mongoose.model<IPost>(
  'post',
  new mongoose.Schema({
    body: {
      required: [true, 'A body is required'],

      /* Will reference a post that is to be displayed as the body of the first post of the topic */
      type: String
    },
    category: {
      required: [true, 'A post must belong to a category'],
      type: mongoose.Schema.Types.ObjectId
    },
    created_at: {
      default: Date.now,
      type: Date
    },
    poster: {
      required: [true, 'A post must have a poster'],
      type: mongoose.Schema.Types.ObjectId
    },
    topic: {
      required: [true, 'A post must belong to a topic'],
      type: mongoose.Schema.Types.ObjectId
    },
    updated: {
      deafult: false,
      type: Boolean
    },
    updated_at: {
      default: null,
      type: Date
    }
  })
);
