
import axios from "axios";
import { DEMO_TOKEN, mockApiAdapter } from "./mockApi";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
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