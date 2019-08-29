import { Router } from 'express';
import { Request, Response } from 'express';
import * as log from '../../logging/logging';
import adminOnly from '../../middleware/api/adminOnly';
import authorization from '../../middleware/api/authorization';
import Cache from '../../middleware/api/Cache';
import updateLastOnline from '../../middleware/api/updateLastOnline';
import Character from '../../models/Character';

const router = Router();

router.use('/', authorization);
router.use('/', updateLastOnline);

// @route	GET /character
// @desc	Returns a list of characters from the list
// @access	Private
router.get(
  '/',
  Cache.retrieve,
  async (req: Request, res: Response): Promise<void> => {
    const count = +(req.query.count || 10);
    const page = (req.query.page || 1) - 1;
    const toSkip = page * count;
    const totalDocs = await Character.estimatedDocumentCount();
    const pages = totalDocs / count;
    const sortOrder = req.query.sortOrder || 1;
    const sortCol = req.query.sortColumn || '_id';

    Character.find({}, '', {
      limit: count,
      skip: toSkip,
      sort: {
        [sortCol]: sortOrder
      }
    })
      .then(chars => {
        Cache.cache(3600)(req, res, {
          ascending: sortOrder === 1,
          characters: chars,
          lastPage: page + 1 >= pages,
          message: 'Characters retrieved successfully',
          numberPerPage: count,
          page: page + 1,
          pages,
          sortColumn: sortCol,
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

// @route	GET /character/:id
// @desc	Returns the given character
// @access	Private
router.get('/:id', Cache.retrieve, (req: Request, res: Response): void => {
  try {
    Character.findById(req.params.id)
      .then(char => {
        if (!char) {
          res.status(403).json({
            message: 'Resource was not found',
            sucess: false
          });
          return;
        }
        Cache.cache(60)(req, res, {
          character: char,
          message: 'Character retrieved successfully',
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
    res.status(500).json({
      message: e.message || 'An unknown error has occured',
      success: false
    });
  }
});

/* Create, update and delete routes are admin only */
router.use('/', adminOnly);

// @route	POST /character
// @desc	Creates a new character
// @access	Private
router.post('/', (req: Request, res: Response): void => {
  new Character({
    appearance: req.body.appearance,
    bonds: req.body.bonds,
    flaws: req.body.flaws,
    goals: req.body.goals,
    ideals: req.body.ideals,
    known: req.body.known,
    name: req.body.name,
    secrets: req.body.secrets
  })
    .save()
    .then(char => {
      res.json({
        character: char,
        message: 'Character created successfully',
        success: true
      });
    })
    .catch(e => {
      log.error(e.message);
      res.status(500).json({
        message: e.message || 'An unknown error occured',
        success: true
      });
    });
});

// @router	PUT /character/:id
// @desc	Updates the given character
// @access	Private
router.put('/:id', (req: Request, res: Response): void => {
  try {
    Character.findById(req.params.id)
      .then(char => {
        if (!char) {
          res.status(403).json({
            message: 'Resource was not found',
            sucess: false
          });
          return;
        }
        res.json({
          character: char,
          message: 'Character created successfully',
          success: true
        });
      })
      .catch((e: Error) => {
        log.error(e.message);
        res.status(500).json({
          message: 'An unknown error occured',
          success: false
        });
      });
  } catch (e) {
    res.status(404).json({
      message: 'An unknown error occured',
      success: false
    });
  }
});

// @router	DELETE /character/:id
// @desc	Deletes the given character
// @access	Private
router.delete('/:id', (req: Request, res: Response): void => {
  try {
    Character.findByIdAndDelete(req.params.id)
      .then(() => {
        res.json({
          message: 'Character deleted successfully',
          success: true
        });
      })
      .catch((e: Error) => {
        res.status(500).json({
          message: 'An unknown error occured',
          success: false
        });
      });
  } catch (e) {
    res.status(404).json({
      message: 'The requested resource was not found on the server',
      success: false
    });
  }
});

export default router;
