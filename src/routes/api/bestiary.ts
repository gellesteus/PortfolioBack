import { Router } from 'express';
import { Request, Response } from 'express';
import * as log from '../../logging/log';
import adminOnly from '../../middleware/api/adminOnly';
import authorization from '../../middleware/api/authorization';
import Cache from '../../middleware/api/Cache';
import updateLastOnline from '../../middleware/api/updateLastOnline';
import Beast from '../../models/Beast';

const router = Router();

router.use('/', authorization);
router.use('/', updateLastOnline);

// @route   GET /bestiary
// @desc    Returns a list of beasts
// @access  Private
router.get(
  '/',
  Cache.retrieve,
  async (req: Request, res: Response): Promise<void> => {
    /* Pagination is done on the server side */
    const count = +(req.query.count || 10);
    const page = (req.query.page || 1) - 1;
    const toSkip = page * count;
    const totalDocs = await Beast.estimatedDocumentCount();
    const pages = totalDocs / count;
    const sortOrder = req.query.sortOrder || 1;
    const sortCol = req.query.sortColumn || '_id';

    Beast.find({}, 'name shortDesc longDesc _id', {
      limit: count,
      skip: toSkip,
      sort: {
        [sortCol]: sortOrder,
      },
    })
      .then(beasts => {
        Cache.cache(3600)(req, res, {
          ascending: sortOrder === 1,
          beasts,
          lastPage: page + 1 >= pages,
          message: 'Monsters retrieved successfully',
          numberPerPage: count,
          page: page + 1,
          pages,
          sortColumn: sortCol,
          success: true,
        });
      })
      .catch(e => {
        res.status(500).json({
          message: e.message || 'An unknown error occured',
          success: false,
        });
      });
  }
);

// @route   GET /bestiary/:id
// @desc    Returns the given beast
// @access  Private
router.get('/:id', (req: Request, res: Response): void => {
  Beast.findById(req.params.id)
    .then(beast => {
      if (!beast) {
        res
          .status(403)
          .json({ sucess: false, message: 'Resource was not found' });
        return;
      }
      res.json({
        beast,
        message: 'entry successfully retreived',
        success: true,
      });
    })
    .catch((e: Error) => {
      res.status(500).json({
        message: e.message || 'An unknown error occured',
        success: false,
      });
    });
});

router.use('/', adminOnly);

// @route   POST /bestiary
// @desc    Create a new beast
// @access  Private
router.post('/', (req: Request, res: Response): void => {
  new Beast({
    images: req.body.images,
    longDesc: req.body.longDesc,
    name: req.body.name,
    shortDesc: req.body.shortDesc,
  })
    .save()
    .then(beast =>
      res.json({
        beast,
        message: 'Monster created successfully',
        success: true,
      })
    )
    .catch(e =>
      res.status(500).json({
        message: e.message || 'An unknown error occured',
        success: false,
      })
    );
});

// @route   PUT /bestiary/:id
// @desc    Update the given beast
// @access  Private
router.put('/:id', (req: Request, res: Response): void => {
  Beast.findById(req.params.id)
    .then(beast => {
      if (!beast) {
        res.status(404).json({
          message: 'Resource was not found on the server',
          success: false,
        });
        return;
      }
      beast.name = req.body.name || beast.name;
      beast.shortDesc = req.body.shortDesc || beast.shortDesc;
      beast.longDesc = req.body.longDesc || beast.longDesc;
      beast.images = req.body.images || beast.images;
      beast
        .save()
        .then(newBeast =>
          res.json({
            beast: newBeast,
            message: 'Monster updated successfully',
            success: true,
          })
        )
        .catch((e: Error) => {
          log.error(e.message);
          res
            .status(500)
            .json({ success: false, message: 'An unkown error occured' });
        });
    })
    .catch((e: Error) => {
      log.error(e.message);
      res.status(404).json({
        message: 'The requested resource was not found on the server',
        success: false,
      });
    });
});

// @route   DELETE /bestiary/:id
// @desc    Delete the given beast
// @access  Private
router.delete('/:id', (req: Request, res: Response): void => {
  Beast.findByIdAndDelete(req.params.id)
    .then(() =>
      res.json({ success: true, message: 'Monster deleted successfylly' })
    )
    .catch((e: Error) => {
      log.error(e.message);
      res.status(404).json({
        message: 'The requested resource was not found on the server',
        success: false,
      });
    });
});

export default router;
