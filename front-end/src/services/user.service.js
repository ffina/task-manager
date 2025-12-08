import api from "./api";

export const userService = {
  async getUsers(search = "") {
    const response = await api.get("/users", { params: { search } });
    return response.data;
  },

  async getUser(id) {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  async getUserTasks(id, page = 1, limit = 10) {
    const response = await api.get(`/users/${id}/tasks`, {
      params: { page, limit },
    });
    return response.data;
  },

  async getProfile() {
    const response = await api.get("/users/profile/me");
    return response.data;
  },

  async updateProfile(profileData, avatarFile) {
    const formData = new FormData();

    // Append profile data
    if (profileData.fullName !== undefined) {
      formData.append("fullName", profileData.fullName);
    }
    if (profileData.email) {
      formData.append("email", profileData.email);
    }
    if (profileData.currentPassword) {
      formData.append("currentPassword", profileData.currentPassword);
    }
    if (profileData.newPassword) {
      formData.append("newPassword", profileData.newPassword);
    }

    // Append avatar file if provided
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    const response = await api.put("/users/profile/me", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};
