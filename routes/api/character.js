import { Router } from 'express';
import authorization from '../../middleware/api/authorization';
import updateLastOnline from '../../middleware/api/updateLastOnline';
import adminOnly from '../../middleware/api/adminOnly';
import Character from '../../models/Character';
import Cache from '../../middleware/api/Cache';
import * as log from '../../logging/logging';

const router = Router();

router.use('/', authorization);
router.use('/', updateLastOnline);

// @route	GET /character
// @desc	Returns a list of characters from the list
// @access	Private
router.get('/', Cache.retrieve, async (req, res) => {
  const count = parseInt(req.query.count || 10);
  const page = (req.query.page || 1) - 1;
  const toSkip = page * count;
  const totalDocs = await Character.estimatedDocumentCount();
  const pages = totalDocs / count;
  const sortOrder = req.query.sortOrder || 1;
  const sortCol = req.query.sortColumn || '_id';

  Character.find({}, '', {
    skip: toSkip,
    limit: count,
    sort: { [sortCol]: sortOrder },
  })
    .then(chars => {
      Cache.cache(3600)(req, res, {
        success: true,
        page: page + 1,
        numberPerPage: count,
        pages,
        sortColumn: sortCol,
        ascending: sortOrder === 1,
        lastPage: page + 1 >= pages,
        message: 'Characters retrieved successfully',
        characters: chars,
      });
    })
    .catch(e => {
      res.status(500).json({
        success: false,
        message: e.message || 'An unknown error occured',
      });
    });
});

// @route	GET /character/:id
// @desc	Returns the given character
// @access	Private
router.get('/:id', Cache.retrieve, (req, res) => {
  try {
    Character.findById(req.params.id)
      .then(char => {
        if (!char)
          return res
            .status(403)
            .json({ sucess: false, message: 'Resource was not found' });
        Cache.cache(60)(req, res, {
          success: true,
          message: 'Character retrieved successfully',
          character: char,
        });
      })
      .catch(e => {
        res.status(500).json({
          success: false,
          message: e.message || 'An unknown error occured',
        });
      });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message || 'An unknown error has occured',
    });
  }
});

/* Create, update and delete routes are admin only */
router.use('/', adminOnly);

// @route	POST /character
// @desc	Creates a new character
// @access	Private
router.post('/', (req, res) => {
  new Character({
    name: req.body.name,
    known: req.body.known,
    appearance: req.body.appearance,
    flaws: req.body.flaws,
    goals: req.body.goals,
    ideals: req.body.ideals,
    secrets: req.body.secrets,
    bonds: req.body.bonds,
  })
    .save()
    .then(char => {
      res.json({
        success: true,
        message: 'Character created successfully',
        character: char,
      });
    })
    .catch(e => {
      res.status(500).json({
        success: true,
        message: e.message || 'An unknown error occured',
      });
    });
});

// @router	PUT /character/:id
// @desc	Updates the given character
// @access	Private
router.put('/:id', (req, res) => {
  try {
    Character.findById(req.params.id)
      .then(char => {
        if (!char)
          res
            .status(403)
            .json({ sucess: false, message: 'Resource was not found' });
        res.json({
          success: true,
          message: 'Character created successfully',
          character: char,
        });
      })
      .catch(e => {
        res
          .status(500)
          .json({ success: false, message: 'An unknown error occured' });
      });
  } catch (e) {
    res
      .status(404)
      .json({ success: false, message: 'An unknown error occured' });
  }
});

// @router	DELETE /character/:id
// @desc	Deletes the given character
// @access	Private
router.delete('/:id', (req, res) => {
  try {
    Character.findByIdAndDelete(req.params.id)
      .then(() => {
        res.json({
          success: true,
          message: 'Character deleted successfully',
        });
      })
      .catch(e => {
        res.status(500).json({
          success: false,
          message: 'An unknown error occured',
        });
      });
  } catch (e) {
    res.status(404).json({
      success: false,
      message: 'The requested resource was not found on the server',
    });
  }
});

export default router;
