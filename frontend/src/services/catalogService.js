import { apiRequest } from "./api";

export const catalogService = {
  getPublicCategories: () => apiRequest("/catalog/categories"),

  getPublicProducts: () => apiRequest("/catalog/products"),

  getCategories: () => apiRequest("/admin/categories"),

  createCategory: (data) =>
    apiRequest("/admin/categories", {
      method: "POST",
      body: JSON.stringify(data)
    }),

  updateCategory: (id, data) =>
    apiRequest(`/admin/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data)
    }),

  deleteCategory: (id) =>
    apiRequest(`/admin/categories/${id}`, {
      method: "DELETE"
    }),

  getProducts: () => apiRequest("/admin/products"),

  createProduct: (data) =>
    apiRequest("/admin/products", {
      method: "POST",
      body: JSON.stringify(data)
    }),

  updateProduct: (id, data) =>
    apiRequest(`/admin/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data)
    }),

  deleteProduct: (id) =>
    apiRequest(`/admin/products/${id}`, {
      method: "DELETE"
    }),

  getSizes: () => apiRequest("/sizes"),

  getColors: () => apiRequest("/colors")
};
