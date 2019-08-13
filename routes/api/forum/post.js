import { Router } from "express";
import authorization from "../../../middleware/api/authorization";
import updateLastOnline from "../../../middleware/api/updateLastOnline";
import Post from "../../../models/Post";

const router = Router();

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
router.delete("/:id", (req, res) => {});

// @route   UPDATE /forum/post/:id
// @desc    Edits the given post
// @access  Private
router.update("/:id", (req, res) => {});
export default router;
