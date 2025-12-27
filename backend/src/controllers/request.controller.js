import Request from "../models/Request.model.js";
import Equipment from "../models/Equipment.model.js";
import User from "../models/User.model.js";

// CREATE request with auto-fill logic
export const createRequest = async (req, res) => {
  try {
    const { subject, description, equipment, type, priority, scheduledDate, createdBy } = req.body;

    // Fetch equipment to auto-fill team
    const equipmentData = await Equipment.findById(equipment);
    if (!equipmentData) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    // Create request with auto-filled team
    const request = await Request.create({
      subject,
      description,
      equipment,
      team: equipmentData.assignedTeam,
      type,
      priority,
      scheduledDate,
      createdBy,
      status: "New"
    });

    const populatedRequest = await request.populate([
      { path: "equipment", select: "name serialNumber" },
      { path: "team", select: "name" },
      { path: "assignedTo", select: "name email" },
      { path: "createdBy", select: "name email" }
    ]);

    res.status(201).json({
      success: true,
      message: "Request created successfully",
      data: populatedRequest
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET all requests with filtering
export const getAllRequests = async (req, res) => {
  try {
    const { search, status, type, team, priority, sortBy } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { subject: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    if (status) query.status = status;
    if (type) query.type = type;
    if (team) query.team = team;
    if (priority) query.priority = priority;

    let requestQuery = Request.find(query)
      .populate("equipment", "name serialNumber category")
      .populate("team", "name")
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    if (sortBy === "recent") {
      requestQuery = requestQuery.sort({ createdAt: -1 });
    } else if (sortBy === "scheduled") {
      requestQuery = requestQuery.sort({ scheduledDate: 1 });
    } else if (sortBy === "priority") {
      requestQuery = requestQuery.sort({ priority: -1 });
    }

    const requests = await requestQuery;

    res.status(200).json({
      success: true,
      data: requests,
      count: requests.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET single request
export const getRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await Request.findById(id).populate([
      { path: "equipment", select: "name serialNumber category" },
      { path: "team", select: "name members" },
      { path: "assignedTo", select: "name email" },
      { path: "createdBy", select: "name email" }
    ]);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json({
      success: true,
      data: request
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE request
export const updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Update isOverdue if scheduledDate has passed
    if (updateData.scheduledDate && updateData.status !== "Repaired") {
      updateData.isOverdue = new Date(updateData.scheduledDate) < new Date();
    }

    const request = await Request.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    }).populate([
      { path: "equipment", select: "name serialNumber" },
      { path: "team", select: "name" },
      { path: "assignedTo", select: "name email" },
      { path: "createdBy", select: "name email" }
    ]);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json({
      success: true,
      message: "Request updated successfully",
      data: request
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE request
export const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await Request.findByIdAndDelete(id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json({
      success: true,
      message: "Request deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ASSIGN request to technician
export const assignRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { assignedTo } = req.body;

    // Verify user exists
    const user = await User.findById(assignedTo);
    if (!user) {
      return res.status(404).json({ message: "Technician not found" });
    }

    const request = await Request.findByIdAndUpdate(
      id,
      {
        assignedTo,
        status: "In Progress"
      },
      { new: true }
    ).populate([
      { path: "equipment", select: "name serialNumber" },
      { path: "team", select: "name" },
      { path: "assignedTo", select: "name email" },
      { path: "createdBy", select: "name email" }
    ]);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json({
      success: true,
      message: "Request assigned successfully",
      data: request
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CHANGE request status
export const changeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, duration } = req.body;

    const updateData = { status };
    if (duration) updateData.duration = duration;

    // If marking as scrap, ensure equipment is also marked as scrap
    if (status === "Scrap") {
      const request = await Request.findById(id);
      await Equipment.findByIdAndUpdate(request.equipment, { status: "Scrap" });
    }

    const request = await Request.findByIdAndUpdate(id, updateData, {
      new: true
    }).populate([
      { path: "equipment", select: "name serialNumber" },
      { path: "team", select: "name" },
      { path: "assignedTo", select: "name email" },
      { path: "createdBy", select: "name email" }
    ]);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json({
      success: true,
      message: `Request status changed to ${status}`,
      data: request
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET requests by team
export const getRequestsByTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { status } = req.query;

    let query = { team: teamId };
    if (status) query.status = status;

    const requests = await Request.find(query)
      .populate("equipment", "name serialNumber")
      .populate("team", "name")
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: requests,
      count: requests.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET preventive maintenance requests (for calendar)
export const getPreventiveRequests = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = { type: "Preventive" };

    if (startDate && endDate) {
      query.scheduledDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const requests = await Request.find(query)
      .populate("equipment", "name serialNumber category")
      .populate("team", "name")
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort({ scheduledDate: 1 });

    res.status(200).json({
      success: true,
      data: requests,
      count: requests.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET analytics/reports
export const getRequestAnalytics = async (req, res) => {
  try {
    // Requests by team
    const requestsByTeam = await Request.aggregate([
      { $group: { _id: "$team", count: { $sum: 1 } } },
      { $lookup: { from: "teams", localField: "_id", foreignField: "_id", as: "team" } },
      { $unwind: "$team" }
    ]);

    // Requests by status
    const requestsByStatus = await Request.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    // Requests by equipment category
    const requestsByCategory = await Request.aggregate([
      { $lookup: { from: "equipment", localField: "equipment", foreignField: "_id", as: "equipment" } },
      { $unwind: "$equipment" },
      { $group: { _id: "$equipment.category", count: { $sum: 1 } } }
    ]);

    // Overdue requests
    const overdueRequests = await Request.find({
      status: { $ne: "Repaired" },
      scheduledDate: { $lt: new Date() }
    }).count();

    res.status(200).json({
      success: true,
      data: {
        requestsByTeam,
        requestsByStatus,
        requestsByCategory,
        overdueCount: overdueRequests
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
