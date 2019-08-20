import { Router } from "express";
import crypto from "crypto";
import CSRF from "../../models/CSRF";

const router = Router();

// @router	GET /csrf
// @desc	  Retrieve a CSRF token
// @access	Public
router.get("/", async (req, res) => {
  const value = crypto.randomBytes(32).toString("hex");
  await new CSRF({
    value
  })
    .save()
    .catch(e =>
      res
        .status(500)
        .json({ success: false, message: "An unknown error occured" })
    );
  res.json({ success: true, message: "CSRF token retrieved", token: value });
});

// @router	DELETE /csrf/:token
// @desc	  Forcibly invalidate a token
// @access	Public
router.delete("/:token", (req, res) => {
  CSRF.findOne({ value: req.params.token })
    .then(csrf =>
      csrf.remove().then(() =>
        res.json({
          success: true,
          message: "CSRF token deleted successfully"
        })
      )
    )
    .catch(
      res.status(500).json({ success: false, message: "CSRF token not found" })
    );
});

export default router;
