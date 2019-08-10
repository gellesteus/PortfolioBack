import { Router } from 'express';
import authorization from '../../middleware/api/authorization';
import updateLastOnline from '../../middleware/api/updateLastOnline';
import Organizations from '../../models/Organization';

const router = Router();

router.get('/', (req, res) => {
	res.send('organization get');
});

export default router;
