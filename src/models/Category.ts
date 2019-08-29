import mongoose from 'mongoose';
export interface ICategory extends mongoose.Document {
  name: string;
  desc: string;
  position: number;
  created_at: Date;
  section: string;
  topics: mongoose.Schema.Types.ObjectId[];
  moderators: mongoose.Schema.Types.ObjectId;
}

export default mongoose.model<ICategory>(
  'category',
  new mongoose.Schema({
    created_at: {
      default: Date.now,
      type: Date
    },
    desc: {
      required: [true, 'Description is required'],
      type: String
    },
    moderators: {
      default: [],
      type: [mongoose.Schema.Types.ObjectId]
    },
    name: {
      required: [true, 'Name is required'],
      type: String
    },
    postion: {
      default: 1,
      type: Number
    },
    section: {
      default: null,
      type: String
    },
    topics: {
      default: [],
      type: [mongoose.Schema.Types.ObjectId]
    }
  })
);
