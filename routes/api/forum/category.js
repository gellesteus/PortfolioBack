import { Router } from "express";
import authorization from "../../../middleware/api/authorization";
import updateLastOnline from "../../../middleware/api/updateLastOnline";
import adminOnly from "../../../middleware/api/adminOnly";
import Category from "../../../models/Category";

const router = Router();

/* All category routes are protected by the admin middleware in addition to the normal middleware */
router.use("/", authorization);
router.use("/", updateLastOnline);
router.use("/", adminOnly);

// @route   POST /forum/category
// @desc    Create a new category
// @access  Private
router.post("/", (req, res) => {});

// @route   GET /forum/category/:id
// @desc    Retrieves the given category
// @access  Private
router.get("/:id", (req, res) => {});

// @route   DELETE /forum/category/:id
// @desc    Deletes the given category
// @access  Private
router.delete("/:id", (req, res) => {});

// @route   UPDATE /forum/category/:id
// @desc    Edits the given category
// @access  Private
router.update("/:id", (req, res) => {});

export default router;
