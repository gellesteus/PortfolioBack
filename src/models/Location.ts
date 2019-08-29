import mongoose from 'mongoose';

export interface ILocation extends mongoose.Document {
  images: string[];
  longDesc: string;
  name: string;
  shortDesc: string;
}

export default mongoose.model<ILocation>(
  'location',
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
