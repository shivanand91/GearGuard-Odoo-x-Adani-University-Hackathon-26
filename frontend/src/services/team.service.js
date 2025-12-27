import api from "./api";

export const getTeams = async () => {
  const res = await api.get("/team");
  return res.data;
};

export const createTeam = async (data) => {
  const res = await api.post("/team", data);
  return res.data;
};
