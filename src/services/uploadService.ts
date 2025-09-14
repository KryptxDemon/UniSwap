// src/services/uploadService.ts
import axios from "axios";

// If you already have a configured axios instance (apiClient), use that instead:
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
  withCredentials: false,
});

// Optional: attach JWT like the rest of your app
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const uploadAPI = {
  // Returns a public URL string, e.g. "/uploads/abcd.jpg"
  async uploadImage(file: File): Promise<string> {
    const form = new FormData();
    form.append("file", file);
    // Do not set Content-Type manually; browser sets the multipart boundary
    const resp = await apiClient.post("/api/uploads/image", form);
    if (!resp?.data?.url) throw new Error("Upload failed: missing URL");
    return String(resp.data.url);
  },
};
