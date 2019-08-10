<<<<<<< HEAD
import { Router } from "express";
import authorization from "../../middleware/api/authorization";
import updateLastOnline from "../../middleware/api/updateLastOnline";
import Rule from "../../models/Rule";

const router = Router();

router.get("/", (req, res) => {
  res.send("Rule retrieved");
=======
import { Router } from 'express';
import Rule from '../../models/Rule';

const router = Router();

router.get('/', (req, res) => {
	res.send('rule get');
>>>>>>> master
});

export default router;
