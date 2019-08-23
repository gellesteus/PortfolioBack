import User from '../../models/User';
import * as log from '../../logging/logging';
/*  Update the last time a user was online */
export default (req, res, next) => {
  /* Find the user from the token */
  const token = req.get('authorization');
  User.findOne({
    sessionToken: token,
  })
    .then(user => {
      if (user) {
        log.info("Updating user's last online time");
        user.lastOnline = +Date.now();
        user.save().then(next());
      } else {
        log.warn('User was not found when updating last online');
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }
    })
    .catch(e => {
      log.error(e);
      res.status(404).json({
        success: false,
        message: `Unknown error ${e}`,
      });
    });
};
