import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      trim: true
    },

    equipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Equipment",
      required: true
    },

    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team"
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    type: {
      type: String,
      enum: ["Corrective", "Preventive"],
      default: "Corrective"
    },

    status: {
      type: String,
      enum: ["New", "In Progress", "Repaired", "Scrap"],
      default: "New"
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium"
    },

    scheduledDate: {
      type: Date
    },

    duration: {
      type: Number,
      default: 0
    },

    isOverdue: {
      type: Boolean,
      default: false
    },

    notes: {
      type: String
    }
  },
  { timestamps: true }
);

export default mongoose.model("Request", requestSchema);
