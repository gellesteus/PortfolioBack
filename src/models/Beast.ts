import mongoose from 'mongoose';

export interface IBeast extends mongoose.Document {
  name: string;
  shortDesc: string;
  longDesc: string;
  images?: string[] | null;
}

export default mongoose.model<IBeast>(
  'beast',
  new mongoose.Schema({
    images: {
      type: [String]
    },
    longDesc: {
      required: [true, 'Long description is required'],
      type: String
    },
    name: {
      required: [true, 'Name is required'],
      type: String
    },
    shortDesc: {
      required: [true, 'Short description is required'],
      type: String
    }
  })
);
