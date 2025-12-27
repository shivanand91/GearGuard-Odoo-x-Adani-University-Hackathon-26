import Equipment from "../models/Equipment.model.js";

export const createEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.create(req.body);
    res.status(201).json(equipment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.find().populate("assignedTeam");
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEquipmentById = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id).populate("assignedTeam");
    res.json(equipment);
  } catch (error) {
    res.status(404).json({ message: "Equipment not found" });
  }
};

export const updateEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(equipment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteEquipment = async (req, res) => {
  try {
    await Equipment.findByIdAndDelete(req.params.id);
    res.json({ message: "Equipment deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
