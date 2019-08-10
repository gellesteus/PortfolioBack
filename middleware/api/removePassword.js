import mung from 'express-mung';

/* Removes the password field */
export default mung.json((body, req, res) => {
	if (body.user) {
		const user = body.user.toJSON();
		delete body.user;
		delete user.password;
		delete user.__v;
		body.user = user;
	}
	return body;
});
