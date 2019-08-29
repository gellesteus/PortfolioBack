import { Router } from 'express';
import { Request, Response } from 'express';
import * as log from '../../logging/logging';
import Log from '../../models/Log';

const router = Router();

function numberToLevel(level: number): string {
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
router.get('/', (req: Request, res: Response): void => {
  log.info('GET /admin reached the endpoint');
  /* Gets a number of logs from the database with the given level or higher */
  const level = numberToLevel(req.query.level || 3);
  const count = req.query.count || 20;
  const page = req.query.page || 1;

  Log.find({ level }, '', { take: count, skip: (page - 1) * count })
    .then(logs => {
      log.info('Logs retrieved successfully');
      res.json({
        logs,
        message: 'Logs retrieved successfully',
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
});

// @Route   GET /admin/overview
// @Desc    Returns a general overview of the system as it is currently running
// @Access  Private
router.get(
  '/overview',
  async (req: Request, res: Response): Promise<void> => {
    log.info('GET /admin/overview reached the endpoint');

    const logCount = await Log.estimatedDocumentCount();
    const logCountDay = await Log.estimatedDocumentCount();
    const logCountHour = await Log.estimatedDocumentCount();

    res.json({
      logCount,
      logCountDay,
      logCountHour,
      message: 'Overview retrieved successfully',
      success: true
    });
  }
);

export default router;
