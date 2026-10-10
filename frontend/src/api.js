import axios from "axios";
import { DEMO_TOKEN, mockApiAdapter } from "./mockApi";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (import.meta.env.DEV && token === DEMO_TOKEN) {
    config.adapter = mockApiAdapter;
  }
  return config;
});

// Do not globally redirect on every 401. Individual pages can now show the
// real backend error instead of silently throwing the user back to Login.
export default api;
