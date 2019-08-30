import { Router } from 'express';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
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

// @route   GET /forum/topic
// @desc    Returns a short list of topics
// @access  Protected
router.get(
  '/',
  async (req: Request, res: Response): Promise<void> => {
    log.trace('GET /forum/topic reached endpoint');

    let user: IUser;

    const temp = await User.findOne({
      session_token: req.get('authorization')
    });

    if (temp) {
      user = temp;
    } else {
      res.status(404).json({
        message: 'The requested resource was not found on the server',
        success: false
      });
      return;
    }

    const userID = req.query.user || user._id;
    const sortOrder = req.query.sortOrder || 1;
    const sortCol = req.query.sortCol || 'created_at';
    const count = +req.query.count || 5;

    Topic.find({ poster: userID }, null, {
      limit: count,
      sort: { [sortCol]: sortOrder }
    })
      .then(topics => {
        res.json({
          message: 'Topics retrieved successfully',
          success: true,
          topics
        });
      })
      .catch((e: Error) =>
        res.status(500).json({
          message: e.message || 'An unknown error occured',
          success: false
        })
      );
  }
);

// @route   POST /forum/topic
// @desc    Create a new topic
// @access  Private
router.post(
  '/',
  async (req: Request, res: Response): Promise<void> => {
    log.trace('POST /forum/topic reached endpoint');

    let user: IUser;

    const temp = await User.findOne({
      session_token: req.get('authorization')
    });

    if (temp) {
      user = temp;
    } else {
      res.status(404).json({
        message: 'The requested resource was not found on the server',
        success: false
      });
      return;
    }

    new Topic({
      category: req.body.category,
      title: req.body.title
    })
      .save()
      .then(topic => {
        /* Create the body */
        new Post({
          body: req.body.body,
          category: topic.category,
          poster: user._id,
          topic: topic._id
        })
          .save()
          .then(post => {
            topic.body = post._id;
            topic
              .save()
              .then(newTopic =>
                res.json({
                  messaage: 'Topic created successfully',
                  success: true,
                  topic: newTopic
                })
              )
              .catch((e: Error) =>
                res.status(500).json({
                  message: e.message || 'an unknown error occured',
                  success: false
                })
              );
          })
          .catch((e: Error) =>
            res.status(500).json({
              message: e.message || 'an unknown error occured',
              success: false
            })
          );
      })
      .catch((e: Error) =>
        res.status(500).json({
          message: e.message || 'an unknown error occured',
          success: false
        })
      );
  }
);

// @route   GET /forum/topic/:id
// @desc    Retrieves the given topic
// @access  Private
router.get('/:id', Cache.retrieve, (req: Request, res: Response): void => {
  log.trace(`GET /forum/topic/${req.params.id} reached endpoint`);

  try {
    Topic.findById(req.params.id).then(topic => {
      if (!topic) {
        res.status(403).json({
          message: 'Resource was not found',
          sucess: false
        });
        return;
      }
      Cache.cache(60)(req, res, {
        message: 'entry successfully retreived',
        success: true,
        topic
      });
    });
  } catch (e) {
    res.status(404).json({
      message: 'Entry not found',
      success: false
    });
  }
});

// @route   DELETE /forum/topic/:id
// @desc    Deletes the given topic
// @access  Private
router.delete(
  '/:id',
  async (req: Request, res: Response): Promise<void> => {
    log.trace(`DELETE /forum/topic/${req.params.id} reached endpoint`);

    let topic: ITopic;

    const temp = await Topic.findById(req.params.id);

    if (temp) {
      topic = temp;
    } else {
      res.status(404).json({
        message: 'The requested resource was not found on the server',
        success: false
      });
      return;
    }

    let user: IUser;

    const tempUser = await User.findOne({
      session_token: req.get('authorization')
    });

    if (tempUser) {
      user = tempUser;
    } else {
      res.status(404).json({
        message: 'The requested resource was not found on the server',
        success: false
      });
      return;
    }

    if (!topic) {
      res.status(404).json({ success: false, message: 'Resource not found' });
      return;
    }

    const canAccess =
      topic.poster === user._id ||
      user.role === 'admin' ||
      userIsMod(user, topic.category);

    if (!canAccess) {
      res.status(403).json({
        message: 'You do not have persmission to perform this action',
        success: false
      });
    } else {
      if (!topic) {
        res
          .status(403)
          .json({ sucess: false, message: 'Resource was not found' });
      } else {
        let postCount: number;
        /* Remove posts */
        Post.find({ topic: topic._id }).then(posts =>
          posts.forEach((e, i) => {
            e.remove();
            postCount++;
          })
        );
        topic.remove().then(() =>
          res.json({
            message: 'Topic deleted successfully',
            postCount,
            success: true
          })
        );
      }
    }
  }
);

// @route   PUT /forum/topic/:id
// @desc    Edits the given topic
// @access  Private
router.put('/:id', (req: Request, res: Response): void => {
  log.trace(`PUT /forum/topic/${req.params.id} reached endpoint`);

  Topic.findById(req.params.id).then(async topic => {
    if (!topic) {
      res.status(403).json({ success: false, message: 'Topic not found' });
    } else {
      topic.title = req.body.title || topic.title;
      if (req.body.body) {
        const post = await Post.findById(topic.body);
        if (post) {
          post.body = req.body.body || post.body;
          post.save().catch(e => {
            res
              .status(500)
              .json({ success: false, message: 'An unknown error occured' });
          });
        } else {
          res.status(404).json({
            message: 'The requested resource was not found on the server',
            success: false
          });
          return;
        }
      }
      topic
        .save()
        .then(newTopic =>
          res.json({
            message: 'Topic updated successfully',
            success: true,
            topic: newTopic
          })
        )
        .catch(e =>
          res.status(500).json({
            message: e.message || 'An unknown error occured',
            success: false
          })
        );
    }
  });
});

export default router;
