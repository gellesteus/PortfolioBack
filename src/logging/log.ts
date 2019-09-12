const channels: IChannel[] = [];

/**
 *
 * Converts  a string representation of a log level to a number
 * Returns -1 if the string given is not a valid log lebel
 *
 * @param {String} level The level to convert to a number
 * @returns {Number} A numeric representation of the level
 */
const getNumericValue = (level: string): number => {
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
};
/**
 * Takes a level and builds the function to log at that level
 *
 * @param {String} level The level to log at
 * @returns {Function} A function that will log at the given level
 */
const log: (arg0: string) => (message: string) => void = (
  level: string
): ((arg0: string) => void) => {
  /**
   * Logs a message, respecting the rules set by the environment
   *
   * @params message String the message to log
   */
  return (message: string): void => {
    /* If a custom level is given, log it to all platforms by giving it max priority */
    const lNum = getNumericValue(level) !== -1 ? getNumericValue('level') : 9;
    for (const channel in channels) {
      if (channels[channel]) {
        if (channels[channel].level >= lNum) {
          channels[channel].write(message, level);
        }
      }
    }
  };
};

export interface IChannel {
  write: (arg0: string, arg1: string) => void;
  level: number;
}

/**
 * Logs a message at the trace level
 *
 * @param {String} message Message to log
 */
export const trace = (message: string): void => {
  log('trace')(message);
};
/**
 * Logs a message at the debug level
 *
 * @param {String} message Message to log
 */
export const debug = (message: string): void => {
  log('debug')(message);
};
/**
 * Logs a message at the info level
 *
 * @param {String} message Message to log
 */
export const info = (message: string): void => {
  log('info')(message);
};
/**
 * Logs a message at the warn level
 *
 * @param {String} message Message to log
 */
export const warn = (message: string): void => {
  log('warn')(message);
};
/**
 * Logs a message at the error level
 *
 * @param {String} message Message to log
 */
export const error = (message: string): void => {
  log('error')(message);
};
/**
 * Logs a message at the fatal level
 *
 * @param {String} message Message to log
 */
export const fatal = (message: string): void => {
  log('fatal')(message);
};
/**
 * Logs a message at a custom level.
 * This log will be written to all channels
 *
 * @param {String} message Message to log
 * @param {String} level the level to log at
 */
export const custom = (message: string, level: string) => {
  log(level)(message);
};
/**
 * Registers a channel for logging
 *
 * @param {IChannel} channel the channel to register
 * @param {String} level the minimum level required to write to this channel
 * @returns {Boolean} True if the channel was registered successfully
 */
export const register = (
  channel: (message: string, level: string) => void,
  level: string
): boolean => {
  const c: IChannel = {
    level: getNumericValue(level),
    write: channel,
  };
  try {
    c.write('Handler registered', 'INIT');
  } catch (e) {
    /* Handler could not register */
    return false;
  }
  channels.push(c);

  return true;
};
