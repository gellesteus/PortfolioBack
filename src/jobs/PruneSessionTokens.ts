import moment from 'moment';
import User from '../models/User';

import * as log from '../logging/logging';

export default async (): Promise<void> => {
  log.info('Pruning old session tokens');
  const date = moment().subtract(24, 'hours');
  const users = await User.find({ last_online: { $lt: date } }).exec();
  for (const user in users) {
    if (users[user]) {
      users[user].session_token = null;
      await users[user].save();
    }
  }
};
