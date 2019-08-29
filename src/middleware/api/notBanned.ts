import { Request, Response } from 'express';
import * as log from '../../logging/logging';
import User from '../../models/User';

/* Middleware to prevent banned users from accessing the protected resource */
export default (req: Request, res: Response, next: () => void): void => {
  const token: string = req.get('authorization') || '';
  User.findOne({ session_token: token })
    .then(user => {
      if (user) {
        if (user.role !== 'banned') {
          log.trace(
            'Request for access to resources for only non-banned users accepted'
          );
          next();
        } else {
          log.info('Banned user attempted to access restricted resource');
          res.status(403).json({
            message: 'You do not have permission to access this resource',
            success: false
          });
        }
      } else {
        log.info('Banned user attempted to access restricted resource');
        res.status(403).json({
          message: 'You do not have permission to access this resource',
          success: false
        });
      }
    })
    .catch(e => {
      log.error(e);
      res
        .status(500)
        .json({ success: false, message: 'An unknown error occured' });
    });
};
