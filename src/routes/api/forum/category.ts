import { Router } from 'express';
import { Request, Response } from 'express';
import * as log from '../../../logging/log';
import adminOnly from '../../../middleware/api/adminOnly';
import authorization from '../../../middleware/api/authorization';
import Cache from '../../../middleware/api/Cache';
import updateLastOnline from '../../../middleware/api/updateLastOnline';
import Category from '../../../models/Category';
import Post from '../../../models/Post';
import Topic from '../../../models/Topic';

const router = Router();

router.use('/', authorization);
router.use('/', updateLastOnline);

// @route   GET /forum/category
// @desc    Retrieve a list of categories
// @access  Private
router.get('/', Cache.retrieve, (req: Request, res: Response): void => {
  log.trace('GET /forum/category reached endpoint');
  Category.find()
    .then(categories => {
      log.trace('Retrieved dategory data from DB');
      Cache.cache(60)(req, res, {
        categories,
        message: 'Categories retrieved successfully',
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
});

// @route   GET /forum/category/:id
// @desc    Retrieve a single category
// @access  Private
router.get('/:id', Cache.retrieve, (req: Request, res: Response): void => {
  log.trace(`GET /forum/category/${req.params.id} reached endpoint`);
  Category.findById(req.params.id)
    .then(category => {
      if (!category) {
        log.debug('Category not found');
        res.status(403).json({
          message: 'Resource was not found',
          sucess: false,
        });
        return;
      }
      log.debug('Catgegory found. Sending as response');
      Cache.cache(60)(req, res, {
        category,
        message: 'Category retrieved successfully',
        success: true,
      });
    })
    .catch((e: Error) => {
      log.error(e.message);
      res.status(500).json({
        message: 'Invalid category ID given',
        success: false,
      });
    });
});

/* Create, update and delete routes are only able to be accessed by the admin */
router.use('/', adminOnly);

// @route   POST /forum/category
// @desc    Create a new category
// @access  Private
router.post('/', (req: Request, res: Response): void => {
  log.trace('POST /forum/category/ reached endpoint');
  log.trace('Creating new category');
  new Category({
    desc: req.body.desc,
    name: req.body.name,
    position: req.body.position,
    section: req.body.section,
  })
    .save()
    .then(category => {
      log.debug('Category saved successfully');
      res.json({
        category,
        message: 'Category created successfully',
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
});

// @route   PUT /forum/category
// @desc    Updates an existing category
// @access  Private
router.put('/:id', (req: Request, res: Response): void => {
  log.trace(`PUT /forum/category/${req.params.id} reached endpoint`);
  try {
    Category.findById(req.params.id)
      .then(cat => {
        if (!cat) {
          log.debug('Category not found');
          return res
            .status(404)
            .json({ sucess: false, message: 'Resource was not found' });
        }
        log.debug('Updating category');
        cat.name = req.body.name || cat.name;
        cat.desc = req.body.desc || cat.desc;
        cat.position = req.body.position || cat.position;
        cat.section = req.body.section || cat.section;
        cat
          .save()
          .then(savedCat => {
            log.info('Category updated successfully');
            res.json({
              category: savedCat,
              message: 'Category updated successfully',
              success: true,
            });
          })
          .catch((e: Error) => {
            log.error(e.message);
            res.status(500).json({
              message: 'An unknown error occured',
              success: false,
            });
          });
      })
      .catch((e: Error) => {
        log.error(e.message);
        res.status(500).json({
          message: 'An unknown error occured',
          success: false,
        });
      });
  } catch (e) {
    log.error(e.message);
    res.status(404).json({ success: false, message: 'Category not found' });
  }
});

// @route   DELETE /forum/category/:id
// @desc    Deletes the given category
// @access  Private
router.delete(
  '/:id',
  async (req: Request, res: Response): Promise<void> => {
    log.trace(`DELETE /forum/category/${req.params.id} reached endpoint`);
    try {
      const cat = await Category.findById(req.params.id);
      if (!cat) {
        log.info('Category not found');
        res.status(404).json({
          message: 'Resource not found',
          success: false,
        });
        return;
      }
      /* Delete the posts */
      log.debug('Deleting posts associated with category');
      Post.find({ category: cat._id })
        .remove()
        .exec();

      /* Delete the threads */
      log.debug('Deleting topics');
      Topic.find({ category: cat._id })
        .remove()
        .exec();

      /* Delete the category */
      cat
        .remove()
        .then(() => {
          log.info('Category deleted successfully');
          res.json({
            message: 'Category deleted successfully',
            success: true,
          });
        })
        .catch((e: Error) => {
          log.error(e.message);
          res.status(500).json({
            message: 'An unknown error occured',
            success: false,
          });
        });
    } catch (e) {
      log.error(e.message);
      res.status(404).json({
        message: 'Category not found',
        success: false,
      });
    }
  }
);

export default router;
