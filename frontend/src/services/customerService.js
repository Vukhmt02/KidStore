import { apiRequest } from "./api";

export const customerService = {
  adminGetAll: () => apiRequest("/admin/customers"),

  adminToggleActive: (id) =>
    apiRequest(`/admin/customers/${id}/toggle-active`, { method: "PUT" })
};
