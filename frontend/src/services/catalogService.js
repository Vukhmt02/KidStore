import { apiRequest } from "./api";

export const catalogService = {
  getPublicCategories: () => apiRequest("/catalog/categories"),

  getPublicProducts: ({ page = 1, pageSize = 12, search = "", categoryId = "", sort = "" } = {}) => {
    const params = new URLSearchParams();

    params.set("page", page);
    params.set("pageSize", pageSize);

    if (search) params.set("search", search);
    if (categoryId) params.set("categoryId", categoryId);
    if (sort) params.set("sort", sort);

    return apiRequest(`/catalog/products?${params.toString()}`);
  },

  getPublicProduct: (id) => apiRequest(`/catalog/products/${id}`),

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
