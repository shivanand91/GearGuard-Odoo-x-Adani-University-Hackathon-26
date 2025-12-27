import Request from "../models/Request.model.js";
import Equipment from "../models/Equipment.model.js";

export const createRequestService = async (data) => {
  const equipment = await Equipment.findById(data.equipment);

  if (!equipment) throw new Error("Equipment not found");

  return await Request.create({
    ...data,
    team: equipment.assignedTeam
  });
};

export const getAllRequestsService = async () => {
  return await Request.find()
    .populate("equipment")
    .populate("team")
    .populate("assignedTo");
};

export const updateRequestService = async (id, data) => {
  return await Request.findByIdAndUpdate(id, data, { new: true });
};
