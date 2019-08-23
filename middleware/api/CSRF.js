import CSRF from '../../models/CSRF';
import * as log from '../../logging/logging';

export default async (req, res, next) => {
  if (req.method !== 'GET') {
    const token = req.get('CSRF');
    const validToken = await CSRF.findOne({ value: token });

    if (!validToken) {
      log.warn('Request rejected due to invalid token');
      res.status(400).json({ success: false, message: 'Invalid CSRF token' });
    } else {
      log.trace('Request sent valid CSRF token');
      next();
    }
  } else {
    /* Get requests are not protected by CSRF middleware */
    next();
  }
};
