import { apiRequest } from "./api";

export const cartService = {
  get: () => apiRequest("/cart"),

  addItem: (productVariantId, quantity) =>
    apiRequest("/cart/items", {
      method: "POST",
      body: JSON.stringify({ productVariantId, quantity })
    }),

  updateItem: (cartItemId, quantity) =>
    apiRequest(`/cart/items/${cartItemId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity })
    }),

  removeItem: (cartItemId) =>
    apiRequest(`/cart/items/${cartItemId}`, {
      method: "DELETE"
    })
};
