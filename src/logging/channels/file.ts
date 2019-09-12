import * as fs from 'fs';
import moment from 'moment';
import * as os from 'os';

let logDir = `${__dirname}/log`;
/* Create the log directory if it does not exist */

/**
 * Logs a message to a file
 * @param {String} message The message to log
 */
export default (message: string, level: string): void => {
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  fs.appendFile(
    `${__dirname}/log/${moment().format('YYYYMMDD')}.log`,
    `${level.padEnd(5).toUpperCase()}: ${moment().format()} ${message} ${
      os.EOL
    }`,
    err => {
      if (err) {
        throw err;
      }
    }
  );
};

export const setLogDirectory = (dir: string): boolean => {
  /* Ensure that the directory can be accessed */
  if (fs.existsSync(dir)) {
    try {
      fs.accessSync(dir);
    } catch (e) {
      return false;
    }
  } else {
    /* Try to create the directory */
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch (e) {
      return false;
    }
  }
  /* Ensure that the directory is writeable */

  logDir = dir;
  return true;
};
