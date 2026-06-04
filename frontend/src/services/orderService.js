import { apiRequest } from "./api";

export const orderService = {
  create: (data) =>
    apiRequest("/orders", {
      method: "POST",
      body: JSON.stringify(data)
    }),

  getMine: () => apiRequest("/orders"),

  getById: (id) => apiRequest(`/orders/${id}`)
};
