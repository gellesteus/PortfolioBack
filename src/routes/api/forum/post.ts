import { Router } from 'express';
import { Request, Response } from 'express';
import * as log from '../../../logging/logging';
import authorization from '../../../middleware/api/authorization';
import Cache from '../../../middleware/api/Cache';
import updateLastOnline from '../../../middleware/api/updateLastOnline';
import Category from '../../../models/Category';
import Post from '../../../models/Post';
import Topic, { ITopic } from '../../../models/Topic';
import User, { IUser } from '../../../models/User';

const router = Router();
router.use('/', authorization);
router.use('/', updateLastOnline);

// @route   GET /forum/post
// @desc    Returns a short list of tpics
// @access  Protected
router.get(
  '/',
  async (req: Request, res: Response): Promise<void> => {
    log.trace('GET /forum/post reached endpoint');
    let user: IUser;
    try {
      user = await User.findOne({
        session_token: req.get('authorization')
      });
    } catch (e) {
      log.error(e.message);
      res.status(500).json({
        message: 'An unknown error occured',
        success: false
      });
    }
    const userID = req.query.user || user._id;
    const sortOrder = req.query.sortOrder || 1;
    const sortCol = req.query.sortCol || 'created_at';
    const count = +req.query.count || 5;

    Topic.find({ poster: userID }, null, {
      limit: count,
      sort: { [sortCol]: sortOrder }
    })
      .then(posts => {
        res.json({
          message: 'Posts retrieved successfully',
          posts,
          success: true
        });
      })
      .catch((e: Error) => {
        log.error(e.message);
        res.status(500).json({
          message: e.message || 'An unknown error occured',
          success: false
        });
      });
  }
);

// @route   POST /forum/post
// @desc    Create a new post
// @access  Private
router.post(
  '/',
  async (req: Request, res: Response): Promise<void> => {
    log.trace('POST /forum/post reached endpoint');
    /* Pull in all relevant data points */
    let topic: ITopic;
    let user: IUser;
    try {
      topic = await Topic.findById(req.body.topic);
      user = await User.findOne({ session_token: req.get('authorization') });
    } catch (e) {
      log.error(e.message);
      res
        .status(500)
        .json({ success: false, message: 'An unknown error has occured' });
    }
    new Post({
      category: topic.category,
      message: req.body.message,
      topicId: topic._id,
      userId: user._id
    })
      .save()
      .then(post =>
        res.json({ success: true, message: 'Posted successfully', post })
      )
      .catch(e => {
        log.error(e);
        res
          .status(500)
          .json({ success: false, message: 'An unknown error has occured' });
      });
  }
);

// @route   GET /forum/post/:id
// @desc    Retrieves the given post
// @access  Private
router.get('/:id', Cache.retrieve, (req: Request, res: Response): void => {
  log.trace(`GET /forum/post/${req.params.id} reached endpoint`);
  Post.findOne({ _id: req.params.id })
    .then(post => {
      if (!post) {
        res.status(403).json({
          message: 'Resource was not found',
          sucess: false
        });
        return;
      }

      Cache.cache(60)(req, res, {
        message: 'Post retrieved successfully',
        post,
        success: true
      });
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
router.delete(
  '/:id',
  async (req: Request, res: Response): Promise<void> => {
    log.trace(`DELETE /forum/post/${req.params.id} reached endpoint`);
    const token = req.get('authorization');
    let user: IUser;
    try {
      user = await User.findOne({ session_token: token });
    } catch (e) {
      res
        .status(500)
        .json({ success: false, message: 'An unknown error has occured' });
    }
    Post.findById(req.params.id)
      .then(async post => {
        let canDelete: boolean;
        /* Check validation. Can only be done by moderators of the category, admins and the user that made the post */
        try {
          canDelete =
            user.role === 'admin' ||
            post.poster === user._id ||
            user._id in (await Category.findById(post.category)).moderators;
        } catch (e) {
          res
            .status(500)
            .json({ success: false, message: 'An unknown error has occured' });
        }

        if (!canDelete) {
          res.status(403).json({
            message: 'You do not have authorization to perform this action',
            success: false
          });
        } else {
          Post.findByIdAndDelete(req.params.id)
            .then(() => {
              res.json({
                message: 'Post deleted successfully',
                success: true
              });
            })
            .catch((e: Error) => {
              res.status(500).json({
                message: 'An unknown error occured',
                success: false
              });
            });
        }
      })
      .catch((e: Error) => {
        res.status(404).json({
          message: 'Post does not exist',
          success: false
        });
      });
  }
);

// @route   PUT /forum/post/:id
// @desc    Edits the given post
// @access  Private
router.put(
  '/:id',
  async (req: Request, res: Response): Promise<void> => {
    log.trace(`PUT /forum/post/${req.params.id} reached endpoint`);
    const token = req.get('authorization');
    let user: IUser;
    try {
      user = await User.findOne({ session_token: token });
    } catch (e) {
      res.status(500).json({
        message: 'An unknown error has occured',
        success: false
      });
      return;
    }
    Post.findById(req.params.id)
      .then(async post => {
        if (!post) {
          res
            .status(403)
            .json({ sucess: false, message: 'Resource was not found' });
          return;
        }
        /* Check validation. Can only be done by moderators of the category, admins and the user that made the post */

        const update = (canUpdate: boolean): void => {
          if (canUpdate) {
            post.body = req.body.message || post.body;
            post.updated_at = new Date();
          } else {
            res.status(403).json({
              message: 'You do not have permission to do this',
              success: false
            });
          }
        };

        try {
          const canUpdate: boolean =
            user.role === 'admin' ||
            post.poster === user._id ||
            user._id in
              (await Category.findOne({ _id: post.category })).moderators;
          update(canUpdate);
        } catch (e) {
          res.status(500).json({
            message: 'An unknown error has occured',
            success: false
          });
        }
      })
      .catch((e: Error) => {
        res.status(404).json({
          message: 'Post does not exist',
          success: false
        });
      });
  }
);
export default router;
