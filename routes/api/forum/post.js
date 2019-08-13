import { Router } from "express";
import authorization from "../../../middleware/api/authorization";
import updateLastOnline from "../../../middleware/api/updateLastOnline";
import Post from "../../../models/Post";
import User from "../../../models/User";
const router = Router();
router.use("/", authorization);
router.use("/", updateLastOnline);

// @route   POST /forum/post
// @desc    Create a new post
// @access  Private
router.post("/", (req, res) => {});

// @route   GET /forum/post/:id
// @desc    Retrieves the given post
// @access  Private
router.get("/:id", (req, res) => {});

// @route   DELETE /forum/post/:id
// @desc    Deletes the given post
// @access  Private
router.delete("/:id", async (req, res) => {
  const token = req.get("authorization");
  try {
    const user = await User.findOne({ sessionToken: token });
  } catch (e) {
    res
      .status(500)
      .json({ success: false, message: "An unknown error has occured" });
  }
  Post.findOneByID(req.params.id)
    .then(async post => {
      /* Check validation. Can only be done by moderators of the category, admins and the user that made the post */
      try {
        const canDelete =
          user.role === "admin" ||
          post.userId === user._id ||
          user._id in
            (await Category.findOne({ _id: post.category })).moderators;
      } catch (e) {
        res
          .status(500)
          .json({ success: false, message: "An unknown error has occured" });
      }

      if (!canDelete) {
        res.status(403).json({
          success: false,
          message: "You do not have authorization to perform this action"
        });
      } else {
        post.delete();
        res.json({ success: true, message: "Post deleted successfully" });
      }

      /* Delete the post */
    })
    .catch(e => {
      res.status(404).json({ success: false, message: "Post does not exist" });
    });
});

// @route   UPDATE /forum/post/:id
// @desc    Edits the given post
// @access  Private
router.update("/:id", (req, res) => {});
export default router;
