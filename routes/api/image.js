import { Router } from 'express';

import authorization from '../../middleware/api/authorization';
import notBanned from '../../middleware/api/notBanned';
import validated from '../../middleware/api/requireValidatedAccount';
import User from '../../models/User';
const router = Router();

router.use(authorization);
router.use(notBanned);
router.use(validated);

router.post('/', async (req, res) => {
  if (!req.files) {
    return res.status(400).json({ success: false, message: 'No file found' });
  } else {
    const user = await User.findOne({ sessionToken: req.get('authorization') });
    const file = req.files.file;
    if (file.truncated) {
      return res.status(400).json({
        success: false,
        message: `File too large. Max size is ${process.env.MAX_FILE_SIZE /
          1024 /
          1024} MB`,
      });
    }
    /* Administrators can upload as many files as they want. other users are limited */
    if (user.role !== 'admin' && user.fileCount > process.env.MAX_FILE_COUNT) {
      return res.status(400).json({
        success: false,
        message:
          'You have uploaded too many files. Please delete some of your existing files before uploading more',
      });
    }

    /* Move the file */
    file.mv('../../public/images', async err => {
      if (err) {
        res
          .status(500)
          .json({ success: false, message: err || 'An unknown error occured' });
      } else {
        const path = '';
        /* Update user information */
        user.fileCount++;
        user.files.push(path);
        await user.save();
        /* Save the image model */

        res.json({
          success: true,
          message: 'File uploaded successfully',
          fileName: req.files.name,
          filePath: path,
        });
      }
    });
  }
});

router.delete('/:id', (req, res) => {});

export default router;
