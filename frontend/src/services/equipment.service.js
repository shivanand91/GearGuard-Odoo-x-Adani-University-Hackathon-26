import api from "./api";

// GET all equipment
export const getAllEquipment = async (params = {}) => {
  try {
    const res = await api.get("/equipment", { params });
    return res.data;
  } catch (error) {
    console.error("getAllEquipment error:", error.response?.data || error.message);
    throw error;
  }
};

// GET equipment by ID
export const getEquipmentById = async (id) => {
  try {
    const res = await api.get(`/equipment/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// CREATE equipment
export const createEquipment = async (data) => {
  try {
    // Convert empty strings to null for optional ObjectId fields
    const cleanData = { ...data };
    if (!cleanData.assignedTeam) cleanData.assignedTeam = null;
    if (!cleanData.assignedTo) cleanData.assignedTo = null;
    const res = await api.post("/equipment", cleanData);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// UPDATE equipment
export const updateEquipment = async (id, data) => {
  try {
    // Convert empty strings to null for optional ObjectId fields
    const cleanData = { ...data };
    if (!cleanData.assignedTeam) cleanData.assignedTeam = null;
    if (!cleanData.assignedTo) cleanData.assignedTo = null;
    const res = await api.put(`/equipment/${id}`, cleanData);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// DELETE equipment
export const deleteEquipment = async (id) => {
  try {
    const res = await api.delete(`/equipment/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// GET equipment by department
export const getEquipmentByDepartment = async (department) => {
  try {
    const res = await api.get(`/equipment/department/${department}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// GET equipment by employee
export const getEquipmentByEmployee = async (employeeId) => {
  try {
    const res = await api.get(`/equipment/employee/${employeeId}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// GET maintenance requests for equipment (Smart button)
export const getEquipmentMaintenance = async (id) => {
  try {
    const res = await api.get(`/equipment/${id}/maintenance`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Mark equipment as scrap
export const markEquipmentAsScrap = async (id, notes = "") => {
  try {
    const res = await api.put(`/equipment/${id}/scrap`, { notes });
    return res.data;
  } catch (error) {
    throw error;
  }
};

