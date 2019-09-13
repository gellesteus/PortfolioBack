import { config } from 'dotenv';
import mongoose from 'mongoose';
import app from './app';
import csl from './logging/channels/console';
import file, { setLogDirectory } from './logging/channels/file';
import mongo from './logging/channels/mongo';
import slack from './logging/channels/slack';
import * as log from './logging/log';
config();
const logDir = process.env.LOG_DIRECTORY || `${__dirname}/log`;

setLogDirectory(logDir);

/* Connect to the database */
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URI}`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => log.info('Connected to database'))
  .catch((e: Error) => log.error(e.message));

log.trace('Preventing mongoose deprecation warnings');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

log.register(csl, process.env.CONSOLE_LEVEL || 'info');
log.register(mongo, process.env.DATABASE_LEVEL || 'info');
log.register(file, process.env.FILE_LEVEL || 'info');

const port: number = +(process.env.SERVER_PORT || 3001);

app.listen(port, () => {
  log.info(`Server listening on port ${port}`);
});
