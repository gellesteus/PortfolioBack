import { Request, Response } from 'express';
import * as log from '../../logging/logging';
import User from '../../models/User';

export default async (
  req: Request,
  res: Response,
  next: () => void
): Promise<void> => {
  const token: string = req.get('authorization') || '';

  User.findOne({ session_token: token })
    .then(user => {
      if (user) {
        if (user.role === 'admin') {
          log.info('Admin only resource accessed successfully');
          next();
        } else {
          log.warn('Admin resource request access denied');
          res.status(403).json({
            message: 'You are not authorized to access this resource',
            success: false
          });
        }
      } else {
        res.status(403).json({
          message: 'User not found',
          success: false
        });
      }
    })
    .catch(e => {
      log.error(e);
      res.status(500).json({
        message: 'An unknown error has occurred',
        success: false
      });
    });
};
