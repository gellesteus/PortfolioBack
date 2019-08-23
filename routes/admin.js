import * as log from '../logging/logging';
import Log from '../models/Log';
import { Router } from 'express';

const router = new Router();

function numberToLevel(level) {
  switch (level) {
    case 0:
      return 'trace';
    case 1:
      return 'debug';
    case 2:
      return 'info';
    case 3:
      return 'warning';
    case 4:
      return 'error';
    case 5:
      return 'fatal';
    default:
      return 'error';
  }
}

// @Route   GET /admin
// @Desc    Returns log entires sorted by time
// @Access  Private
router.get('/', (req, res) => {
  log.info('GET /admin reached the endpoint');
  /* Gets a number of logs from the database with the given level or higher */
  const level = numberToLevel(req.query.level || 3);
  const count = req.query.count || 20;
  const page = req.query.page || 1;

  Log.find({ level }, '', { take: count, skip: (page - 1) * count })
    .then(logs => {
      log.info('Logs retrieved successfully');
      res.json({ success: true, message: 'Logs retrieved successfully', logs });
    })
    .catch(e => {
      log.error(e);
      res.status(500).json({
        success: false,
        message: e.message || 'An unknown error occured',
      });
    });
});

// @Route   GET /admin/overview
// @Desc    Returns a general overview of the system as it is currently running
// @Access  Private
router.get('/overview', async (req, res) => {
  log.info('GET /admin/overview reached the endpoint');
  const logCount = await Log.estimatedDocumentCount();
  const logCountDay = await Log.estimatedDocumentCount();
  const logCountHour = await Log.estimatedDocumentCount();
  res.json({
    success: true,
    message: 'Overview retrieved successfully',
    logCount,
    logCountDay,
    logCountHour,
  });
});

export default router;
