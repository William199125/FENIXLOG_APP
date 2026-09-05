import axios from "axios";
import { API_URL } from "../config/env";
import { secureAuth } from "./secureAuth";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 8000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = secureAuth.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});