import { Request, Response } from 'express';
import * as log from '../../logging/log';

export default (req: Request, res: Response, next: () => void): void => {
  if (!req.accepts('application.json')) {
    log.debug('Rejected request: could not accept json');
    res.status(406).json({
      message: 'Must accept JSON to receive data from this API',
      success: false,
    });
  } else {
    log.trace('Request accepts json');
    next();
  }
};
