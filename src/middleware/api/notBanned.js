import * as log from '../../logging/logging';
import user from '../../models/User';

/* Middleware to prevent banned users from accessing the protected resource */
export default (req, res, next) => {
  const token = req.get('authorization');
  user
    .findOne({ sessionToken: token })
    .then(user => {
      if (user) {
        if (user.role != 'banned') {
          log.trace(
            'Request for access to resources for only non-banned users accepted'
          );
          next();
        } else {
          log.info('Banned user attempted to access restricted resource');
          res.status(403).json({
            success: false,
            message: 'You do not have permission to access this resource',
          });
        }
      } else {
        log.info('Banned user attempted to access restricted resource');
        res.status(403).json({
          success: false,
          message: 'You do not have permission to access this resource',
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
