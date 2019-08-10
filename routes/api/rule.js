import { Router } from 'express';
import Rule from '../../models/Rule';

const router = Router();

router.get('/', (req, res) => {
	res.send('rule get');
});

export default router;
