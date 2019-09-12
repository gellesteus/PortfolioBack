import mongoose from 'mongoose';
import mongo from '../../db/mongo';

mongo();

interface ILog extends mongoose.Document {
  createdAt: Date;
  level: string;
  message: string;
}

const maxTime: number = +(process.env.MAX_MONGO_LOG_TIME || 259200);

const logSchema = new mongoose.Schema({
  createdAt: {
    default: Date.now,
    expires: maxTime,
    type: Date,
  },
  level: {
    required: true,
    type: String,
  },
  message: {
    required: true,
    type: String,
  },
});

const Log = mongoose.model<ILog>('log', logSchema);

export default (message: string, level: string): void => {
  new Log({
    level,
    message,
  })
    .save()
    .catch((e: Error) => {
      throw e;
    });
};
