import CSRF from '../models/CSRF';
import moment from 'moment';
export default async () => {
  console.log('Pruning old CSRF tokens');
  const date = moment().subtract(12, 'hours');
  CSRF.find({ created_at: { $lt: date } }).remove();
};
