import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});

// --- Admin ---
export const adminAPI = {
  getUsers: () => api.get("/admin/users"),
  deleteUser: (id) => api.delete(`/admin/user/${id}`),
  toggleUser: (id) => api.put(`/admin/user/${id}/toggle`),
  verifyAlumni: (userId) => api.put(`/admin/verify/${userId}`),
  getStats: () => api.get("/admin/stats"),
  getConnections: () => api.get("/admin/connections"),
  getEvents: () => api.get("/admin/events"),
  deleteEvent: (id) => api.delete(`/admin/event/${id}`),
  getJobs: () => api.get("/admin/jobs"),
  deleteJob: (id) => api.delete(`/admin/job/${id}`),
};

// --- Mentorship ---
export const mentorshipAPI = {
  sendRequest: (alumniId, message) => api.post(`/mentorship/request/${alumniId}`, { message }),
  getReceived: () => api.get("/mentorship/received"),
  getSent: () => api.get("/mentorship/sent"),
  accept: (id) => api.post(`/mentorship/accept/${id}`),
  reject: (id) => api.post(`/mentorship/reject/${id}`),
};

// --- Events ---
export const eventsAPI = {
  create: (data) => api.post("/events", data),
  getAll: () => api.get("/events"),
  register: (eventId) => api.post(`/events/register/${eventId}`),
  getMy: () => api.get("/events/my"),
};

// --- Jobs ---
export const jobsAPI = {
  create: (data) => api.post("/jobs", data),
  getAll: () => api.get("/jobs"),
  getMy: () => api.get("/jobs/my"),
  apply: (jobId, resumeLink) => api.post(`/jobs/apply/${jobId}`, { resumeLink }),
  getApplications: () => api.get("/jobs/applications"),
};

export default api;
