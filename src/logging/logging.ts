import fs from 'fs';
import moment from 'moment';
import os from 'os';
import Log from '../models/Log';

/**
 * @param level  String   The text representation of a log level
 * @returns      Number   A numeric representation of a log level
 */
const getNumericLevel = (level: string): number => {
  switch (level) {
    case 'trace':
      return 0;
    case 'debug':
      return 1;
    case 'info':
      return 2;
    case 'warn':
      return 3;
    case 'error':
      return 4;
    case 'fatal':
      return 5;
    default:
      return 0;
  }
};

const dbLevel = getNumericLevel(process.env.LOG_DB_LEVEL || 'warn');
const fileLevel = getNumericLevel(process.env.LOG_FILE_LEVEL || 'info');
const consoleLevel = getNumericLevel(process.env.LOG_CONSOLE_LEVEL || 'warn');

/* Create the log directory if it does not exist */
if (!fs.existsSync(`${__dirname}/Log`)) {
  fs.mkdirSync(`${__dirname}/Log`);
}

export const trace = (message: string): void => {
  if (dbLevel <= 0) {
    new Log({ message, level: 'trace' }).save();
  }
  if (fileLevel <= 0) {
    const date = moment().format('YYYYMMDD');
    fs.appendFile(
      `${__dirname}/Log/${date}.log`,
      `TRACE: ${moment().format()} ${message} ${os.EOL}`,
      err => {
        if (err) {
          error(err.message);
        }
      }
    );
  }
  if (consoleLevel <= 0) {
    console.log(message);
  }
};
export const debug = (message: string): void => {
  if (dbLevel <= 1) {
    new Log({ message, level: 'debug' }).save();
  }
  if (fileLevel <= 1) {
    const date = moment().format('YYYYMMDD');
    fs.appendFile(
      `${__dirname}/Log/${date}.log`,
      `DEBUG: ${moment().format()} ${message} ${os.EOL}`,
      err => {
        if (err) {
          error(err.message);
        }
      }
    );
  }
  if (consoleLevel <= 1) {
    console.log(message);
  }
};

export const info = (message: string): void => {
  if (dbLevel <= 2) {
    new Log({ message, level: 'info' }).save();
  }

  if (fileLevel <= 2) {
    const date = moment().format('YYYYMMDD');
    fs.appendFile(
      `${__dirname}/Log/${date}.log`,
      `INFO : ${moment().format()} ${message} ${os.EOL}`,
      err => {
        if (err) {
          error(err.message);
        }
      }
    );
  }
  if (consoleLevel <= 2) {
    console.log(message);
  }
};

export const warn = (message: string): void => {
  if (dbLevel <= 3) {
    new Log({ message, level: 'warn' }).save();
  }
  if (fileLevel <= 3) {
    const date = moment().format('YYYYMMDD');
    fs.appendFile(
      `${__dirname}/Log/${date}.log`,
      `WARN : ${moment().format()} ${message} ${os.EOL}`,
      err => {
        if (err) {
          error(err.message);
        }
      }
    );
  }
  if (consoleLevel <= 3) {
    console.log(message);
  }
};

export const error = (message: string): void => {
  if (dbLevel <= 4) {
    new Log({ message, level: 'error' }).save();
  }
  if (fileLevel <= 4) {
    const date = moment().format('YYYYMMDD');
    fs.appendFile(
      `${__dirname}/Log/${date}.log`,
      `ERROR: ${moment().format()} ${message} ${os.EOL}`,
      err => {
        if (err) {
          error(err.message);
        }
      }
    );
  }
  if (consoleLevel <= 4) {
    console.log(message);
  }
};

export const fatal = (message: string): void => {
  if (dbLevel <= 5) {
    new Log({ message, level: 'fatal' }).save();
  }
  if (fileLevel <= 5) {
    const date = moment().format('YYYYMMDD');
    fs.appendFile(
      `${__dirname}/Log/${date}.log`,
      `FATAL: ${moment().format()} ${message} ${os.EOL}`,
      err => {
        if (err) {
          error(err.message);
        }
      }
    );
  }
  if (consoleLevel <= 5) {
    console.log(message);
  }
};
