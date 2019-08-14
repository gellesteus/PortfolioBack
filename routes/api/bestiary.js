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
router.get("/", async (req, res) => {
  /* Pagination is done on the server side */
  const count = parseInt(req.query.count || 10);
  const page = (req.query.page || 1) - 1;
  const toSkip = page * count;
  const totalDocs = await Beast.estimatedDocumentCount();
  const pages = totalDocs / count;
  const sortOrder = req.query.sortOrder || 1;
  const sortCol = req.query.sortColumn || "_id";

  Beast.find({}, "name shortDesc longDesc _id", {
    skip: toSkip,
    limit: count,
    sort: { [sortCol]: sortOrder }
  })
    .then(rules => {
      res.json({
        success: true,
        page: page + 1,
        numberPerPage: count,
        pages,
        sortColumn: sortCol,
        ascending: sortOrder === 1,
        lastPage: page + 1 >= pages,
        message: "Monsters retrieved successfully",
        rules
      });
    })
    .catch(e => {
      res.status(500).json({
        success: false,
        message: e.message || "An unknown error occured"
      });
    });
});

// @route   GET /bestiary/:id
// @desc    Returns the given beast
// @access  Private
router.get("/:id", (req, res) => {
  try {
    Beast.findById(req.params.id).then(beast => {
      if (!beast)
        res
          .status(403)
          .json({ sucess: false, message: "Resource was not found" });
      res
        .json({
          success: true,
          message: "entry successfully retreived",
          beast
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
