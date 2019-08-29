import { Router } from 'express';
import authorization from '../../../middleware/api/authorization';
import updateLastOnline from '../../../middleware/api/updateLastOnline';
import adminOnly from '../../../middleware/api/adminOnly';
import Category from '../../../models/Category';
import Post from '../../../models/Post';
import Topic from '../../../models/Topic';
import Cache from '../../../middleware/api/Cache';
import * as log from '../../../logging/logging';

const router = Router();

router.use('/', authorization);
router.use('/', updateLastOnline);

// @route   GET /forum/category
// @desc    Retrieve a list of categories
// @access  Private
router.get('/', Cache.retrieve, (req, res) => {
  log.trace('GET /forum/category reached endpoint');
  Category.find()
    .then(categories => {
      log.trace('Retrieved dategory data from DB');
      Cache.cache(60)(req, res, {
        success: true,
        message: 'Categories retrieved successfully',
        categories,
      });
    })
    .catch(e => {
      log.error(e);
      res.status(500).json({
        success: false,
        message: e.message || 'An unknown error occured',
      });
    });
});

// @route   GET /forum/category/:id
// @desc    Retrieve a single category
// @access  Private
router.get('/:id', Cache.retrieve, (req, res) => {
  log.trace(`GET /forum/category/${req.params.id} reached endpoint`);
  Category.findOne({ _id: req.params.id })
    .then(category => {
      if (!category) {
        log.debug('Category not found');
        res
          .status(403)
          .json({ sucess: false, message: 'Resource was not found' });
      }
      log.debug('Catgegory found. Sending as response');
      Cache.cache(60)(req, res, {
        success: true,
        message: 'Category retrieved successfully',
        category,
      });
    })
    .catch(e => {
      log.error(e);
      res
        .status(500)
        .json({ success: false, message: 'Invalid category ID given' });
    });
});

/* Create, update and delete routes are only able to be accessed by the admin */
router.use('/', adminOnly);

// @route   POST /forum/category
// @desc    Create a new category
// @access  Private
router.post('/', (req, res) => {
  log.trace('POST /forum/category/ reached endpoint');
  log.trace('Creating new category');
  new Category({
    name: req.body.name,
    desc: req.body.desc,
    position: req.body.position,
    section: req.body.section,
  })
    .save()
    .then(category => {
      log.debug('Category saved successfully');
      res.json({
        success: true,
        message: 'Category created successfully',
        category,
      });
    })
    .catch(e => {
      log.error(e);
      res.status(500).json({
        success: false,
        message: e.message || 'An unknown error occured',
      });
    });
});

// @route   PUT /forum/category
// @desc    Updates an existing category
// @access  Private
router.put('/:id', (req, res) => {
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
        cat.postion = req.body.position || cat.position;
        cat.section = req.body.section || cat.section;
        cat
          .save()
          .then(cat => {
            log.info('Category updated successfully');
            res.json({
              success: true,
              message: 'Category updated successfully',
              category: cat,
            });
          })
          .catch(e => {
            log.error(e);
            res.status(500).json({
              success: false,
              message: 'An unknown error occured',
            });
          });
      })
      .catch(e => {
        log.error(e);
        res
          .status(500)
          .json({ success: false, message: 'An unknown error occured' });
      });
  } catch (e) {
    log.error(e);
    res.status(404).json({ success: false, message: 'Category not found' });
  }
});

// @route   DELETE /forum/category/:id
// @desc    Deletes the given category
// @access  Private
router.delete('/:id', async (req, res) => {
  log.trace(`DELETE /forum/category/${req.params.id} reached endpoint`);
  try {
    const cat = await Category.findById(req.params.id);
    if (!cat) {
      log.info('Category not found');
      return res
        .status(404)
        .json({ success: false, message: 'Resource not found' });
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
          success: true,
          message: 'Category deleted successfully',
        });
      })
      .catch(e => {
        log.error(e);
        res
          .status(500)
          .json({ success: false, message: 'An unknown error occured' });
      });
  } catch (e) {
    log.error(e);
    res.status(404).json({ success: false, message: 'Category not found' });
  }
});

export default router;
