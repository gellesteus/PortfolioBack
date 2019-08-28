import * as log from '../../logging/logging';

export default (req, res, next) => {
  log.info(
    `Headers :${JSON.stringify(req.headers)} Target: ${
      req.originalUrl
    } Method: ${req.method} IP: ${req.ip}`
  );
  next();
};
