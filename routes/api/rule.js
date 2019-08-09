import { Router } from "express";
import authorization from "../../middleware/api/authorization";
import updateLastOnline from "../../middleware/api/updateLastOnline";
import Rule from "../../models/Rule";

const router = Router();

router.get("/", (req, res) => {
  res.send("Rule retrieved");
});

export default router;
