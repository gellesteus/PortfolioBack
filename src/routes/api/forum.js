import { Router } from 'express';
import CategoryRouter from './forum/category';
import PostRouter from './forum/post';
import TopicRouter from './forum/topic';

const router = Router();

router.use('/post', PostRouter);
router.use('/category', CategoryRouter);
router.use('/topic', TopicRouter);

export default router;
