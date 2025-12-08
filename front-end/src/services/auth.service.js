import api from "./api";

export const authService = {
  async register(data) {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  async login(credentials) {
    const response = await api.post("/auth/login", credentials);
    if (response.data.accessToken) {
      localStorage.setItem("token", response.data.accessToken);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  updateCurrentUser(userData) {
    localStorage.setItem("user", JSON.stringify(userData));
  },

  isAuthenticated() {
    return !!localStorage.getItem("token");
  },
};
