import express from "express";
import {
  createEquipment,
  getAllEquipment,
  getEquipmentById,
  updateEquipment,
  deleteEquipment
} from "../controllers/equipment.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createEquipment);
router.get("/", protect, getAllEquipment);
router.get("/:id", protect, getEquipmentById);
router.put("/:id", protect, updateEquipment);
router.delete("/:id", protect, deleteEquipment);

export default router;
