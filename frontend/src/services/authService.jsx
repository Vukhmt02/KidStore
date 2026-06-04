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

  refresh: () =>
    apiRequest("/auth/refresh", {
      method: "POST"
    }),

  logout: () =>
    apiRequest("/auth/logout", {
      method: "POST"
    }),

  getCurrentUser: () => apiRequest("/auth/me"),

  updateProfile: (data) =>
    apiRequest("/auth/me", {
      method: "PUT",
      body: JSON.stringify(data)
    })
};
