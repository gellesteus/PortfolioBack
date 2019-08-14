import { Router } from "express";
import authorization from "../../../middleware/api/authorization";
import updateLastOnline from "../../../middleware/api/updateLastOnline";
import adminOnly from "../../../middleware/api/adminOnly";
import Category from "../../../models/Category";

const router = Router();

router.use("/", authorization);
router.use("/", updateLastOnline);

// @route   GET /forum/category
// @desc    Retrieve a list of categories
// @access  Private
router.get("/", (req, res) => {
  Category.find().then(categories =>
    res
      .json({
        success: true,
        message: "Categories retrieved successfully",
        categories
      })
      .catch(e => {
        res
          .status(500)
          .json({ success: false, message: "An unknown error occured" });
      })
  );
});

// @route   GET /forum/category/:id
// @desc    Retrieve a single category
// @access  Private
router.get("/:id", (req, res) => {
  Category.findOne({ _id: req.params.id }).then(category =>
    res
      .json({
        success: true,
        message: "Category retrieved successfully",
        category
      })
      .catch(e => {
        res
          .status(500)
          .json({ success: false, message: "Invalid category ID given" });
      })
  );
});

/* Create, update and delete routes are only able to be accessed by the admin */
router.use("/", adminOnly);

// @route   POST /forum/category
// @desc    Create a new category
// @access  Private
router.post("/", (req, res) => {});

// @route   PUT /forum/category
// @desc    Updates an existing category
// @access  Private
router.put("/:id", (req, res) => {});

// @route   DELETE /forum/category/:id
// @desc    Deletes the given category
// @access  Private
router.delete("/:id", (req, res) => {});

export default router;
