import api from "./api";

export const getAllRequests = async () => {
  const res = await api.get("/request");
  return res.data;
};

export const createRequest = async (data) => {
  const res = await api.post("/request", data);
  return res.data;
};

export const updateRequest = async (id, data) => {
  const res = await api.put(`/request/${id}`, data);
  return res.data;
};
