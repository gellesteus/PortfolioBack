import { Router } from "express";
import authorization from "../../middleware/api/authorization";
import updateLastOnline from "../../middleware/api/updateLastOnline";
import adminOnly from "../../middleware/api/adminOnly";
import Organizations from "../../models/Organization";

const router = Router();

router.get("/", (req, res) => {
  res.send("organization get");
});

/* Middleware for protected routes */
router.use("/", authorization);
router.use("/", updateLastOnline);

// @route   GET /organization/list
// @desc    Return a list of organizations
// @access  Protected
router.get("/list", async (req, res) => {
  /* Get values from query params */
  let page, count, known, docCount, query;
  if (page in req.query) {
    page = req.query.page - 1;
  } else {
    page = 0;
  }

  if (count in req.query) {
    count = req.query.count;
  } else {
    count = 10;
  }

  if (known in req.query) {
    known = req.query.known;
  } else {
    known = false;
  }

  try {
    if (known) {
      docCount = await Organizations.count();
      query = await Organizations.find({}, null, {
        skip: page * count,
        take: count
      }).exec();
    } else {
      docCount = Organizations.count({ known: true });
      query = await Organizations.find({ known: true }, null, {
        skip: page * count,
        take: count
      }).exec();
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e
    });
  }

  const pages = docCount / count;
  const lastPage = page + 1 >= pages;
  const resultCount = docCount - count * pages;
  /* Send the response */
  res.json({
    success: true,
    message: "Retrieved successfully",
    lastPage,
    pages,
    page,
    results: resultCount,
    numberPerPage: count,
    organizations: query
  });
});

router.use("/", adminOnly);
// @route   POST /organization
// @desc    Creates a new organization
// @access  Admin only
router.post("/", (req, res) => {});

export default router;
