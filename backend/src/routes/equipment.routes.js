import express from "express";
import {
  createEquipment,
  getAllEquipment,
  getEquipmentById,
  updateEquipment,
  deleteEquipment,
  getEquipmentByDepartment,
  getEquipmentByEmployee,
  getEquipmentMaintenance,
  markEquipmentAsScrap
} from "../controllers/equipment.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// CRUD operations
router.post("/", protect, createEquipment);
router.get("/", protect, getAllEquipment);

// Filtering routes - specific routes before :id
router.get("/department/:department", protect, getEquipmentByDepartment);
router.get("/employee/:employeeId", protect, getEquipmentByEmployee);

// Smart button - maintenance requests for equipment
router.get("/:id/maintenance", protect, getEquipmentMaintenance);

// Mark as scrap
router.put("/:id/scrap", protect, markEquipmentAsScrap);

// Generic CRUD with ID - must be last
router.get("/:id", protect, getEquipmentById);
router.put("/:id", protect, updateEquipment);
router.delete("/:id", protect, deleteEquipment);

export default router;
