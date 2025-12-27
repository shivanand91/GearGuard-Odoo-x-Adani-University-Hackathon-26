import Team from "../models/Team.model.js";

export const createTeamService = async (data) => {
  return await Team.create(data);
};

export const getTeamsService = async () => {
  return await Team.find().populate("members");
};
