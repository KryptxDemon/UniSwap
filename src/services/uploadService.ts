// src/services/uploadService.ts
import apiClient from "../lib/apiClient";

// Add a specific interceptor to debug upload requests
apiClient.interceptors.request.use(
  (config) => {
    if (config.url?.includes("/uploads/")) {
      console.log("🔍 Upload Request Debug:");
      console.log("  - URL:", config.url);
      console.log("  - Method:", config.method);
      console.log("  - Headers:", config.headers);
      console.log("  - Authorization:", config.headers?.Authorization);
    }
    return config;
  },
  (error) => {
    console.error("🔍 Upload Request Error:", error);
    return Promise.reject(error);
  }
);

export const uploadAPI = {
  // Returns a public URL string, e.g. "/api/uploads/files/abcd.jpg"
  async uploadImage(file: File): Promise<string> {
    // Debug: Check what token we're using
    const token = localStorage.getItem("auth_token");
    console.log("🔍 Debug - Using token:", token);
    console.log("🔍 Debug - Token exists:", !!token);

    const form = new FormData();
    form.append("file", file);

    console.log("🔍 Debug - Making POST request to /api/uploads/image");

    // IMPORTANT: Remove Content-Type header to allow browser to set multipart boundary
    const resp = await apiClient.post("/api/uploads/image", form, {
      headers: {
        "Content-Type": undefined, // This removes the default application/json header
      },
    });

    if (!resp?.data?.url) throw new Error("Upload failed: missing URL");

    // The backend returns just the filename, we need to construct the full path for serving
    const filename = String(resp.data.url);
    return `/api/uploads/files/${filename}`;
  },

  // Get list of all uploaded files
  async listFiles(): Promise<string[]> {
    const resp = await apiClient.get("/api/uploads/list");
    if (!resp?.data?.files) throw new Error("Failed to fetch file list");
    return resp.data.files;
  },
};
