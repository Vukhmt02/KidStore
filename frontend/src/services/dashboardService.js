import { apiRequest } from "./api";

export const dashboardService = {
  getStats: () => apiRequest("/admin/dashboard")
};
