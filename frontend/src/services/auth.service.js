import api from "./api";

export const loginUser = async (data) => {
  try {
    const response = await api.post("/auth/login", data);
    console.log("Login response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Login error details:", error.response?.data || error.message);
    throw error;
  }
};

export const registerUser = async (data) => {
  try {
    const response = await api.post("/auth/register", data);
    console.log("Register response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Register error details:", error.response?.data || error.message);
    throw error;
  }
};
