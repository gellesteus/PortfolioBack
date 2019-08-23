import { Router } from 'express';
import authorization from '../../middleware/api/authorization';
import updateLastOnline from '../../middleware/api/updateLastOnline';
import adminOnly from '../../middleware/api/adminOnly';
import Organization from '../../models/Organization';
import Cache from '../../middleware/api/Cache';
import * as log from '../../logging/logging';

const router = Router();

/* Middleware for protected routes */
router.use('/', authorization);
router.use('/', updateLastOnline);

// @route   GET /organization
// @desc    Gets a list of organizations
// @access  Protected
router.get('/', Cache.retrieve, async (req, res) => {
  /* Get values from query parameters */
  const count = parseInt(req.query.count || 10);
  const page = (req.query.page || 1) - 1;
  const toSkip = page * count;
  const sortOrder = req.query.sortOrder || 1;
  const sortCol = req.query.sortColumn || '_id';

  /* Retrieves a more complete list if the user is an admin */

  const totalDocs = await Organization.estimatedDocumentCount();
  const pages = Math.ceil(totalDocs / count);

  Organization.find({}, 'name members holdings shortDesc _id', {
    skip: toSkip,
    limit: count,
    sort: { [sortCol]: sortOrder },
  })
    .then(organizations => {
      Cache.cache(3600)(req, res, {
        success: true,
        page: page + 1,
        numberPerPage: count,
        pages,
        sortCol,
        ascending: sortOrder === 1,
        lastPage: page + 1 >= pages,
        message: 'Organizations retrieved successfully',
        organizations,
      });
    })
    .catch(e => {
      res.status(500).json({
        success: false,
        message: e.message || 'An unknown error occured',
      });
    });
});

// @router  GET /organization/:id
// @desc    Gets a single organization
// @access  Protected
router.get('/:id', Cache.retrieve, (req, res) => {
  Organization.findById(req.params.id)
    .then(org => {
      if (org) {
        Cache.cache(3600)(req, res, {
          success: true,
          message: 'Organization retrieved successfully',
          organization: org,
        });
      } else {
        res.status(404).json({ success: false, message: 'Resource not found' });
      }
    })
    .catch(e => {
      res.status(500).json({
        success: false,
        message: e.message || 'An unknown error has occured',
      });
    });
});

/* Create, update and delete routes are restricted to admin access */
router.use('/', adminOnly);

// @route   POST /organization
// @desc    Creates a new organization
// @access  Protected
router.post('/', (req, res) => {
  try {
    new Organization({
      name: req.body.name,
      members: req.body.members,
      known: req.body.known,
      holdings: req.body.holdings,
      shortDesc: req.body.shortDesc,
      longDesc: req.body.longDesc,
    })
      .save()
      .then(org => {
        res.json({
          success: true,
          message: 'Organization created successfully',
          organization: org,
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
      message: e.message || 'An unknown error occured',
    });
  }
});

// @route   DELETE /organization/:id
// @desc    Deletes a given organization
// @access  Protected
router.delete('/:id', (req, res) => {
  try {
    Organization.findByIdAndDelete(req.params.id)
      .then(() => {
        res.json({ success: true, message: 'Item deleted successfully' });
      })
      .catch(e => {
        res
          .status(500)
          .json({ success: false, message: 'An unknown error occured' });
      });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: 'An unknown error occured',
    });
  }
});

// @route   PUT /organization/:id
// @desc    Updates a given organization
// @access  Protected
router.put('/:id', (req, res) => {
  try {
    Organization.findById(req.params.id)
      .then(org => {
        if (!org)
          res
            .status(403)
            .json({ sucess: false, message: 'Resource was not found' });
        org.name = req.body.name || org.name;
        org.members = req.body.members || org.members;
        org.known = req.body.known || org.known;
        org.holdings = req.body.holdings || org.holdings;
        org.shortDesc = req.body.shortDesc || org.shortDesc;
        org.longDesc = req.body.longDesc || org.longDesc;
        org
          .save()
          .then(org => {
            res.json({
              success: true,
              message: 'Organization updated successfully',
              organization: org,
            });
          })
          .catch(e => {
            res
              .status(500)
              .json({ success: false, message: 'An unknown error occured' });
          });
      })
      .catch(e => {
        res
          .status(500)
          .json({ success: false, message: 'An unknown error occured' });
      });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: 'An unknown error occured',
    });
  }
});

export default router;
