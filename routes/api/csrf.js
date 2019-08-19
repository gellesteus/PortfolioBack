import { Router } from 'express';
import crypto from 'crypto';
import CSRF from '../../models/CSRF';
const router = Router();

/* Gets a CSRF token for a given page */
router.get('/', async (req, res) => {
	const value = crypto.randomBytes(32).toString('hex');
	await new CSRF({
		value,
	})
		.save()
		.catch(e =>
			res
				.status(500)
				.json({ success: false, message: 'An unknown error occured' })
		);
	res.json({ success: true, message: 'CSRF token retrieved', token: value });
});

/* Forcibly invalidate a token */
router.delete('/:token', (req, res) => {});

export default router;
