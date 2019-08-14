import { Router } from "express";
import authorization from "../../middleware/api/authorization";
import updateLastOnline from "../../middleware/api/updateLastOnline";
import adminOnly from "../../middleware/api/adminOnly";
import Character from "../../models/Character";

const router = Router();

router.use("/", authorization);
router.use("/", updateLastOnline);

// @route	GET /character
// @desc	Returns a list of characters from the list
// @access	Private
router.get("/", async (req, res) => {
  const count = parseInt(req.query.count || 10);
  const page = (req.query.page || 1) - 1;
  const toSkip = page * count;
  const totalDocs = await Character.estimatedDocumentCount();
  const pages = totalDocs / count;
  const sortOrder = req.query.sortOrder || 1;
  const sortCol = req.query.sortColumn || "_id";

  Character.find({}, "", {
    skip: toSkip,
    limit: count,
    sort: { [sortCol]: sortOrder }
  })
    .then(chars => {
      res.json({
        success: true,
        page: page + 1,
        numberPerPage: count,
        pages,
        sortColumn: sortCol,
        ascending: sortOrder === 1,
        lastPage: page + 1 >= pages,
        message: "Characters retrieved successfully",
        characters: chars
      });
    })
    .catch(e => {
      res
        .status(500)
        .json({ success: false, message: "An unknown error occured" });
    });
});

// @route	GET /character/:id
// @desc	Returns the given character
// @access	Private
router.get("/:id", (req, res) => {
  try {
    Character.findById(req.params.id)
      .then(char => {
        res.json({
          success: true,
          message: "Character retrieved successfully",
          character: char
        });
      })
      .catch(e => {
        res
          .status(500)
          .json({ success: false, message: "An unknown error occured" });
      });
  } catch (e) {
    res
      .status(500)
      .json({ success: false, message: "Character with given id not found" });
  }
});

/* Create, update and delete routes are admin only */
router.use("/", adminOnly);

// @route	POST /character
// @desc	Creates a new character
// @access	Private
router.post("/", (req, res) => {});

// @router	PUT /character/:id
// @desc	Updates the given character
// @access	Private
router.put("/:id", (req, res) => {});

// @router	DELETE /character/:id
// @desc	Deletes the given character
// @access	Private
router.delete("/:id", (req, res) => {});

export default router;
