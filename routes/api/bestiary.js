import { Router } from "express";
import authorization from "../../middleware/api/authorization";
import updateLastOnline from "../../middleware/api/updateLastOnline";
import adminOnly from "../../middleware/api/adminOnly";
import Beast from "../../models/Beast";

const router = Router();

router.use("/", authorization);
router.use("/", updateLastOnline);

// @route   GET /bestiary
// @desc    Returns a list of beasts
// @access  Private
router.get("/", async (req, res) => {});

// @route   GET /bestiary/:id
// @desc    Returns the given beast
// @access  Private
router.get("/:id", (req, res) => {});

router.use("/", adminOnly);

// @route   POST /bestiary
// @desc    Create a new beast
// @access  Private
router.post("/", (req, res) => {});

// @route   PUT /bestiary/:id
// @desc    Update the given beast
// @access  Private
router.put("/:id", (req, res) => {});

// @route   DELETE /bestiary/:id
// @desc    Delete the given beast
// @access  Private
router.delete("/:id", (req, res) => {});

export default router;
