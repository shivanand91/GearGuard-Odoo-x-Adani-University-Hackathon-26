import Request from "../models/Request.model.js";
import Equipment from "../models/Equipment.model.js";

export const createRequest = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.body.equipment);

    const request = await Request.create({
      ...req.body,
      team: equipment.assignedTeam
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find()
      .populate("equipment")
      .populate("team")
      .populate("assignedTo");

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRequest = async (req, res) => {
  try {
    const request = await Request.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(request);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
