import axios from "axios";

const baseConfig = {
  baseURL: import.meta.env.VITE_BACKEND_API,
  withCredentials: true,
  // timeout: 15_000,
};

export const publicApi = axios.create(baseConfig);
export const authApi = axios.create(baseConfig);
