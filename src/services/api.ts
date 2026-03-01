import axios from "axios";
import type { Resume } from "../store/resumeStore";

const API_BASE_URL =
  import.meta.env.VITE_APP_RENDER_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Global loader hooks ──────────────────────────────────────────────────────
// These are set at runtime by `setupAxiosLoader()` once the React context
// is available.  This avoids circular imports between api.ts and React code.
let _showLoader: (() => void) | null = null;
let _hideLoader: (() => void) | null = null;

/**
 * Call this once from a top-level component (e.g. App) to connect the
 * axios interceptors to the LoaderContext.
 */
export function setupAxiosLoader(show: () => void, hide: () => void) {
  _showLoader = show;
  _hideLoader = hide;
}

// Request interceptor – increment active-request counter
api.interceptors.request.use(
  (config) => {
    _showLoader?.();
    return config;
  },
  (error) => {
    _hideLoader?.();
    return Promise.reject(error);
  },
);

// Response interceptor – decrement active-request counter
api.interceptors.response.use(
  (response) => {
    _hideLoader?.();
    return response;
  },
  (error) => {
    _hideLoader?.();
    return Promise.reject(error);
  },
);

// Auth services
export const authService = {
  register: (email: string, password: string, name: string) =>
    api.post("/auth/register", { email, password, name }),
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),
  logout: () => localStorage.removeItem("token"),
};

// Resume services
export const resumeService = {
  createResume: (data: Partial<Resume>) => api.post("/resumes", data),
  getResumes: () => api.get("/resumes"),
  getResume: (id: string) => api.get(`/resumes/${id}`),
  updateResume: (id: string, data: Partial<Resume>) =>
    api.put(`/resumes/${id}`, data),
  deleteResume: (id: string) => api.delete(`/resumes/${id}`),
  // downloadResume removed: PDF is generated client-side (html2canvas + jsPDF)
};

export default api;
