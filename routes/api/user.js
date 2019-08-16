import { Router } from 'express';
import User from '../../models/User';
import authorization from '../../middleware/api/authorization';
import updateLastOnline from '../../middleware/api/updateLastOnline';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const router = Router();

// @route   POST /user/login
// @desc    Logs a user in if the credentials are correct
// @access  Public
router.post('/login', (req, res) => {
	/* Check the credentials */
	const { email, password } = req.body;
	if (!email || !password) {
		res.status(400).json({
			success: false,
			message: 'Please enter your email and password',
		});
	} else {
		User.findOne({ email: email })
			.then(user => {
				if (user) {
					bcrypt.compare(password, user.password).then(same => {
						if (same) {
							const token = crypto.randomBytes(32).toString('hex');
							/* Update the token and last online values */
							user.sessionToken = token;
							user.lastOnline = Date.now();
							user.save().then(() =>
								/* Send the response */
								res.json({
									success: true,
									message: 'User logged in successfully',
									user,
								})
							);
						} else {
							res.status(403).json({
								success: false,
								message: 'Invalid username or password',
							});
						}
					});
				} else {
					res.status(403).json({
						success: false,
						message: 'Invalid username or password',
					});
				}
			})
			.catch(e =>
				res.status(403).json({
					success: false,
					message: 'Invalid username or password',
				})
			);
	}
});

// @route   POST /user
// @desc    Create a user
// @access  Public
router.post('/', async (req, res) => {
	const salt = await bcrypt.genSalt(10);
	const pass = await bcrypt.hash(req.body.password, salt);
	new User({
		username: req.body.username,
		email: req.body.email,
		password: pass,
		lastOnline: Date.now(),
	})
		.save()
		.then(user =>
			res.json({
				success: true,
				message: 'User created successfully',
				user,
			})
		)
		.catch(e =>
			res.status(500).json({
				success: false,
				message: e.message || 'an unknown error occured',
			})
		);
});

// @route   POST /pass
// @desc    Request a password reset
// @access  Public
router.post('/pass', (req, res) => {
	User.findOne({ email: req.body.email })
		.then(user => {
			/* Generate the new password */
			const password = crypto.randomBytes(6).toString('hex');
			bcrypt.genSalt(10, (err, res) =>
				bcrypt.hash(password, res, (err, res) => {
					user.password = password;
					user.sessionToken = null;
					user.mustChangePassword = true;
					user.save().then(() =>
						res.json({
							success: true,
							message: 'Password reset request accepted',
						})
					);
				})
			);
			/* Send the email with the password to the user */
			/* Update the requirement to change the password on the next login */
		})
		.catch(e =>
			res.json({
				success: false,
				message: 'Username not found',
			})
		);
});

/* Middleware for protected routes */
router.use('/', authorization);
router.use('/', updateLastOnline);

// @route   UPDATE /user
// @desc    Update a user's password
// @access  Private
router.put('/pass', async (req, res) => {
	const token = req.get('authorization');
	const salt = await bcrypt.genSalt(10);
	const pass = await bcrypt.hash(req.body.password, salt);
	User.findOne({
		sessionToken: token,
	}).then(user => {
		if (user) {
			user.password = pass;
			/* Invalidate the user's session token */
			user.sessionToken = null;
			user.mustChangePassword = false;
			user.save().then(user =>
				res.send({
					success: true,
					message: 'Password updated successfully',
					user,
				})
			);
		} else {
			res.status(404).json({
				success: false,
				message: 'User not found',
			});
		}
	});
});

// @route   POST /user/logout
// @desc    Logs a user in if the credentials are correct
// @access  Private
router.post('/logout', (req, res) => {
	const token = req.get('authorization');
	User.findOne({ sessionToken: token })
		.then(user => {
			if (user) {
				user.sessionToken = null;
				user.save();
				res.json({ success: true, message: 'User logged out successfully' });
			} else {
				res.status(403).json({ success: false, message: 'User not found' });
			}
		})
		.catch(e =>
			res
				.status(500)
				.json({ success: false, message: 'An unknown error occured' })
		);
});

// @route 	GET /user
// @desc 	Retrieves all information about a user
// @access 	Private
router.get('/', (req, res) => {
	const token = req.get('authorization');
	User.findOne({ sessionToken: token }).then(user => {
		if (user) {
			res.json({ success: true, message: 'user retrieved successfully', user });
		} else {
			res.status(404).json({ success: false, message: 'User not found' });
		}
	});
});

export default router;
