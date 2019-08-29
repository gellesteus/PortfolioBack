import { Request, Response } from 'express';
import * as log from '../../logging/logging';
import User from '../../models/User';

/* Routes protected by this middleware require a valid session token to access */
export default (req: Request, res: Response, next: () => void): void => {
  if (!req.get('authorization')) {
    log.warn('Request rejected due to missing authorization');
    res.status(403).json({
      message: 'This operation requires a valid token',
      success: false
    });
  } else {
    /* Token is present */
    const token: string = req.get('authorization') || '';
    User.findOne({
      session_token: token
    })
      .then(user => {
        if (user) {
          log.debug('Valid authorization token sent');
          next();
        } else {
          log.warn('Request rejected due to invalid session token');
          res.status(403).json({
            message: 'Invalid token sent',
            success: false
          });
        }
      })
      .catch(e => {
        log.error(e);
        res.status(500).json({
          message: 'An unknown error occurred',
          success: false
        });
      });
  }
};
