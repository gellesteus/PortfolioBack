import { Router } from 'express';
import { Request, Response } from 'express';
import * as log from '../../logging/logging';
import adminOnly from '../../middleware/api/adminOnly';
import authorization from '../../middleware/api/authorization';
import Cache from '../../middleware/api/Cache';
import updateLastOnline from '../../middleware/api/updateLastOnline';
import Item from '../../models/Item';

const router = Router();

router.use('/', authorization);
router.use('/', updateLastOnline);

// @route   GET /armory
// @desc    Returns a list of equipment
// @access  Private
router.get(
  '/',
  Cache.retrieve,
  async (req: Request, res: Response): Promise<void> => {
    /* Get values from query parameters */
    const count = +(req.query.count || 10);
    const page = (req.query.page || 1) - 1;
    const toSkip = page * count;
    const sortOrder = req.query.sortOrder || 1;
    const sortCol = req.query.sortColumn || '_id';

    const totalDocs = await Item.estimatedDocumentCount();
    const pages = Math.ceil(totalDocs / count);

    Item.find({}, '', {
      limit: count,
      skip: toSkip,
      sort: {
        [sortCol]: sortOrder
      }
    })
      .then(items => {
        Cache.cache(3600)(req, res, {
          ascending: sortOrder === 1,
          items,
          lastPage: page + 1 >= pages,
          message: 'Items retrieved successfully',
          numberPerPage: count,
          page: page + 1,
          pages,
          sortCol,
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

// @route   GET /armory/:id
// @desc    Returns the given item
// @access  Private
router.get('/:id', Cache.retrieve, (req: Request, res: Response): void => {
  try {
    Item.findById(req.params.id)
      .then(item => {
        if (!item) {
          res
            .status(403)
            .json({ sucess: false, message: 'Resource was not found' });
          return;
        }
        Cache.cache(3600)(req, res, {
          item,
          message: 'entry successfully retreived',
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
  } catch (e) {
    log.error(e.message);
    res.status(404).json({ success: false, message: 'Entry not found' });
  }
});

router.use('/', adminOnly);

// @route   POST /armory
// @desc    Creates a new item
// @access  Private
router.post('/', (req: Request, res: Response): void => {
  new Item({
    images: req.body.images,
    longDesc: req.body.longDesc,
    name: req.body.name,
    shortDesc: req.body.shortDesc
  })
    .save()
    .then(item =>
      res.json({
        item,
        message: 'Item created successfully',
        success: true
      })
    )
    .catch((e: Error) => {
      log.error(e.message);
      res.status(400).json({
        message: e.message || 'An unknown error occured',
        success: false
      });
    });
});

// @route   PUT /armory/:id
// @desc    Updates the given item
// @access  Private
router.put('/:id', (req: Request, res: Response): void => {
  Item.findById(req.params.id)
    .then(item => {
      item.name = req.body.name || item.name;
      item.shortDesc = req.body.shortDesc || item.shortDesc;
      item.longDesc = req.body.longDesc || item.longDesc;
      item.images = req.body.images || item.images;

      item
        .save()
        .then(updItem =>
          res.json({
            item: updItem,
            message: 'Item updated successfully',
            success: true
          })
        )
        .catch((e: Error) => {
          log.error(e.message);
          res
            .status(500)
            .json({ success: false, message: 'An unkown error occured' });
        });
    })
    .catch(e => {
      log.error(e.message);
      res.status(404).json({
        message: 'The requested resource was not found on the server',
        success: false
      });
    });
});

// @route   DELETE /armory
// @desc    Deletes the given item
// @route   Private
router.delete('/:id', (req: Request, res: Response): void => {
  Item.findByIdAndDelete(req.params.id)
    .then(() =>
      res.json({
        message: 'Item deleted successfully',
        success: true
      })
    )
    .catch((e: Error) => {
      log.error(e.message);
      res.status(500).json({
        message: 'An unknown error occured',
        success: false
      });
    });
});

export default router;
