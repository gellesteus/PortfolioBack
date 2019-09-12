import crypto from 'crypto';
import { Router } from 'express';
import { Request, Response } from 'express';
import * as log from '../../logging/log';
import CSRF from '../../models/CSRF';
const router = Router();

// @router	GET /csrf
// @desc	  Retrieve a CSRF token
// @access	Public
router.get(
  '/',
  async (req: Request, res: Response): Promise<void> => {
    const value = crypto.randomBytes(32).toString('hex');
    await new CSRF({
      value,
    })
      .save()
      .catch((e: Error) => {
        log.error(e.message);
        res
          .status(500)
          .json({ success: false, message: 'An unknown error occured' });
      });
    res.json({ success: true, message: 'CSRF token retrieved', token: value });
  }
);

// @router	DELETE /csrf/:token
// @desc	  Forcibly invalidate a token
// @access	Public
router.delete('/:token', (req, res) => {
  CSRF.findOne({ value: req.params.token })
    .then(csrf => {
      if (csrf) {
        csrf.remove().then(() =>
          res.json({
            message: 'CSRF token deleted successfully',
            success: true,
          })
        );
      }
    })
    .catch((e: Error) => {
      log.error(e.message);
      res.status(500).json({
        message: 'CSRF token not found',
        success: false,
      });
    });
});

export default router;
