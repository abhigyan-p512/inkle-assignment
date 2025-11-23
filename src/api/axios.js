// client/src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/v1",
});

// Always attach token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("saf_token"); // 👈 changed
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
