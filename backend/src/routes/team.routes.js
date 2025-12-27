import express from "express";
import {
  createTeam,
  getTeams
} from "../controllers/team.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createTeam);
router.get("/", protect, getTeams);

export default router;
