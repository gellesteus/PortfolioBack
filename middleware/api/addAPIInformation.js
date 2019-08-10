import mung from 'express-mung';
import moment from 'moment';

export default mung.json((body, req, res) => {
	body.APIInfo = {
		APIVersion: process.env.API_VERSION,
		time: moment().format(),
	};
	return body;
});
