import { Router } from 'express';
import authorization from '../../middleware/api/authorization';
import updateLastOnline from '../../middleware/api/updateLastOnline';
import Character from '../../models/Character';

const router = Router();

router.get('/', (req, res) => {
	res.send('character get');
});

/* Middleware for protected routes */
router.use('/', authorization);
router.use('/', updateLastOnline);

export default router;
