import User from '../models/User';
import moment from 'moment';
import * as log from '../logging/logging';

export default async () => {
  log.info('Pruning old session tokens');
  const date = moment().sub(24, 'hours');
  const users = await User.find({ lastOnline: { $lt: date } }).exec();
  for (var user in users) {
    users[user].sessionToken = null;
    await users[user].save();
  }
};
