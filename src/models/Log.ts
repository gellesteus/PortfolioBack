import mongoose from 'mongoose';

export interface ILog extends mongoose.Document {
  created_at: Date;
  level: string;
  message: string;
}

export default mongoose.model<ILog>(
  'log',
  new mongoose.Schema({
    created_at: {
      default: Date.now,
      expires: 259200,
      type: Date
    },
    level: {
      default: 'info',
      enum: ['trace', 'debug', 'info', 'warn', 'error', 'fatal'],
      required: true,
      type: String
    },
    message: {
      type: String
    }
  })
);
