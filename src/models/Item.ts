import mongoose from 'mongoose';

export interface IItem extends mongoose.Document {
  created_at: Date;
  images: string[];
  longDesc: string;
  name: string;
  shortDesc: string;
}

export default mongoose.model<IItem>(
  'item',
  new mongoose.Schema({
    created_at: {
      default: Date.now,
      type: Date
    },
    images: {
      default: [],
      type: [String]
    },
    longDesc: {
      required: [true, 'Description is required'],
      type: String
    },
    name: {
      required: [true, 'Name is required'],
      type: String
    },
    shortDesc: {
      required: [true, 'Description is required'],
      type: String
    }
  })
);
