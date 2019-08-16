import { Router } from "express";
import authorization from "../../../middleware/api/authorization";
import updateLastOnline from "../../../middleware/api/updateLastOnline";
import Topic from "../../../models/Topic";
import Post from "../../../models/Post";

const router = Router();
router.use("/", authorization);
router.use("/", updateLastOnline);

// @route   POST /forum/topic
// @desc    Create a new topic
// @access  Private
router.post("/", (req, res) => {});

// @route   GET /forum/topic/:id
// @desc    Retrieves the given topic
// @access  Private
router.get("/:id", (req, res) => {
  try {
    Topic.findById(req.params.id).then(topic => {
      if (!topic)
        res
          .status(403)
          .json({ sucess: false, message: "Resource was not found" });
      res
        .json({
          success: true,
          message: "entry successfully retreived",
          topic
        })
        .catch(e => {
          res
            .status(500)
            .json({ success: false, message: "An unknown error occured" });
        });
    });
  } catch (e) {
    res.status(404).json({ success: false, message: "Entry not found" });
  }
});

// @route   DELETE /forum/topic/:id
// @desc    Deletes the given topic
// @access  Private
router.delete("/:id", (req, res) => {
  Topic.findById(req.params.id).then(topic => {
    if (!topic) {
      res
        .status(403)
        .json({ sucess: false, message: "Resource was not found" });
    } else {
      let posts;
      /* Remove posts */
      posts.find({ topic: topic._id }).then(posts =>
        posts.forEach((e, i) => {
          e.remove();
          posts++;
        })
      );
      topic.remove().then(() =>
        res.json({
          success: true,
          message: "Topic deleted successfully",
          posts
        })
      );
    }
  });
});

// @route   PUT /forum/topic/:id
// @desc    Edits the given topic
// @access  Private
router.put("/:id", (req, res) => {});

export default router;
