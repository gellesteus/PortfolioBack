import { Router } from "express";
import authorization from "../../middleware/api/authorization";
import updateLastOnline from "../../middleware/api/updateLastOnline";
import Beast from "../../models/Beast";

const router = Router();

export default router;
