import mung from 'express-mung';
import moment from 'moment';
import * as log from '../../logging/logging';

/* Add information about the API to all routes */
export default mung.json(function transform(body, req, res) {
  log.trace('API information added to response body');
  body.APIInfo = {
    APIVersion: process.env.API_VERSION,
    RequestTime: moment().format(),
  };
  return body;
});
