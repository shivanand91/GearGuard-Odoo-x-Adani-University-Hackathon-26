import Team from "../models/Team.model.js";
import User from "../models/User.model.js";
import Request from "../models/Request.model.js";

// CREATE team
export const createTeam = async (req, res) => {
  try {
    const { name, members } = req.body;

    // Check if team already exists
    const existing = await Team.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Team with this name already exists" });
    }

    const team = await Team.create({
      name,
      members: members || []
    });

    const populatedTeam = await team.populate("members", "name email role");

    res.status(201).json({
      success: true,
      message: "Team created successfully",
      data: populatedTeam
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET all teams
export const getTeams = async (req, res) => {
  try {
    const { search, sortBy } = req.query;
    let query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    let teamQuery = Team.find(query).populate("members", "name email role");

    if (sortBy === "recent") {
      teamQuery = teamQuery.sort({ createdAt: -1 });
    } else {
      teamQuery = teamQuery.sort({ name: 1 });
    }

    const teams = await teamQuery;

    res.status(200).json({
      success: true,
      data: teams,
      count: teams.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET single team
export const getTeamById = async (req, res) => {
  try {
    const { id } = req.params;
    const team = await Team.findById(id).populate("members", "name email role");

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Get team requests count
    const requestCount = await Request.countDocuments({ team: id });

    res.status(200).json({
      success: true,
      data: {
        ...team.toObject(),
        requestCount
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE team
export const updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, members } = req.body;

    const team = await Team.findByIdAndUpdate(
      id,
      { name, members },
      { new: true, runValidators: true }
    ).populate("members", "name email role");

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    res.status(200).json({
      success: true,
      message: "Team updated successfully",
      data: team
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE team
export const deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if team has requests
    const hasRequests = await Request.findOne({ team: id });
    if (hasRequests) {
      return res.status(400).json({ message: "Cannot delete team with active requests" });
    }

    const team = await Team.findByIdAndDelete(id);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    res.status(200).json({
      success: true,
      message: "Team deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADD member to team
export const addTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    let { userId } = req.body;

    // Validate userId/email is provided
    if (!userId) {
      return res.status(400).json({ message: "User ID or Email is required" });
    }

    // If userId looks like an email, find user by email
    if (userId.includes("@")) {
      const user = await User.findOne({ email: userId.toLowerCase() });
      if (!user) {
        return res.status(404).json({ message: "User not found with this email" });
      }
      userId = user._id;
    }

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const team = await Team.findById(id);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Check if user already in team (convert to string for comparison)
    const userIdString = userId.toString();
    const memberExists = team.members.some(memberId => memberId.toString() === userIdString);
    
    if (memberExists) {
      return res.status(400).json({ message: "User already in team" });
    }

    team.members.push(userId);
    await team.save();

    const populatedTeam = await team.populate("members", "name email role");

    res.status(200).json({
      success: true,
      message: "Member added to team",
      data: populatedTeam
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// REMOVE member from team
export const removeTeamMember = async (req, res) => {
  try {
    const { id, memberId } = req.params;

    const team = await Team.findById(id);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    team.members = team.members.filter(m => m.toString() !== memberId);
    await team.save();

    const populatedTeam = await team.populate("members", "name email role");

    res.status(200).json({
      success: true,
      message: "Member removed from team",
      data: populatedTeam
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET team members
export const getTeamMembers = async (req, res) => {
  try {
    const { id } = req.params;

    const team = await Team.findById(id).populate("members", "name email role");
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    res.status(200).json({
      success: true,
      data: team.members,
      count: team.members.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
