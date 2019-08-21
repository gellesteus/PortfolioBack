import mung from 'express-mung';
import moment from 'moment';

/* Add information about the API to all routes */
export default mung.json(function transform(body, req, res) {
	body.APIInfo = {
		APIVersion: process.env.API_VERSION,
		RequestTime: moment().format(),
	};
	return body;
});
