import mongoose from 'mongoose';

export interface ITopic extends mongoose.Document {
  body: mongoose.Schema.Types.ObjectId;
  category: mongoose.Schema.Types.ObjectId;
  created_at: Date;
  poster: mongoose.Schema.Types.ObjectId;
  posts: mongoose.Schema.Types.ObjectId | null;
  title: string;
}

export default mongoose.model<ITopic>(
  'topic',
  new mongoose.Schema({
    body: {
      required: [true, 'the body of the post is required'],
      type: mongoose.Schema.Types.ObjectId
    },
    category: {
      required: [true, 'A topic must belong to a category'],
      type: mongoose.Schema.Types.ObjectId
    },
    created_at: {
      default: Date.now,
      type: Date
    },
    poster: {
      required: [true, "The poster's id is required"],
      type: mongoose.Schema.Types.ObjectId
    },
    posts: {
      type: [mongoose.Schema.Types.ObjectId]
    },
    title: {
      required: [true, 'A title is required'],
      type: String
    }
  })
);
