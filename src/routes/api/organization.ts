import { Router } from 'express';
import { Request, Response } from 'express';
import * as log from '../../logging/logging';
import adminOnly from '../../middleware/api/adminOnly';
import authorization from '../../middleware/api/authorization';
import Cache from '../../middleware/api/Cache';
import updateLastOnline from '../../middleware/api/updateLastOnline';
import Organization from '../../models/Organization';

const router = Router();

/* Middleware for protected routes */
router.use('/', authorization);
router.use('/', updateLastOnline);

// @route   GET /organization
// @desc    Gets a list of organizations
// @access  Protected
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

    /* Retrieves a more complete list if the user is an admin */

    const totalDocs = await Organization.estimatedDocumentCount();
    const pages = Math.ceil(totalDocs / count);

    Organization.find({}, 'name members holdings shortDesc _id', {
      limit: count,
      skip: toSkip,
      sort: {
        [sortCol]: sortOrder
      }
    })
      .then(organizations => {
        Cache.cache(3600)(req, res, {
          ascending: sortOrder === 1,
          lastPage: page + 1 >= pages,
          message: 'Organizations retrieved successfully',
          numberPerPage: count,
          organizations,
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

// @router  GET /organization/:id
// @desc    Gets a single organization
// @access  Protected
router.get('/:id', Cache.retrieve, (req: Request, res: Response): void => {
  Organization.findById(req.params.id)
    .then(org => {
      if (org) {
        Cache.cache(3600)(req, res, {
          message: 'Organization retrieved successfully',
          organization: org,
          success: true
        });
      } else {
        res.status(404).json({
          message: 'Resource not found',
          success: false
        });
      }
    })
    .catch(e => {
      res.status(500).json({
        message: e.message || 'An unknown error has occured',
        success: false
      });
    });
});

/* Create, update and delete routes are restricted to admin access */
router.use('/', adminOnly);

// @route   POST /organization
// @desc    Creates a new organization
// @access  Protected
router.post('/', (req: Request, res: Response): void => {
  try {
    new Organization({
      holdings: req.body.holdings,
      known: req.body.known,
      longDesc: req.body.longDesc,
      members: req.body.members,
      name: req.body.name,
      shortDesc: req.body.shortDesc
    })
      .save()
      .then(org => {
        res.json({
          message: 'Organization created successfully',
          organization: org,
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
    res.status(500).json({
      message: e.message || 'An unknown error occured',
      success: false
    });
  }
});

// @route   DELETE /organization/:id
// @desc    Deletes a given organization
// @access  Protected
router.delete('/:id', (req: Request, res: Response): void => {
  try {
    Organization.findByIdAndDelete(req.params.id)
      .then(() => {
        res.json({
          message: 'Item deleted successfully',
          success: true
        });
      })
      .catch(e => {
        log.error(e.message);
        res.status(500).json({
          message: 'An unknown error occured',
          success: false
        });
      });
  } catch (e) {
    res.status(500).json({
      message: 'An unknown error occured',
      success: false
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
        if (!org) {
          res.status(403).json({
            message: 'Resource was not found',
            sucess: false
          });
        }
        org.name = req.body.name || org.name;
        org.members = req.body.members || org.members;
        org.holding = req.body.holdings || org.holding;
        org.shortDesc = req.body.shortDesc || org.shortDesc;
        org.longDesc = req.body.longDesc || org.longDesc;
        org
          .save()
          .then(newOrg => {
            res.json({
              message: 'Organization updated successfully',
              organization: newOrg,
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
      })
      .catch((e: Error) => {
        log.error(e.message);
        res.status(500).json({
          message: 'An unknown error occured',
          success: false
        });
      });
  } catch (e) {
    res.status(500).json({
      message: 'An unknown error occured',
      success: false
    });
  }
});

export default router;
