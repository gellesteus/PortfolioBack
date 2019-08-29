import CSRF from '../models/CSRF';
import moment from 'moment';
import * as log from '../logging/logging';
export default async () => {
  log.info('Pruning old CSRF tokens');
  const date = moment().subtract(12, 'hours');
  CSRF.find({ created_at: { $lt: date } }).remove();
};
