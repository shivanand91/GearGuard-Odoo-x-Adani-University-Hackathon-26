import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true
    },

    description: {
      type: String
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

    scheduledDate: {
      type: Date
    },

    duration: {
      type: Number
    }
  },
  { timestamps: true }
);

export default mongoose.model("Request", requestSchema);
