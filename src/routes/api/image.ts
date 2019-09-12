import { Router } from 'express';
import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import * as log from '../../logging/log';
import authorization from '../../middleware/api/authorization';
import notBanned from '../../middleware/api/notBanned';
import validated from '../../middleware/api/requireValidatedAccount';
import User, { IUser } from '../../models/User';

const router = Router();

router.use(authorization);
router.use(notBanned);
router.use(validated);

router.post(
  '/',
  async (req: Request, res: Response): Promise<void> => {
    if (!req.files) {
      res.status(400).json({ success: false, message: 'No file found' });
      return;
    } else {
      if (!req.files.file) {
        res.status(400).json({ success: false, message: 'No file found' });
        return;
      }
      const tempUser = await User.findOne({
        session_token: req.get('authorization'),
      });
      let user: IUser;
      if (tempUser) {
        user = tempUser;
      } else {
        res
          .status(404)
          .json({ message: 'An unknown error occured', success: false });
        return;
      }

      let file: UploadedFile;
      if (Array.isArray(req.files.file)) {
        const temp = req.files.file.pop();
        if (temp) {
          file = temp;
        } else {
          res.status(400).json({ success: false, message: 'No file found' });
          return;
        }
      } else {
        file = req.files.file;
      }
      if (file.truncated) {
        res.status(400).json({
          message: `File too large. Max size is ${+(
            process.env.MAX_FILE_SIZE || 0
          ) /
            1024 /
            1024} MB`,
          success: false,
        });
        return;
      }
      /* Administrators can upload as many files as they want. other users are limited */
      if (
        user.role !== 'admin' &&
        user.file_count > +(process.env.MAX_FILE_COUNT || 1)
      ) {
        res.status(400).json({
          message:
            'You have uploaded too many files. Please delete some of your existing files before uploading more',
          success: false,
        });
        return;
      }

      /* Move the file */
      file.mv('../../public/images', async (e: Error) => {
        if (e) {
          log.error(e.message);
          res.status(500).json({
            message: e.message || 'An unknown error occured',
            success: false,
          });
        } else {
          const path = '';
          /* Update user information */
          user.file_count++;
          user.files.push(path);
          await user.save();
          /* Save the image model */

          res.json({
            fileName: file.name,
            filePath: path,
            message: 'File uploaded successfully',
            success: true,
          });
        }
      });
    }
  }
);

router.delete('/:id', (req: Request, res: Response): void => {
  res.send({
    message: 'Function not implemented',
    success: false,
  });
});

export default router;
