import { Request, Response } from 'express';
import * as log from '../../logging/log';
import User from '../../models/User';

/*  Update the last time a user was online */
export default (req: Request, res: Response, next: () => void): void => {
  /* Find the user from the token */
  const token = req.get('authorization') || '';
  User.findOne({
    session_token: token,
  })
    .then(user => {
      if (user) {
        log.info("Updating user's last online time");
        user.last_online = new Date();
        user.save().then(() => next());
      } else {
        log.warn('User was not found when updating last online');
        res.status(404).json({
          message: 'User not found',
          success: false,
        });
      }
    })
    .catch(e => {
      log.error(e);
      res.status(404).json({
        message: `Unknown error ${e}`,
        success: false,
      });
    });
};
