import axios from "axios";

const API_BASE_URL = "http://localhost:8085/api/v1";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Automatically add JWT token and current organization context to headers.
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const orgId = localStorage.getItem("currentOrganizationId");

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (orgId && config.headers) {
    config.headers["X-Organization-Id"] = orgId;
  }

  return config;
});

export default axiosInstance;
