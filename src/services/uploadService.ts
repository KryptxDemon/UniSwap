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
  // Returns a public URL string, e.g. "/api/uploads/abcd.jpg"
  async uploadImage(file: File): Promise<string> {
    const form = new FormData();
    form.append("file", file);
    // Do not set Content-Type manually; browser sets the multipart boundary
    const resp = await apiClient.post("/api/uploads/image", form);
    if (!resp?.data?.url) throw new Error("Upload failed: missing URL");

    // The backend returns just the filename, we need to construct the full path
    const filename = String(resp.data.url);
    return `/api/uploads/${filename}`;
  },

  // Get list of all uploaded files
  async listFiles(): Promise<string[]> {
    const resp = await apiClient.get("/api/uploads/list");
    if (!resp?.data?.files) throw new Error("Failed to fetch file list");
    return resp.data.files;
  },
};
