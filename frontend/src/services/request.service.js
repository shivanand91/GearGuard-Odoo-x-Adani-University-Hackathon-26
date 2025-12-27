import api from "./api";

// GET all requests
export const getAllRequests = async (params = {}) => {
  try {
    const res = await api.get("/request", { params });
    return res.data;
  } catch (error) {
    throw error;
  }
};

// GET request by ID
export const getRequestById = async (id) => {
  try {
    const res = await api.get(`/request/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// CREATE request
export const createRequest = async (data) => {
  try {
    const res = await api.post("/request", data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// UPDATE request
export const updateRequest = async (id, data) => {
  try {
    const res = await api.put(`/request/${id}`, data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// DELETE request
export const deleteRequest = async (id) => {
  try {
    const res = await api.delete(`/request/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// ASSIGN request
export const assignRequest = async (id, assignedTo) => {
  try {
    const res = await api.put(`/request/${id}/assign`, { assignedTo });
    return res.data;
  } catch (error) {
    throw error;
  }
};

// CHANGE status
export const changeRequestStatus = async (id, status, duration = 0) => {
  try {
    const res = await api.put(`/request/${id}/status`, { status, duration });
    return res.data;
  } catch (error) {
    throw error;
  }
};

// GET requests by team
export const getRequestsByTeam = async (teamId, params = {}) => {
  try {
    const res = await api.get(`/request/team/${teamId}`, { params });
    return res.data;
  } catch (error) {
    throw error;
  }
};

// GET preventive requests (for calendar)
export const getPreventiveRequests = async (params = {}) => {
  try {
    const res = await api.get("/request/preventive/calendar", { params });
    return res.data;
  } catch (error) {
    throw error;
  }
};

// GET analytics
export const getRequestAnalytics = async () => {
  try {
    const res = await api.get("/request/analytics/dashboard");
    return res.data;
  } catch (error) {
    throw error;
  }
};
