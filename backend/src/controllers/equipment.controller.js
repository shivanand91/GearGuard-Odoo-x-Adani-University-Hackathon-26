import Equipment from "../models/Equipment.model.js";
import Request from "../models/Request.model.js";
import Team from "../models/Team.model.js";

// GET all equipment with filtering and search
export const getAllEquipment = async (req, res) => {
  try {
    const { search, category, department, status, sortBy } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { serialNumber: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } }
      ];
    }

    if (category) query.category = category;
    if (department) query.department = department;
    if (status) query.status = status;

    let equipmentQuery = Equipment.find(query)
      .populate("assignedTeam", "name")
      .populate("assignedTo", "name email");

    if (sortBy === "recent") {
      equipmentQuery = equipmentQuery.sort({ createdAt: -1 });
    } else if (sortBy === "name") {
      equipmentQuery = equipmentQuery.sort({ name: 1 });
    }

    const equipment = await equipmentQuery;

    res.status(200).json({
      success: true,
      data: equipment,
      count: equipment.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET single equipment with related requests
export const getEquipmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const equipment = await Equipment.findById(id)
      .populate("assignedTeam", "name members")
      .populate("assignedTo", "name email");

    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    // Get all related requests
    const requests = await Request.find({ equipment: id })
      .populate("team", "name")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { ...equipment.toObject(), requests }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE new equipment
export const createEquipment = async (req, res) => {
  try {
    const { name, serialNumber, category, location, department, assignedTeam, assignedTo, purchaseDate, warranty } = req.body;

    // Check if serial number already exists
    const existing = await Equipment.findOne({ serialNumber });
    if (existing) {
      return res.status(400).json({ message: "Equipment with this serial number already exists" });
    }

    // Convert empty strings to null for ObjectId fields
    const data = {
      name,
      serialNumber,
      category,
      location,
      department,
      assignedTeam: assignedTeam ? assignedTeam : null,
      assignedTo: assignedTo ? assignedTo : null,
      purchaseDate,
      warranty,
      status: "Active"
    };

    const equipment = await Equipment.create(data);

    const populatedEquipment = await equipment.populate("assignedTeam", "name").populate("assignedTo", "name email");

    res.status(201).json({
      success: true,
      message: "Equipment created successfully",
      data: populatedEquipment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE equipment
export const updateEquipment = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Convert empty strings to null for ObjectId fields
    const updateData = { ...req.body };
    if (updateData.assignedTeam === "") updateData.assignedTeam = null;
    if (updateData.assignedTo === "") updateData.assignedTo = null;

    const equipment = await Equipment.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    }).populate("assignedTeam", "name").populate("assignedTo", "name email");

    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    res.status(200).json({
      success: true,
      message: "Equipment updated successfully",
      data: equipment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE equipment
export const deleteEquipment = async (req, res) => {
  try {
    const { id } = req.params;
    const equipment = await Equipment.findByIdAndDelete(id);

    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    res.status(200).json({
      success: true,
      message: "Equipment deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET equipment by department
export const getEquipmentByDepartment = async (req, res) => {
  try {
    const { department } = req.params;
    const equipment = await Equipment.find({ department })
      .populate("assignedTeam", "name")
      .populate("assignedTo", "name email");

    res.status(200).json({
      success: true,
      data: equipment,
      count: equipment.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET equipment by employee
export const getEquipmentByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const equipment = await Equipment.find({ assignedTo: employeeId })
      .populate("assignedTeam", "name")
      .populate("assignedTo", "name email");

    res.status(200).json({
      success: true,
      data: equipment,
      count: equipment.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET maintenance requests for specific equipment (Smart button)
export const getEquipmentMaintenance = async (req, res) => {
  try {
    const { id } = req.params;

    // Verify equipment exists
    const equipment = await Equipment.findById(id);
    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    // Get all requests for this equipment
    const requests = await Request.find({
      equipment: id,
      status: { $ne: "Repaired" }
    })
      .populate("team", "name")
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      equipment: {
        id: equipment._id,
        name: equipment.name,
        serialNumber: equipment.serialNumber
      },
      requests,
      count: requests.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark equipment as scrap
export const markEquipmentAsScrap = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const equipment = await Equipment.findByIdAndUpdate(
      id,
      { status: "Scrap", notes },
      { new: true }
    ).populate("assignedTeam", "name").populate("assignedTo", "name email");

    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    res.status(200).json({
      success: true,
      message: "Equipment marked as scrap",
      data: equipment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
