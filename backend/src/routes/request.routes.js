import express from "express";
import {
  createRequest,
  getAllRequests,
  getRequestById,
  updateRequest,
  deleteRequest,
  assignRequest,
  changeStatus,
  getRequestsByTeam,
  getPreventiveRequests,
  getRequestAnalytics
} from "../controllers/request.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// CRUD operations
router.post("/", protect, createRequest);
router.get("/", protect, getAllRequests);
router.get("/:id", protect, getRequestById);
router.put("/:id", protect, updateRequest);
router.delete("/:id", protect, deleteRequest);

// Action routes
router.put("/:id/assign", protect, assignRequest);
router.put("/:id/status", protect, changeStatus);

// Filtering routes
router.get("/team/:teamId", protect, getRequestsByTeam);
router.get("/preventive/calendar", protect, getPreventiveRequests);

// Analytics/Reports
router.get("/analytics/dashboard", protect, getRequestAnalytics);

export default router;
