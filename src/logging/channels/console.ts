import moment from 'moment';

export default (message: string, level: string): void => {
  console.log(
    `${level.padEnd(5).toUpperCase()}: ${moment().format()} ${message}`
  );
};
