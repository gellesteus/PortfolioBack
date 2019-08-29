import User from '../../models/User';
import * as log from '../../logging/logging';

/* Routes protected by this middleware require a valid session token to access */
export default (req, res, next) => {
  if (!req.get('authorization')) {
    log.warn('Request rejected due to missing authorization');
    res.status(403).json({
      success: false,
      message: 'This operation requires a valid token',
    });
  } else {
    /* Token is present */
    const token = req.get('authorization');
    User.findOne({
      sessionToken: token,
    })
      .then(user => {
        if (user) {
          log.debug('Valid authorization token sent');
          next();
        } else {
          log.warn('Request rejected due to invalid session token');
          res.status(403).json({
            success: false,
            message: 'Invalid token sent',
          });
        }
      })
      .catch(e => {
        log.error(e);
        res.status(403).json({
          success: false,
          message: 'An unknown error occurred',
        });
      });
  }
};
