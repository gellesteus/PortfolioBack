import User from '../../models/User';
import * as log from '../../logging/logging';

/* Middleware to prevent banned users from accessing the protected resource */
export default (req, res, next) => {
  const token = req.get('authorization');
  User.findOne({ sessionToken: token })
    .then(user => {
      if (user) {
        if (user.validated) {
          log.trace('Resource requiring validation accessed successfully');
          next();
        } else {
          log.info(
            'Access to resource denied to user due to having an unvalidated account'
          );
          res.status(403).json({
            success: false,
            message:
              'Accounts that have not been validated cannot perform this action',
          });
        }
      } else {
        log.info(
          'Access to resource denied to user due to having an unvalidated account'
        );
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
