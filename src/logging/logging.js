import Log from '../models/Log';
import moment from 'moment';
import fs from 'fs';
import os from 'os';
const dbLevel = getNumericLevel(process.env.LOG_DB_LEVEL || 'warn');
const fileLevel = getNumericLevel(process.env.LOG_FILE_LEVEL || 'info');
const consoleLevel = getNumericLevel(process.env.LOG_CONSOLE_LEVEL || 'warn');

function getNumericLevel(level) {
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
      return -1;
  }
}
if (!fs.accessSync(`${__dirname}/Log`)) {
  fs.mkdir(`${__dirname}/Log`, { recursive: true }, err => {
    if (err) {
      if (err.code !== 'EEXIST') {
        error(err);
      }
    }
  });
}
export const trace = message => {
  if (dbLevel <= 0) {
    new Log({ message, level: 'trace' }).save();
  }
  if (fileLevel <= 0) {
    const date = moment().format('YYYYMMDD');
    fs.appendFile(
      `${__dirname}/Log/${date}.log`,
      `TRACE: ${moment()} ${message} ${os.EOL}`,
      err => {
        if (err) {
          error(err);
        }
      }
    );
  }
  if (consoleLevel <= 0) {
    console.log(message);
  }
};
export const debug = message => {
  if (dbLevel <= 1) {
    new Log({ message, level: 'debug' }).save();
  }
  if (fileLevel <= 1) {
    const date = moment().format('YYYYMMDD');
    fs.appendFile(
      `${__dirname}/Log/${date}.log`,
      `DEBUG: ${moment()} ${message} ${os.EOL}`,
      err => {
        if (err) {
          error(err);
        }
      }
    );
  }
  if (consoleLevel <= 1) {
    console.log(message);
  }
};

export const info = message => {
  if (dbLevel <= 2) {
    new Log({ message, level: 'info' }).save();
  }

  if (fileLevel <= 2) {
    const date = moment().format('YYYYMMDD');
    fs.appendFile(
      `${__dirname}/Log/${date}.log`,
      `INFO : ${moment()} ${message} ${os.EOL}`,
      err => {
        if (err) {
          error(err);
        }
      }
    );
  }
  if (consoleLevel <= 2) {
    console.log(message);
  }
};

export const warn = message => {
  if (dbLevel <= 3) {
    new Log({ message, level: 'warn' }).save();
  }
  if (fileLevel <= 3) {
    const date = moment().format('YYYYMMDD');
    fs.appendFile(
      `${__dirname}/Log/${date}.log`,
      `WARN : ${moment()} ${message} ${os.EOL}`,
      err => {
        if (err) {
          error(err);
        }
      }
    );
  }
  if (consoleLevel <= 3) {
    console.log(message);
  }
};

export const error = message => {
  if (dbLevel <= 4) {
    new Log({ message, level: 'error' }).save();
  }
  if (fileLevel <= 4) {
    const date = moment().format('YYYYMMDD');
    fs.appendFile(
      `${__dirname}/Log/${date}.log`,
      `ERROR: ${moment()} ${message} ${os.EOL}`,
      err => {
        if (err) {
          error(err);
        }
      }
    );
  }
  if (consoleLevel <= 4) {
    console.log(message);
  }
};

export const fatal = message => {
  if (dbLevel <= 5) {
    new Log({ message, level: 'fatal' }).save();
  }
  if (fileLevel <= 5) {
    const date = moment().format('YYYYMMDD');
    fs.appendFile(
      `${__dirname}/Log/${date}.log`,
      `FATAL: ${moment()} ${message} ${os.EOL}`,
      err => {
        if (err) {
          error(err);
        }
      }
    );
  }
  if (consoleLevel <= 5) {
    console.log(message);
  }
};
