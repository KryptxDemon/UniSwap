// src/lib/apiClient.ts
import axios, { AxiosError } from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

console.log("API Base URL:", API_BASE_URL);

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000, // 10 second timeout
});

// --- helpers ---
function decodeJwtPayload(token: string): any | null {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    // base64url -> base64
    const b64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const pad = b64.length % 4 === 2 ? "==" : b64.length % 4 === 3 ? "=" : "";
    return JSON.parse(atob(b64 + pad));
  } catch {
    return null;
  }
}

function tokenIsExpired(token: string): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== "number") return true; // treat undecodable as expired
  const expMs = payload.exp * 1000;
  return Date.now() >= expMs;
}

// --- request interceptor ---
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  console.log("API Request - Token:", token ? "Present" : "Missing");
  console.log("API Request - URL:", config.url);
  console.log("API Request - Method:", config.method?.toUpperCase());

  if (token) {
    // If token is expired/bad, drop it silently and continue unauthenticated
    if (tokenIsExpired(token)) {
      console.warn(
        "Token expired/invalid. Removing and proceeding unauthenticated."
      );
      try {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
      } catch {}
    } else {
      config.headers = config.headers || {};
      (config.headers as any)["Authorization"] = `Bearer ${token}`;
      console.log("API Request - Authorization header set");
    }
  } else {
    console.log(
      "API Request - No token found, request will be unauthenticated"
    );
  }

  return config;
});

// --- response interceptor ---
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    console.error("API Response Error:", error);

    // Handle network errors
    if (!error.response) {
      if (
        error.code === "ECONNREFUSED" ||
        error.message.includes("Network Error")
      ) {
        console.error("Backend server is not running or not accessible");
        return Promise.reject(
          new Error(
            "Backend server is not available. Please check if the server is running on " +
              API_BASE_URL
          )
        );
      }
      return Promise.reject(
        new Error("Network error. Please check your connection.")
      );
    }

    const status = error.response?.status;
    const data = error.response?.data;
    if (status) {
      console.log("Error Status:", status);
      console.log("Error Data:", data);
    }

    // 401 Unauthorized: clear token & redirect to login
    if (status === 401) {
      console.error(
        "401 Unauthorized - clearing session and redirecting to login"
      );
      try {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
      } catch {}
      if (window.location.pathname !== "/login") {
        window.location.replace("/login");
      }
      return Promise.reject(new Error("Authentication required"));
    }

    // 403 Forbidden: do NOT clear token or redirect; let page handle it
    if (status === 403) {
      console.warn("403 Forbidden - insufficient permissions");
      const serverMsg =
        (typeof data === "object" && data?.message) || "403 Forbidden";
      return Promise.reject(new Error(serverMsg));
    }

    // 404 Not Found
    if (status === 404) {
      const serverMsg =
        (typeof data === "object" && data?.message) || "Resource not found";
      return Promise.reject(new Error(serverMsg));
    }

    // 500 Server Error
    if (status >= 500) {
      const serverMsg =
        (typeof data === "object" && data?.message) || "Server error";
      return Promise.reject(new Error(serverMsg));
    }

    // Other errors: bubble up a useful message
    const message =
      (typeof data === "object" && data?.message) ||
      error.message ||
      "Request failed";
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
