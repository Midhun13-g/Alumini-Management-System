import api from "./api";

const AuthService = {
  signup: (payload) => api.post("/auth/signup", payload),
  login: (email, password) => api.post("/auth/login", { email, password }),
};

export default AuthService;
