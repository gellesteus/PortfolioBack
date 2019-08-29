import { Router } from 'express';
import authorization from '../../middleware/api/authorization';
import updateLastOnline from '../../middleware/api/updateLastOnline';
import adminOnly from '../../middleware/api/adminOnly';
import Item from '../../models/Item';
import Cache from '../../middleware/api/Cache';
import * as log from '../../logging/logging';
const router = Router();

router.use('/', authorization);
router.use('/', updateLastOnline);

// @route   GET /armory
// @desc    Returns a list of equipment
// @access  Private
router.get('/', Cache.retrieve, async (req, res) => {
  /* Get values from query parameters */
  const count = parseInt(req.query.count || 10);
  const page = (req.query.page || 1) - 1;
  const toSkip = page * count;
  const sortOrder = req.query.sortOrder || 1;
  const sortCol = req.query.sortColumn || '_id';

  const totalDocs = await Item.estimatedDocumentCount();
  const pages = Math.ceil(totalDocs / count);

  Item.find({}, '', {
    skip: toSkip,
    limit: count,
    sort: { [sortCol]: sortOrder },
  })
    .then(items => {
      Cache.cache(3600)(req, res, {
        success: true,
        page: page + 1,
        numberPerPage: count,
        pages,
        sortCol,
        ascending: sortOrder === 1,
        lastPage: page + 1 >= pages,
        message: 'Items retrieved successfully',
        items,
      });
    })
    .catch(e => {
      res.status(500).json({
        success: false,
        message: e.message || 'An unknown error occured',
      });
    });
});

// @route   GET /armory/:id
// @desc    Returns the given item
// @access  Private
router.get('/:id', Cache.retrieve, (req, res) => {
  try {
    Item.findById(req.params.id)
      .then(item => {
        if (!item)
          return res
            .status(403)
            .json({ sucess: false, message: 'Resource was not found' });
        Cache.cache(3600)(req, res, {
          success: true,
          message: 'entry successfully retreived',
          item,
        });
      })
      .catch(e => {
        res.status(500).json({
          success: false,
          message: e.message || 'An unknown error occured',
        });
      });
  } catch (e) {
    res.status(404).json({ success: false, message: 'Entry not found' });
  }
});

router.use('/', adminOnly);

// @route   POST /armory
// @desc    Creates a new item
// @access  Private
router.post('/', (req, res) => {
  new Item({
    name: req.body.name,
    shortDesc: req.body.shortDesc,
    longDesc: req.body.longDesc,
    images: req.body.images,
  })
    .save()
    .then(item =>
      res.json({ success: true, message: 'Item created successfully', item })
    )
    .catch(e =>
      res.status(400).json({
        success: false,
        message: e.message || 'An unknown error occured',
      })
    );
});

// @route   PUT /armory/:id
// @desc    Updates the given item
// @access  Private
router.put('/:id', (req, res) => {
  Item.findById(req.params.id)
    .then(item => {
      item.name = req.body.name || item.name;
      item.shortDesc = req.body.shortDesc || item.shortDesc;
      item.longtDesc = req.body.longDesc || item.longDesc;
      item.images = req.body.images || item.images;
      item
        .save()
        .then(item =>
          res.json({
            success: true,
            message: 'Item updated successfully',
            item,
          })
        )
        .catch(e =>
          res
            .status(500)
            .json({ success: false, message: 'An unkown error occured' })
        );
    })
    .catch(e =>
      res.status(404).json({
        success: false,
        message: 'The requested resource was not found on the server',
      })
    );
});

// @route   DELETE /armory
// @desc    Deletes the given item
// @route access
router.delete('/:id', (req, res) => {
  Item.findByIdAndDelete(req.params.id)
    .then(() =>
      res.json({ success: true, message: 'Item deleted successfully' })
    )
    .catch(e =>
      res.status(500).json({
        success: false,
        message: 'An unknown error occured',
      })
    );
});

export default router;
