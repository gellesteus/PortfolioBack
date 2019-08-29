import mongoose from 'mongoose';

export interface IRule extends mongoose.Document {
  longDesc: string;
  name: string;
  shortDesc: string;
}

export default mongoose.model<IRule>(
  'rule',
  new mongoose.Schema({
    longDesc: {
      requires: [true, 'Long description is required'],
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
