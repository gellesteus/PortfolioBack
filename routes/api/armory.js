import { Router } from "express";
import authorization from "../../middleware/api/authorization";
import updateLastOnline from "../../middleware/api/updateLastOnline";
import adminOnly from "../../middleware/api/adminOnly";
import Item from "../../models/Item";

const router = Router();

router.use("/", authorization);
router.use("/", updateLastOnline);

// @route   GET /armory
// @desc    Returns a list of equipment
// @access  Private
router.get("/", (req, res) => {});

// @route   GET /armory/:id
// @desc    Returns the given item
// @access  Private
router.get("/:id", (req, res) => {
  try {
    Item.findById(req.params.id).then(item => {
      if (!item)
        res
          .status(403)
          .json({ sucess: false, message: "Resource was not found" });
      res
        .json({
          success: true,
          message: "entry successfully retreived",
          item
        })
        .catch(e => {
          res.status(500).json({
            success: false,
            message: e.message || "An unknown error occured"
          });
        });
    });
  } catch (e) {
    res.status(404).json({ success: false, message: "Entry not found" });
  }
});

router.use("/", adminOnly);

// @route   POST /armory
// @desc    Creates a new item
// @access  Private
router.post("/", (req, res) => {});

// @route   PUT /armory
// @desc    Updates the given item
// @access  Private
router.put("/:id", (req, res) => {});

// @route   DELETE /armory
// @desc    Deletes the given item
// @route access
router.delete("/:id", (req, res) => {});

export default router;
