import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import equipmentRoutes from "./routes/equipment.routes.js";
import requestRoutes from "./routes/request.routes.js";
import teamRoutes from "./routes/team.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/equipment", equipmentRoutes);
app.use("/api/request", requestRoutes);
app.use("/api/team", teamRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ success: true, message: "API running" });
});

// ❗ Error middleware LAST
app.use(errorHandler);

export default app;
