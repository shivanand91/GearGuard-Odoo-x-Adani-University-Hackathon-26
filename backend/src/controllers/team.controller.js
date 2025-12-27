import Team from "../models/Team.model.js";

export const createTeam = async (req, res) => {
  try {
    const team = await Team.create(req.body);
    res.status(201).json(team);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getTeams = async (req, res) => {
  try {
    const teams = await Team.find().populate("members");
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
