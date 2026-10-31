import axios from "axios";

const api = axios.create({
  baseURL: "/api"
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("nutritrack_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("nutritrack_token");
      if (!location.pathname.startsWith("/login") && !location.pathname.startsWith("/register")) {
        location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export function apiErrorMessage(err, fallback = "Something went wrong. Please try again.") {
  return err?.response?.data?.error || err?.message || fallback;
}

export default api;
