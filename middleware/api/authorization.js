import User from '../../models/User';

/* Routes protected by this middleware require a valid session token to access */
export default (req, res, next) => {
	if (!req.get('authorization')) {
		res.status(403).json({
			success: false,
			message: 'This operation requires a valid token',
		});
	} else {
		/* TODO: some sort of token manipulation */
		/* Token is present */
		const token = req.get('authorization');
		User.findFirst({
			sessionToken: token,
		})
			.then(user => {
				if (user) {
					next();
				} else {
					res.status(403).json({
						success: false,
						message: 'Invalid token sent',
					});
				}
			})
			.catch(e =>
				res.status(403).json({
					success: false,
					message: 'An unknown error occurred',
				})
			);
	}
};
