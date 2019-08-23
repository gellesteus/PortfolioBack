import mongoose from 'mongoose';

export default mongoose.model(
  'log',
  mongoose.Schema({
    created_at: {
      type: Date,
      default: Date.now,
      expires: 259200,
    },
    message: {
      type: String,
    },
    level: {
      type: String,
      enum: ['trace', 'debug', 'info', 'warn', 'error', 'fatal'],
      required: true,
      default: 'info',
    },
  })
);
