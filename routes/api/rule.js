import { Router } from 'express';
import authorization from '../../middleware/api/authorization';
import updateLastOnline from '../../middleware/api/updateLastOnline';
import adminOnly from '../../middleware/api/adminOnly';
import Rule from '../../models/Rule';

const router = Router();

router.use('/', authorization);
router.use('/', updateLastOnline);

// @route   GET /rule
// @desc    Returns a list of all rules and their short descriptions
// @access  Private
router.get('/', async (req, res) => {
	/* Pagination is done on the server side */
	const count = parseInt(req.query.count || 10);
	const page = (req.query.page || 1) - 1;
	const toSkip = page * count;
	const totalDocs = await Rule.estimatedDocumentCount();
	const pages = totalDocs / count;
	const sortOrder = req.query.sortOrder || 1;
	const sortCol = req.query.sortColumn || '_id';
	Rule.find({}, 'name shortDesc _id', {
		skip: toSkip,
		limit: count,
		sort: { [sortCol]: sortOrder },
	})
		.then(rules => {
			res.json({
				success: true,
				page: page + 1,
				numberPerPage: count,
				pages,
				sortColumn: sortCol,
				ascending: sortOrder === 1,
				lastPage: page + 1 >= pages,
				message: 'Rules retrieved successfully',
				rules,
			});
		})
		.catch(e => {
			res
				.status(500)
				.json({ success: false, message: 'An unknown error occured' });
		});
});

// @route   GET /rule/:id
// @desc    Returns a single rule and its descriptions
// @access  Private
router.get('/:id', (req, res) => {
	Rule.findOne({ _id: req.params.id })
		.then(rule => {
			if (!rule)
				res
					.status(403)
					.json({ sucess: false, message: 'Resource was not found' });
			res.json({ success: true, message: 'Rule retrieved successfully', rule });
		})
		.catch(e => {
			res.status(400).json({ success: false, message: 'Invalid id' });
		});
});

router.use('/', adminOnly);

// @route   POST /rule
// @desc    Creates a new rule
// @access  Private
router.post('/', (req, res) => {
	new Rule({
		name: req.body.name,
		shortDesc: req.body.shortDesc,
		longDesc: req.body.longDesc,
	})
		.save()
		.then(rule => {
			res.json({ success: true, message: 'Rule created successfully', rule });
		})
		.catch(e => {
			console.log(e);
			res
				.status(500)
				.json({ success: false, message: 'An unknown error occured' });
		});
});

// @route   PUT /rule/:id
// @desc    Updates an existing rule
// @access  Private
router.put('/:id', (req, res) => {
	Rule.findOne({ _id: req.params.id })
		.then(rule => {
			if (!rule)
				res
					.status(403)
					.json({ sucess: false, message: 'Resource was not found' });
			rule.name = req.body.name || rule.name;
			rule.shortDesc = req.body.shortDesc || rule.shortDesc;
			rule.longDesc = req.body.longDesc || rule.longDesc;
			rule
				.save()
				.then(rule => {
					res.json({
						success: true,
						message: 'Rule updated successfully',
						rule,
					});
				})
				.catch(e => {
					res.status(500).json({
						success: false,
						message: e.message || 'An unknown error occured',
					});
				});
		})
		.catch(e => {
			res.status(400).json({ success: false, message: 'Rule not found' });
		});
});

// @route   DESTROY /rule/:id
// @desc    Removes the given rule
// @access  Private
router.delete('/:id', (req, res) => {
	Rule.findByIdAndDelete(req.params.id)
		.then(() => {
			res.json({ success: true, message: 'Rule deleted successfully' });
		})
		.catch(e => {
			res.status(400).json();
		});
});

export default router;
