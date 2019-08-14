import { Router } from "express";
import authorization from "../../../middleware/api/authorization";
import updateLastOnline from "../../../middleware/api/updateLastOnline";
import Topic from "../../../models/Topic";

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
router.delete("/:id", (req, res) => {});

// @route   PUT /forum/topic/:id
// @desc    Edits the given topic
// @access  Private
router.put("/:id", (req, res) => {});

export default router;
