import express from "express";
import {
  createRequest,
  getAllRequests,
  updateRequest
} from "../controllers/request.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createRequest);
router.get("/", protect, getAllRequests);
router.put("/:id", protect, updateRequest);

export default router;
