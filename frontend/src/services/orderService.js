import { apiRequest } from "./api";

export const orderService = {
  // ── Customer ──────────────────────────────────────────
  create: (data) =>
    apiRequest("/orders", {
      method: "POST",
      body: JSON.stringify(data)
    }),

  getMine: () => apiRequest("/orders"),

  getById: (id) => apiRequest(`/orders/${id}`),

  // ── Admin ─────────────────────────────────────────────
  adminGetAll: () => apiRequest("/admin/orders"),

  adminGetById: (id) => apiRequest(`/admin/orders/${id}`),

  adminUpdateStatus: (id, status) =>
    apiRequest(`/admin/orders/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status })
    })
};
