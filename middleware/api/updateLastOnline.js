import User from '../../models/User';

/*  Update the last time a user was online */
export default (req, res, next) => {
	/* Find the user from the token */
	const token = req.get('authorization');
	User.findOne({
		sessionToken: token,
	})
		.then(user => {
			if (user) {
				user.lastOnline = +Date.now();
				user.save().then(next());
			} else {
				res.status(404).json({
					success: false,
					message: 'User not found',
				});
			}
		})
		.catch(e =>
			res.status(404).json({
				success: false,
				message: `Unknown error ${e}`,
			})
		);
};
