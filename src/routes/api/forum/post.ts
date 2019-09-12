import { Router } from 'express';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import * as log from '../../../logging/log';
import authorization from '../../../middleware/api/authorization';
import Cache from '../../../middleware/api/Cache';
import updateLastOnline from '../../../middleware/api/updateLastOnline';
import Category, { ICategory } from '../../../models/Category';
import Post from '../../../models/Post';
import Topic, { ITopic } from '../../../models/Topic';
import User, { IUser } from '../../../models/User';

const router = Router();
router.use('/', authorization);
router.use('/', updateLastOnline);

const userIsMod = async (
  user: IUser,
  cat: string | mongoose.Schema.Types.ObjectId
): Promise<boolean> => {
  return Category.findById(cat)
    .then(c => {
      if (c) {
        return user._id in c.moderators;
      } else {
        return false;
      }
    })
    .catch((e: Error) => {
      log.error(e.message);
      return false;
    });
};

// @route   GET /forum/post
// @desc    Returns a short list of tpics
// @access  Protected
router.get(
  '/',
  async (req: Request, res: Response): Promise<void> => {
    log.trace('GET /forum/post reached endpoint');
    let user: IUser | undefined;
    try {
      user = await User.findOne({
        session_token: req.get('authorization'),
      }).then(u => {
        if (u) {
          return u;
        } else {
          res.status(404).json({
            message: 'The requested resource was not found on the server',
            success: false,
          });
        }
      });
    } catch (e) {
      log.error(e.message);
      res.status(500).json({
        message: 'An unknown error occured',
        success: false,
      });
    }
    if (user) {
      const userID = req.query.user || user._id;
      const sortOrder = req.query.sortOrder || 1;
      const sortCol = req.query.sortCol || 'created_at';
      const count = +req.query.count || 5;

      Post.find({ poster: userID }, null, {
        limit: count,
        sort: { [sortCol]: sortOrder },
      })
        .then(posts => {
          res.json({
            message: 'Posts retrieved successfully',
            posts,
            success: true,
          });
        })
        .catch((e: Error) => {
          log.error(e.message);
          res.status(500).json({
            message: e.message || 'An unknown error occured',
            success: false,
          });
        });
    }
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

    const tempUser = await User.findOne({
      session_token: req.get('authorization'),
    });

    if (!tempUser) {
      res.status(404).json({
        message: 'The requested resource was not found on the server',
        success: false,
      });
      return;
    } else {
      user = tempUser;
    }

    const tempTopic = await Topic.findById(req.body.topic);

    if (!tempTopic) {
      res.status(404).json({
        message: 'The requested resource was not found on the server',
        success: false,
      });
      return;
    } else {
      topic = tempTopic;
    }

    Topic.findById(req.body.topic);

    new Post({
      category: topic.category,
      message: req.body.message,
      poster: user._id,
      topicId: topic._id,
    })
      .save()
      .then(post =>
        res.json({
          message: 'Posted successfully',
          post,
          success: true,
        })
      )
      .catch(e => {
        log.error(e);
        res.status(500).json({
          message: 'An unknown error has occured',
          success: false,
        });
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
          sucess: false,
        });
      } else {
        Cache.cache(60)(req, res, {
          message: 'Post retrieved successfully',
          post,
          success: true,
        });
      }
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

    User.findOne({ session_token: token })
      .then(u => {
        if (u) {
          user = u;
        } else {
          res.status(404).json({
            message: 'The requested resource was not found on the server',
            success: false,
          });
        }
      })
      .catch((e: Error) => {
        log.error(e.message);
        res
          .status(500)
          .json({ message: 'An unknown error occured', success: false });
      });

    Post.findById(req.params.id)
      .then(async post => {
        let canDelete: boolean;
        /* Check validation. Can only be done by moderators of the category, admins and the user that made the post */
        if (post) {
          canDelete =
            user.role === 'admin' ||
            post.poster === user._id ||
            (await userIsMod(user, post.category));

          if (!canDelete) {
            res.status(403).json({
              message: 'You do not have authorization to perform this action',
              success: false,
            });
          } else {
            Post.findByIdAndDelete(req.params.id)
              .then(() => {
                res.json({
                  message: 'Post deleted successfully',
                  success: true,
                });
              })
              .catch((e: Error) => {
                res.status(500).json({
                  message: 'An unknown error occured',
                  success: false,
                });
              });
          }
        }
      })
      .catch((e: Error) => {
        res.status(404).json({
          message: 'Post does not exist',
          success: false,
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

    User.findOne({ session_token: token })
      .then(u => {
        if (u) {
          user = u;
        } else {
          res.status(404).json({
            message: 'The requested resource was not found on the server',
            success: false,
          });
        }
      })
      .catch((e: Error) => {
        log.error(e.message);
        res
          .status(500)
          .json({ message: 'An unknown error occured', success: false });
      });

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
              success: false,
            });
          }
        };

        try {
          const canUpdate: boolean =
            user.role === 'admin' ||
            post.poster === user._id ||
            (await userIsMod(user, post.category));
          update(canUpdate);
        } catch (e) {
          res.status(500).json({
            message: 'An unknown error has occured',
            success: false,
          });
        }
      })
      .catch((e: Error) => {
        res.status(404).json({
          message: 'Post does not exist',
          success: false,
        });
      });
  }
);
export default router;
