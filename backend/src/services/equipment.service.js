import Equipment from "../models/Equipment.model.js";

export const createEquipmentService = async (data) => {
  return await Equipment.create(data);
};

export const getAllEquipmentService = async () => {
  return await Equipment.find().populate("assignedTeam");
};

export const getEquipmentByIdService = async (id) => {
  return await Equipment.findById(id).populate("assignedTeam");
};

export const updateEquipmentService = async (id, data) => {
  return await Equipment.findByIdAndUpdate(id, data, { new: true });
};

export const deleteEquipmentService = async (id) => {
  return await Equipment.findByIdAndDelete(id);
};
