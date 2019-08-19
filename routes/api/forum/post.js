import { Router } from 'express';
import authorization from '../../../middleware/api/authorization';
import updateLastOnline from '../../../middleware/api/updateLastOnline';
import Post from '../../../models/Post';
import User from '../../../models/User';
import Topic from '../../../models/Topic';
import Category from '../../../models/Category';

const router = Router();
router.use('/', authorization);
router.use('/', updateLastOnline);

// @route   GET /forum/post
// @desc    Returns a short list of tpics
// @access  Protected
router.get('/', async (req, res) => {
	const user = await User.findOne({
		sessionToken: req.get('authorization'),
	}).catch(e =>
		res.status(500).json({
			success: false,
			message: e.message || 'An unknown error occured',
		})
	);
	const userID = req.query.user || user._id;
	const sortOrder = req.query.sortOrder || 1;
	const sortCol = req.query.sortCol || 'createdAt';
	const count = +req.query.count || 5;

	Topic.find({ poster: userID }, null, {
		limit: count,
		sort: { [sortCol]: sortOrder },
	})
		.then(posts => {
			res.json({
				success: true,
				message: 'Posts retrieved successfully',
				posts,
			});
		})
		.catch(e =>
			res.status(500).json({
				success: false,
				message: e.message || 'An unknown error occured',
			})
		);
});

// @route   POST /forum/post
// @desc    Create a new post
// @access  Private
router.post('/', async (req, res) => {
	/* Retrieve all needed models */
	try {
		var topic = await Topic.findOne({ _id: req.body.topic });
		var user = await User.findOne({ sessionToken: req.get('authorization') });
	} catch (e) {
		res
			.status(500)
			.json({ success: false, message: 'An unknown error has occured' });
	}
	new Post({
		userId: user._id,
		topicId: topic._id,
		category: topic.category,
		message: req.body.message,
	})
		.save()
		.then(post =>
			res.json({ success: true, message: 'Posted successfully', post })
		)
		.catch(e => {
			res
				.status(500)
				.json({ success: false, message: 'An unknown error has occured' });
		});
});

// @route   GET /forum/post/:id
// @desc    Retrieves the given post
// @access  Private
router.get('/:id', (req, res) => {
	Post.findOne({ _id: req.params.id })
		.then(post => {
			if (!post)
				res
					.status(403)
					.json({ sucess: false, message: 'Resource was not found' });
			res.json({ success: true, message: 'Post retrieved successfully', post });
		})
		.catch(e => {
			res
				.status(500)
				.json({ success: false, message: 'An unknown error occured' });
		});
});

// @route   DELETE /forum/post/:id
// @desc    Deletes the given post
// @access  Private
router.delete('/:id', async (req, res) => {
	const token = req.get('authorization');
	try {
		var user = await User.findOne({ sessionToken: token });
	} catch (e) {
		res
			.status(500)
			.json({ success: false, message: 'An unknown error has occured' });
	}
	Post.findByID(req.params.id)
		.then(async post => {
			/* Check validation. Can only be done by moderators of the category, admins and the user that made the post */
			try {
				var canDelete =
					user.role === 'admin' ||
					post.userId === user._id ||
					user._id in
						(await Category.findOne({ _id: post.category })).moderators;
			} catch (e) {
				res
					.status(500)
					.json({ success: false, message: 'An unknown error has occured' });
			}

			if (!canDelete) {
				res.status(403).json({
					success: false,
					message: 'You do not have authorization to perform this action',
				});
			} else {
				post
					.delete()
					.then(() => {
						res.json({ success: true, message: 'Post deleted successfully' });
					})
					.catch(e => {
						res.json({ success: false, message: 'An unknown error occured' });
					});
			}
		})
		.catch(e => {
			res.status(404).json({ success: false, message: 'Post does not exist' });
		});
});

// @route   PUT /forum/post/:id
// @desc    Edits the given post
// @access  Private
router.put('/:id', async (req, res) => {
	const token = req.get('authorization');
	try {
		var user = await User.findOne({ sessionToken: token });
	} catch (e) {
		res
			.status(500)
			.json({ success: false, message: 'An unknown error has occured' });
	}
	Post.findByID(req.params.id)
		.then(async post => {
			if (!post)
				res
					.status(403)
					.json({ sucess: false, message: 'Resource was not found' });
			/* Check validation. Can only be done by moderators of the category, admins and the user that made the post */

			const update = canUpdate => {
				if (canUpdate) {
					post.message = req.body.message || post.message;
					post.updatedAt = Date.now();
				} else {
					res.status(403).json({
						success: false,
						message: 'You do not have permission to do this',
					});
				}
			};

			try {
				var canUpdate =
					user.role === 'admin' ||
					post.userId === user._id ||
					user._id in
						(await Category.findOne({ _id: post.category })).moderators;
				update(canUpdate);
			} catch (e) {
				res
					.status(500)
					.json({ success: false, message: 'An unknown error has occured' });
			}
		})
		.catch(e => {
			res.status(404).json({ success: false, message: 'Post does not exist' });
		});
});
export default router;
