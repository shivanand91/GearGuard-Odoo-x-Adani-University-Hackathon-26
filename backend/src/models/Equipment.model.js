import mongoose from "mongoose";

const equipmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    serialNumber: {
      type: String,
      required: true,
      unique: true
    },

    category: {
      type: String,
      enum: ["Electrical", "Mechanical", "IT", "Other"]
    },

    location: {
      type: String
    },

    assignedTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team"
    },

    status: {
      type: String,
      enum: ["Active", "Scrap"],
      default: "Active"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Equipment", equipmentSchema);
