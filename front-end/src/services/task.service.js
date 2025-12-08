import api from "./api";

export const taskService = {
  async getTasks(params = {}) {
    const response = await api.get("/tasks", { params });
    return response.data;
  },

  async getTask(id) {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  async createTask(data, file) {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key] !== null && data[key] !== undefined) {
        // Convert boolean to string for FormData
        if (typeof data[key] === "boolean") {
          formData.append(key, data[key].toString());
        } else {
          formData.append(key, data[key]);
        }
      }
    });
    if (file) {
      formData.append("file", file);
    }

    const response = await api.post("/tasks", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async updateTask(id, data) {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data;
  },

  async toggleTask(id) {
    const response = await api.patch(`/tasks/${id}/toggle`);
    return response.data;
  },

  async deleteTask(id) {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },
};
