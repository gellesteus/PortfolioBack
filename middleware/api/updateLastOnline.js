import User from '../../models/User';

/*  Update the last time a user was online */
export default (req, res, next) => {
	/* Find the user from the token */
	const token = req.get('authorization');
	User.findFirst({
		sessionToken: token,
	})
		.then(user => {
			user = {
				...user,
				lastOnline: Date.now,
			};
			user.save().then(next());
		})
		.catch(e =>
			res.status(404).json({
				success: false,
				message: 'User not found',
			})
		);
};
