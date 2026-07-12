const API_URL = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

async function parseResponse(response) {
  const contentType = response.headers.get("content-type") || "";

  if (response.status === 204) {
    return null;
  }

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

function getErrorMessage(data) {
  if (!data) return "API request failed";

  if (typeof data === "string") {
    const isServerStackTrace = data.includes("System.") || data.includes("Microsoft.") || data.length > 180;
    return isServerStackTrace ? "Hệ thống đang gặp lỗi. Vui lòng thử lại sau." : data;
  }

  if (data.message || data.Message) return data.message || data.Message;
  if (data.title || data.error) return data.title || data.error;

  if (data.errors && typeof data.errors === "object") {
    const messages = Object.values(data.errors).flat().filter(Boolean);
    if (messages.length) return messages.join(" ");
  }

  return "API request failed";
}

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(`${API_URL}${endpoint}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    },
    ...options
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new ApiError(getErrorMessage(data), response.status, data);
  }

  return data;
}
