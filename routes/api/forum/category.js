import { Router } from "express";
import authorization from "../../../middleware/api/authorization";
import updateLastOnline from "../../../middleware/api/updateLastOnline";
import adminOnly from "../../../middleware/api/adminOnly";
import Category from "../../../models/Category";
import Post from "../../../models/Post";
import Topic from "../../../models/Topic";

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
router.post("/", (req, res) => {
  new Category({
    name: req.body.name,
    desc: req.body.desc
  })
    .save()
    .then(category => {
      res.json({
        success: true,
        message: "Category created successfully"
      });
    })
    .catch(e => {
      res.status(500).json({
        success: false,
        message: "An unknown error occured"
      });
    });
});

// @route   PUT /forum/category
// @desc    Updates an existing category
// @access  Private
router.put("/:id", (req, res) => {
  try {
    Category.findById(req.params.id)
      .then(cat => {
        cat.name = req.body.name || cat.name;
        cat.desc = req.body.desc || cat.name;
        cat
          .save()
          .then(cat => {
            res.json({
              success: true,
              message: "Category updated successfully",
              category: cat
            });
          })
          .catch(e => {
            res.status(500).json({
              success: false,
              message: "An unknown error occured"
            });
          });
      })
      .catch(e => {
        res
          .status(500)
          .json({ success: false, message: "An unknown error occured" });
      });
  } catch (e) {
    res.status(404).json({ success: false, message: "Category not found" });
  }
});

// @route   DELETE /forum/category/:id
// @desc    Deletes the given category
// @access  Private
router.delete("/:id", async (req, res) => {
  try {
    let posts, threads;
    const cat = await Category.findById(req.params.id);
    /* Delete the posts */
    const postList = await Post.find({ category: cat._id });
    postList.forEach(element => {
      posts++;
      element.remove();
    });
    /* Delete the threads */
    const topicList = await Topic.find({ category: cat._id });
    topicList.forEach(element => {
      threads++;
      element.remove();
    });
    /* Delete the category */
    cat
      .remove()
      .then(() => {
        res.json({
          success: true,
          message: "Category deleted successfully",
          posts,
          threads
        });
      })
      .catch(e => {
        res
          .status(500)
          .json({ success: false, message: "An unknown error occured" });
      });
  } catch (e) {
    res.status(404).json({ success: false, message: "Category not found" });
  }
});

export default router;
