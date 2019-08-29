import * as log from '../../logging/logging';

export default (req, res, next) => {
  if (!req.accepts('application.json')) {
    log.debug('Rejected request: could not accept json');
    res.status(406).json({
      success: false,
      message: 'Must accept JSON to receive data from this API',
    });
  } else {
    log.trace('Request accepts json');
    next();
  }
};
