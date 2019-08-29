import { Router } from 'express';
import { Request, Response } from 'express';
import * as log from '../../logging/logging';
import adminOnly from '../../middleware/api/adminOnly';
import authorization from '../../middleware/api/authorization';
import Cache from '../../middleware/api/Cache';
import updateLastOnline from '../../middleware/api/updateLastOnline';
import Rule from '../../models/Rule';

const router = Router();

router.use('/', authorization);
router.use('/', updateLastOnline);

// @route   GET /rule
// @desc    Returns a list of all rules and their short descriptions
// @access  Private
router.get(
  '/',
  Cache.retrieve,
  async (req: Request, res: Response): Promise<void> => {
    /* Pagination is done on the server side */
    const count = +(req.query.count || 10);
    const page = (req.query.page || 1) - 1;
    const toSkip = page * count;
    const totalDocs = await Rule.estimatedDocumentCount();
    const pages = totalDocs / count;
    const sortOrder = req.query.sortOrder || 1;
    const sortCol = req.query.sortColumn || '_id';
    Rule.find({}, 'name shortDesc _id', {
      limit: count,
      skip: toSkip,
      sort: {
        [sortCol]: sortOrder
      }
    })
      .then(rules => {
        Cache.cache(3600)(req, res, {
          ascending: sortOrder === 1,
          lastPage: page + 1 >= pages,
          message: 'Rules retrieved successfully',
          numberPerPage: count,
          page: page + 1,
          pages,
          rules,
          sortColumn: sortCol,
          success: true
        });
      })
      .catch((e: Error) => {
        log.error(e.message);
        res
          .status(500)
          .json({ success: false, message: 'An unknown error occured' });
      });
  }
);

// @route   GET /rule/:id
// @desc    Returns a single rule and its descriptions
// @access  Private
router.get('/:id', Cache.retrieve, (req: Request, res: Response): void => {
  Rule.findOne({ _id: req.params.id })
    .then(rule => {
      if (!rule) {
        res
          .status(403)
          .json({ sucess: false, message: 'Resource was not found' });
        return;
      }
      Cache.cache(3600)(req, res, {
        message: 'Rule retrieved successfully',
        rule,
        success: true
      });
    })
    .catch(e => {
      res.status(400).json({
        message: 'Invalid id',
        success: false
      });
    });
});

router.use('/', adminOnly);

// @route   POST /rule
// @desc    Creates a new rule
// @access  Private
router.post('/', (req: Request, res: Response): void => {
  new Rule({
    longDesc: req.body.longDesc,
    name: req.body.name,
    shortDesc: req.body.shortDesc
  })
    .save()
    .then(rule => {
      res.json({
        message: 'Rule created successfully',
        rule,
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
});

// @route   PUT /rule/:id
// @desc    Updates an existing rule
// @access  Private
router.put('/:id', (req: Request, res: Response): void => {
  Rule.findOne({ _id: req.params.id })
    .then(rule => {
      if (!rule) {
        res
          .status(403)
          .json({ sucess: false, message: 'Resource was not found' });
        return;
      }

      rule.name = req.body.name || rule.name;
      rule.shortDesc = req.body.shortDesc || rule.shortDesc;
      rule.longDesc = req.body.longDesc || rule.longDesc;

      rule
        .save()
        .then(newRule => {
          res.json({
            message: 'Rule updated successfully',
            rule: newRule,
            success: true
          });
        })
        .catch((e: Error) => {
          res.status(500).json({
            message: e.message || 'An unknown error occured',
            success: false
          });
        });
    })
    .catch((e: Error) => {
      log.error(e.message);
      res.status(400).json({ success: false, message: 'Rule not found' });
    });
});

// @route   DESTROY /rule/:id
// @desc    Removes the given rule
// @access  Private
router.delete('/:id', (req: Request, res: Response): void => {
  Rule.findByIdAndDelete(req.params.id)
    .then(() => {
      res.json({
        message: 'Rule deleted successfully',
        success: true
      });
    })
    .catch((e: Error) => {
      log.error(e.message);
      res.status(400).json({
        message: 'An unknown error occured',
        success: false
      });
    });
});

export default router;
