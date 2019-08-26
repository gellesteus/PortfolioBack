import * as log from '../../logging/logging';
import User from '../../models/User';

export default async (req, res, next) => {
  const token = req.get('authorization');

  User.findOne({ sessionToken: token })
    .then(user => {
      if (user) {
        if (user.role == 'admin') {
          log.info('Admin only resource accessed successfully');
          next();
        } else {
          log.warn('Admin resource request access denied');
          res.status(403).json({
            success: false,
            message: 'You are not authorized to access this resource',
          });
        }
      } else {
        res.status(403).json({
          success: false,
          message: 'User not found',
        });
      }
    })
    .catch(e => {
      log.error(e);
      res.status(500).json({
        success: false,
        message: 'An unknown error has occurred',
      });
    });
};
