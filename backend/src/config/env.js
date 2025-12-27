import dotenv from "dotenv";

dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/gearguard",
  NODE_ENV: process.env.NODE_ENV || "development",
  JWT_SECRET: process.env.JWT_SECRET || "gearguard_super_secret_jwt_key_2025",
  JWT_EXPIRE: process.env.JWT_EXPIRE || "7d"
};
