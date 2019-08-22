import mongoose from 'mongoose';

export default mongoose.model(
  'csrf',
  new mongoose.Schema({
    value: {
      type: String,
      required: [true, 'The CSRF token value is required'],
    },
    date: {
      type: Date,
      default: Date.now,
    },
  })
);
