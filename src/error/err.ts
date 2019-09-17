import { NextFunction, Request, Response } from 'express';
import * as log from '../logging/log';
export default (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  log.error(err.message);
  res.status(500).json({
    message: 'An unknown error occured',
    success: false,
  });
};
