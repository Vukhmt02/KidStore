import { apiRequest } from "./api";

export const authService = {
  login: (data) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(data)
    }),

  register: (data) =>
    apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(data)
    }),

  getCurrentUser: () => apiRequest("/auth/me")
};