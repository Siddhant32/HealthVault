
import axios from "axios";
import { DEMO_TOKEN, mockApiAdapter } from "./mockApi";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

export const copilotApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  headers: { "Content-Type": "application/json" },
  timeout: 60000,
});

copilotApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Use the browser-based mock API for demo sessions,
  // including on the deployed Vercel website.
  if (token === DEMO_TOKEN) {
    config.adapter = mockApiAdapter;
  }

  return config;
});

export default api;