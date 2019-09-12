import { config } from 'dotenv';
import app from './app';
import csl from './logging/channels/console';
import file, { setLogDirectory } from './logging/channels/file';
import mongo from './logging/channels/mongo';
import slack from './logging/channels/slack';
import * as log from './logging/log';

config();
const logDir = process.env.LOG_DIRECTORY || `${__dirname}/log`;

setLogDirectory(logDir);

log.register(csl, process.env.CONSOLE_LEVEL || 'info');
log.register(mongo, process.env.DATABASE_LEVEL || 'info');
log.register(file, process.env.FILE_LEVEL || 'info');

const port: number = +(process.env.SERVER_PORT || 3001);

app.listen(port, () => {
  log.info(`Server listening on port ${port}`);
});
