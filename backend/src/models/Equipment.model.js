import mongoose from "mongoose";

const equipmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    serialNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    category: {
      type: String,
      enum: ["Electrical", "Mechanical", "IT", "Other"],
      default: "Other"
    },

    location: {
      type: String,
      trim: true
    },

    department: {
      type: String,
      trim: true
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    assignedTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team"
    },

    purchaseDate: {
      type: Date
    },

    warranty: {
      type: String
    },

    status: {
      type: String,
      enum: ["Active", "Scrap"],
      default: "Active"
    },

    notes: {
      type: String
    }
  },
  { timestamps: true }
);

export default mongoose.model("Equipment", equipmentSchema);
