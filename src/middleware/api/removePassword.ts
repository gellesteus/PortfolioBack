import { Request, Response } from 'express';
import mung from 'express-mung';
import * as log from '../../logging/log';

/* Removes the password field */
export default mung.json((body: any, req: Request, res: Response): any => {
  if (body.user) {
    log.debug('Ensuring that password is removed from response body');
    const user = body.user.toJSON();
    delete body.user;
    delete user.password;
    delete user.__v;
    body.user = user;
  }
  return body;
});
