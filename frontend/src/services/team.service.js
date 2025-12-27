import api from "./api";

// GET all teams
export const getTeams = async (params = {}) => {
  try {
    const res = await api.get("/team", { params });
    return res.data;
  } catch (error) {
    console.error("getTeams error:", error.response?.data || error.message);
    throw error;
  }
};

// GET team by ID
export const getTeamById = async (id) => {
  try {
    const res = await api.get(`/team/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// CREATE team
export const createTeam = async (data) => {
  try {
    const res = await api.post("/team", data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// UPDATE team
export const updateTeam = async (id, data) => {
  try {
    const res = await api.put(`/team/${id}`, data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// DELETE team
export const deleteTeam = async (id) => {
  try {
    const res = await api.delete(`/team/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// GET team members
export const getTeamMembers = async (id) => {
  try {
    const res = await api.get(`/team/${id}/members`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// ADD team member
export const addTeamMember = async (id, userId) => {
  try {
    const res = await api.post(`/team/${id}/members`, { userId });
    return res.data;
  } catch (error) {
    console.error("addTeamMember error:", error.response?.data || error.message);
    throw error;
  }
};

// REMOVE team member
export const removeTeamMember = async (id, memberId) => {
  try {
    const res = await api.delete(`/team/${id}/members/${memberId}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};
