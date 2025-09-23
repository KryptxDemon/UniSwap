import { useState, useEffect, createContext, useContext, useMemo } from "react";
import apiClient from "../lib/apiClient";
import { User } from "../types";

// Shapes returned by backend
interface AuthResponse {
  token: string;
  userId: number;
  username?: string; // backend uses displayUsername, but accept either
  displayUsername?: string;
  email: string;
}

function mapAuthResponseToUser(resp: AuthResponse): User {
  return {
    userId: resp.userId,
    email: resp.email,
    username: resp.displayUsername || resp.username || resp.email.split("@")[0],
    studentId: "",
    bio: "",
    profilePicture: "",
  };
}

const AUTH_TOKEN_KEY = "auth_token";
const AUTH_USER_KEY = "auth_user";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    username: string,
    phone: string,
    studentId: string
  ) => Promise<{ user: User }>;
  signIn: (email: string, password: string) => Promise<{ user: User }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate from storage
  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const storedUser = localStorage.getItem(AUTH_USER_KEY);
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {}
    }
    setLoading(false);
  }, []);

  const signUp: AuthContextValue["signUp"] = async (
    email,
    password,
    username,
    _phone,
    studentId
  ) => {
    // Clear any existing user data before creating new account
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (
        key.startsWith("conversations_") ||
        key.startsWith("messages_") ||
        key.startsWith("wishlist_") ||
        key.startsWith("items_") ||
        key.startsWith("item_status_history_")
      ) {
        localStorage.removeItem(key);
      }
    });

    const payload = { username, email, password, studentId: studentId };
    const { data } = await apiClient.post<AuthResponse>(
      "/api/auth/register",
      payload
    );
    const mappedUser = mapAuthResponseToUser(data);
    localStorage.setItem(AUTH_TOKEN_KEY, data.token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(mappedUser));
    const enrichedUser: User = {
      ...mappedUser,
      studentId,
    } as User;
    setUser(enrichedUser);
    return { user: enrichedUser };
  };

  const signIn: AuthContextValue["signIn"] = async (email, password) => {
    // Clear any existing user data before signing in
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (
        key.startsWith("conversations_") ||
        key.startsWith("messages_") ||
        key.startsWith("wishlist_") ||
        key.startsWith("items_") ||
        key.startsWith("item_status_history_")
      ) {
        localStorage.removeItem(key);
      }
    });

    const payload = { email, password };
    const { data } = await apiClient.post<AuthResponse>(
      "/api/auth/login",
      payload
    );
    const mappedUser = mapAuthResponseToUser(data);
    localStorage.setItem(AUTH_TOKEN_KEY, data.token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(mappedUser));
    setUser(mappedUser);
    return { user: mappedUser };
  };

  const signOut: AuthContextValue["signOut"] = async () => {
    // Clear all user-specific data from localStorage
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem("conversations");
    localStorage.removeItem("messages");
    localStorage.removeItem("wishlist");
    localStorage.removeItem("items");

    // Clear any item status history
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith("item_status_history_")) {
        localStorage.removeItem(key);
      }
    });

    setUser(null);
  };

  const updateProfile: AuthContextValue["updateProfile"] = (updates) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...updates } as User;
      try {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, signUp, signIn, signOut, updateProfile }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
