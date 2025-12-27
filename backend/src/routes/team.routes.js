import express from "express";
import {
  createTeam,
  getTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
  addTeamMember,
  removeTeamMember,
  getTeamMembers
} from "../controllers/team.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// CRUD operations
router.post("/", protect, createTeam);
router.get("/", protect, getTeams);
router.get("/:id", protect, getTeamById);
router.put("/:id", protect, updateTeam);
router.delete("/:id", protect, deleteTeam);

// Member management
router.get("/:id/members", protect, getTeamMembers);
router.post("/:id/members", protect, addTeamMember);
router.delete("/:id/members/:memberId", protect, removeTeamMember);

export default router;
