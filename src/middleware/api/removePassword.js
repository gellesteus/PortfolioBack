import mung from 'express-mung';
import * as log from '../../logging/logging';
/* Removes the password field */
export default mung.json((body, req, res) => {
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
