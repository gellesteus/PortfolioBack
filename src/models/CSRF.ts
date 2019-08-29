import mongoose from 'mongoose';

export interface ICSRF extends mongoose.Document {
  date: Date;
  value: string;
}

export default mongoose.model<ICSRF>(
  'csrf',
  new mongoose.Schema({
    date: {
      default: Date.now,
      expires: 43200 /* 6 hours */,
      type: Date
    },
    value: {
      required: [true, 'The CSRF token value is required'],
      type: String
    }
  })
);
