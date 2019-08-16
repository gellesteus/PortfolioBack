import { Router } from "express";
import authorization from "../../../middleware/api/authorization";
import updateLastOnline from "../../../middleware/api/updateLastOnline";
import Topic from "../../../models/Topic";
import Post from "../../../models/Post";
import User from "../../../models/User";

const router = Router();
router.use("/", authorization);
router.use("/", updateLastOnline);

// @route   POST /forum/topic
// @desc    Create a new topic
// @access  Private
router.post("/", async (req, res) => {
  const user = await User.findOne({ sessionToken: req.get("authorization") });
  new Topic({
    title: req.body.title,
    category: req.body.category
  })
    .save()
    .then(topic => {
      /* Create the body */
      new Post({
        body: req.body.body,
        category: topic.category,
        topic: topic._id,
        poster: user._id
      })
        .save()
        .then(post => {
          topic.body = post._id;
          topic
            .save()
            .then(topic =>
              res.json({
                success: true,
                messaage: "Topic created successfully",
                topic
              })
            )
            .catch(e =>
              res
                .status(500)
                .json({
                  success: false,
                  message: e.message || "an unknown error occured"
                })
            );
        })
        .catch(e =>
          res
            .status(500)
            .json({
              success: false,
              message: e.message || "an unknown error occured"
            })
        );
    })
    .catch(e =>
      res
        .status(500)
        .json({
          success: false,
          message: e.message || "an unknown error occured"
        })
    );
});

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
router.put("/:id", (req, res) => {
  Topic.findById(req.params.id).then(async topic => {
    if (!topic) {
      res.status(403).json({ success: false, message: "Topic not found" });
    } else {
      topic.title = req.body.title || topic.title;
      if (req.body.body) {
        const post = await Post.findById(topic.body);
        post.body = req.body.body || post.body;
        post.save().catch(e => {
          res
            .status(500)
            .json({ success: false, message: "An unknown error occured" });
        });
      }
      topic
        .save()
        .then(topic =>
          res.json({
            success: true,
            message: "Topic updated successfully",
            topic
          })
        )
        .catch(e =>
          res.status(500).json({
            success: false,
            message: e.message || "An unknown error occured"
          })
        );
    }
  });
});

export default router;
