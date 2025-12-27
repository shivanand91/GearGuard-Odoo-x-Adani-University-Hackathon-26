import api from "./api";

export const getAllEquipment = async () => {
  const res = await api.get("/equipment");
  return res.data;
};

export const createEquipment = async (data) => {
  const res = await api.post("/equipment", data);
  return res.data;
};

export const updateEquipment = async (id, data) => {
  const res = await api.put(`/equipment/${id}`, data);
  return res.data;
};

export const deleteEquipment = async (id) => {
  const res = await api.delete(`/equipment/${id}`);
  return res.data;
};
