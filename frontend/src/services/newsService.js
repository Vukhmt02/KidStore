import { apiRequest } from "./api";

export const newsService = {
  getPublished: () => apiRequest("/news"),

  getBySlug: (slug) => apiRequest(`/news/${slug}`),

  getAll: () => apiRequest("/admin/news"),

  getById: (id) => apiRequest(`/admin/news/${id}`),

  create: (data) =>
    apiRequest("/admin/news", {
      method: "POST",
      body: JSON.stringify(data)
    }),

  update: (id, data) =>
    apiRequest(`/admin/news/${id}`, {
      method: "PUT",
      body: JSON.stringify(data)
    }),

  delete: (id) =>
    apiRequest(`/admin/news/${id}`, {
      method: "DELETE"
    })
};
