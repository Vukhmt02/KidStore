import { ApiError } from "./api";

const API_URL = import.meta.env.VITE_API_URL;

export const uploadService = {
  uploadImage: async (file) => {
    const token = localStorage.getItem("accessToken");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_URL}/admin/uploads/image`, {
        method: "POST",
        credentials: "include",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: formData
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new ApiError(data?.message || "Tải ảnh lên thất bại.", response.status, data);
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(error.message || "Không thể kết nối đến máy chủ để tải ảnh.", 0, null);
    }
  }
};
