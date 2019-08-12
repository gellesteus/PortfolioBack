import { Router } from "express";
import User from "../../models/User";
import authorization from "../../middleware/api/authorization";
import updateLastOnline from "../../middleware/api/updateLastOnline";
import crypto from "crypto";
import bcrypt from "bcryptjs";

const router = Router();

// @route   GET /user/:token
// @desc    Return the user associated with a token
// @access  Public
router.get("/:token", (req, res) => {
  const token = req.params.token;
  User.findOne({
    sessionToken: token
  }).then(user => {
    if (user) {
      res.json({
        success: true,
        username: user.username,
        sessionToken: user.sessionToken,
        email: user.email,
        id: user._id
      });
    } else {
      /* Token not found */
      res.status(404).json({
        success: false,
        message: `Token ${req.params.token} not found`
      });
    }
  });
});

// @route   POST /user/login
// @desc    Logs a user in if the credentials are correct
// @access  Public
router.post("/login", (req, res) => {
  /* Check the credentials */
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(403).json({
      success: false,
      message: "Please enter your email and password"
    });
  } else {
    User.findOne({ email: email })
      .then(user => {
        if (user) {
          bcrypt.compare(password, user.password).then(same => {
            if (same) {
              const token = crypto.randomBytes(20).toString("hex");
              /* Update the token and last online values */
              user.sessionToken = token;
              user.lastOnline = Date.now();
              user.save().then(() =>
                /* Send the response */
                res.json({
                  success: true,
                  username: user.username,
                  email: user.email,
                  sessionToken: token,
                  mustChangePassword: user.mustChangePassword
                })
              );
            } else {
              res.status(403).json({
                success: false,
                message: "Invalid username or password"
              });
            }
          });
        } else {
          res.status(403).json({
            success: false,
            message: "Invalid username or password"
          });
        }
      })
      .catch(e =>
        res.status(403).json({
          success: false,
          message: "Invalid username or password"
        })
      );
  }
});

// @route   POST /user
// @desc    Create a user
// @access  Public
router.post("/", (req, res) => {
  new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    lastOnline: Date.now
  })
    .save()
    .then(user =>
      res.json({
        success: true,
        username: user.username,
        sessionToken: user.session_token,
        email: user.email,
        id: user._id
      })
    );
});

// @route   POST /pass
// @desc    Request a password reset
// @access  Public
router.post("/pass/:id", (req, res) => {
  User.findOne({ email: req.params.id })
    .then(user => {
      /* Generate the new password */
      const password = crypto.randomBytes(6).toString("hex");
      bcrypt.genSalt(10, (err, res) =>
        bcrypt.hash(password, res, (err, res) => {
          user.password = password;
          user
            .save()
            .then(() =>
              res.json({ success: true, message: "Password reset requested" })
            );
        })
      );
      /* Send the email with the password to the user */
      /* Update the requirement to change the password on the next login */
    })
    .catch(e =>
      res.json({
        success: false,
        message: "Username not found"
      })
    );
});

/* Middleware for protected routes */
router.use("/", authorization);
router.use("/", updateLastOnline);

// @route   POST /user
// @desc    Update a user's password
// @access  Protected
router.post("/:user", (req, res) => {
  User.findOne({
    _id: req.params.user
  }).then(user => {
    if (user) {
      user.password = req.body.password;
      user.mustChangePassword = false;
      user.save().then(user =>
        res.send({
          success: true,
          username: user.username,
          sessionToken: user.session_token,
          email: user.email,
          id: user._id
        })
      );
    } else {
      res.status(404).json({
        success: false,
        message: `User ${req.params.user} not found`
      });
    }
  });
});

// @route 	GET /user
// @desc 	Retrieves all information about a user
// @access 	Protected
router.get("/", (req, res) => {
  const token = req.get("authorization");
  User.findOne({ sessionToken: token }).then(user => {
    if (user) {
		res.json({user)}
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  });
});

export default router;
