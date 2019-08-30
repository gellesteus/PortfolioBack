import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { Router } from 'express';
import { Request, Response } from 'express';
import * as log from '../../logging/logging';
import adminOnly from '../../middleware/api/adminOnly';
import authorization from '../../middleware/api/authorization';
import updateLastOnline from '../../middleware/api/updateLastOnline';
import User from '../../models/User';

const router = Router();

// @route   POST /user/login
// @desc    Logs a user in if the credentials are correct
// @access  Public
router.post('/login', (req: Request, res: Response): void => {
  /* Check the credentials */
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({
      message: 'Please enter your email and password',
      success: false
    });
  } else {
    User.findOne({ email })
      .then(user => {
        if (user) {
          bcrypt.compare(password, user.password).then(same => {
            if (same) {
              const token = crypto.randomBytes(32).toString('hex');
              /* Update the token and last online values */
              user.session_token = token;
              user.last_online = new Date();
              user.save().then(() =>
                /* Send the response */
                res.json({
                  message: 'User logged in successfully',
                  success: true,
                  user
                })
              );
            } else {
              res.status(403).json({
                message: 'Invalid username or password',
                success: false
              });
            }
          });
        } else {
          res.status(403).json({
            message: 'Invalid username or password',
            success: false
          });
        }
      })
      .catch(e =>
        res.status(403).json({
          message: 'Invalid username or password',
          success: false
        })
      );
  }
});

// @route   POST /user
// @desc    Create a user
// @access  Public
router.post(
  '/',
  async (req: Request, res: Response): Promise<void> => {
    const salt = await bcrypt.genSalt(10);
    const pass = await bcrypt.hash(req.body.password, salt);
    new User({
      email: req.body.email,
      last_online: new Date(),
      password: pass,
      username: req.body.username
    })
      .save()
      .then(user =>
        res.json({
          message: 'User created successfully',
          success: true,
          user
        })
      )
      .catch(e =>
        res.status(500).json({
          message: e.message || 'an unknown error occured',
          success: false
        })
      );
  }
);

// @route   POST /pass
// @desc    Request a password reset
// @access  Public
router.post('/pass', (req: Request, res: Response): void => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        /* Generate the new password */
        const password = crypto.randomBytes(6).toString('hex');
        bcrypt.genSalt(10, (err: Error, result: string) =>
          bcrypt.hash(password, result, (e: Error, r: string) => {
            if (e) {
              log.error(e.message);
              res.status(500).json({
                message: 'An unknown error occured',
                success: false
              });
              return;
            }

            user.password = r;
            user.session_token = null;
            user.must_change_password = true;

            user
              .save()
              .then(() =>
                res.json({
                  message: 'Password reset request accepted',
                  success: true
                })
              )
              .catch((error: Error) => {
                log.error(error.message);
                res.status(500).json({
                  message: 'An unknown error occured',
                  success: false
                });
              });
          })
        );
        /* Send the email with the password to the user */
        /* Update the requirement to change the password on the next login */
      } else {
        res.status(404).json({
          message: 'The requested resource was not found on the server',
          success: false
        });
      }
    })
    .catch((e: Error) =>
      res.status(404).json({
        message: 'Username not found',
        success: false
      })
    );
});

/* Middleware for protected routes */
router.use('/', authorization);
router.use('/', updateLastOnline);

// @route   PUT /user/pass
// @desc    Update a user's password
// @access  Private
router.put(
  '/pass',
  async (req: Request, res: Response): Promise<void> => {
    const token = req.get('authorization');
    const salt = await bcrypt.genSalt(10);
    const pass = await bcrypt.hash(req.body.password, salt);
    User.findOne({
      session_token: token
    }).then(user => {
      if (user) {
        if (!bcrypt.compareSync(req.body.oldPassword, user.password)) {
          res.status(400).json({
            message: 'An invalid password was entered',
            success: false
          });
        }
        user.password = pass;
        /* Invalidate the user's session token */
        user.session_token = null;
        user.must_change_password = false;
        user.save().then(updUser =>
          res.send({
            message: 'Password updated successfully',
            success: true,
            user: updUser
          })
        );
      } else {
        res.status(404).json({
          message: 'User not found',
          success: false
        });
      }
    });
  }
);

// @route   POST /user/logout
// @desc    Logs a user in if the credentials are correct
// @access  Private
router.post('/logout', (req: Request, res: Response): void => {
  const token = req.get('authorization');
  User.findOne({ session_token: token })
    .then(user => {
      if (user) {
        user.session_token = null;
        user.save();
        res.json({
          message: 'User logged out successfully',
          success: true
        });
      } else {
        res.status(403).json({
          message: 'User not found',
          success: false
        });
      }
    })
    .catch((e: Error) =>
      res.status(500).json({
        message: 'An unknown error occured',
        success: false
      })
    );
});

// @route 	GET /user
// @desc 	Retrieves all information about a user
// @access 	Private
router.get('/', (req: Request, res: Response): void => {
  const token = req.get('authorization');
  User.findOne({ session_token: token }).then(user => {
    if (user) {
      res.json({
        message: 'user retrieved successfully',
        success: true,
        user
      });
    } else {
      res.status(404).json({
        message: 'User not found',
        success: false
      });
    }
  });
});

router.use('/', adminOnly);

// @Router 	DELETE /user/:id
// @Desc	Deletes the given user
// @Access	Private
router.delete('/:id', (req: Request, res: Response): void => {
  User.findByIdAndDelete(req.params.id)
    .then(() =>
      res.json({
        message: 'User deleted successfully',
        success: true
      })
    )
    .catch(e =>
      res.status(404).json({
        message: 'The requested resource was not found on the server',
        success: false
      })
    );
});

// @Router 	PUT /user/:id
// @Desc	Updates the given user
// @Access	Private
router.put('/:id', (req, res) => {
  User.findById(req.params.id)
    .then(user => {
      if (user) {
        user.username = req.body.username || user.username;
        user.role = req.body.role || user.role;
        user.session_token = null;
        user
          .save()
          .then(updUser =>
            res.json({
              message: 'User updated successfully',
              success: true,
              user: updUser
            })
          )
          .catch(e =>
            res.status(500).json({
              message: 'An unknown error occured',
              success: false
            })
          );
      } else {
        res.status(404).json({
          message: 'The requested resource was not found on the server',
          success: false
        });
      }
    })
    .catch(e => {
      log.error(e.message);
      res.status(404).json({
        message: 'The requested resource was not found on the server',
        success: false
      });
    });
});

export default router;
