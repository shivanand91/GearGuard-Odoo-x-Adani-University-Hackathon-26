import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["ADMIN", "TECHNICIAN", "USER"],
      default: "USER"
    },

    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team"
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
