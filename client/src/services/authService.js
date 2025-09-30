import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const API_URL = `${BASE_URL}/api/auth`;

export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  return response.data;
};
