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
    id: String(resp.userId),
    email: resp.email,
    username: resp.displayUsername || resp.username || resp.email.split("@")[0],
    phone: [],
    student_id: "",
    bio: "",
    profile_picture: "",
    created_at: new Date().toISOString(),
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
    student_id: string
  ) => Promise<{ user: User }>;
  signIn: (email: string, password: string) => Promise<{ user: User }>;
  signOut: () => Promise<void>;
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
    phone,
    student_id
  ) => {
    const payload = { username, email, password, studentId: student_id };
    const { data } = await apiClient.post<AuthResponse>(
      "/api/auth/register",
      payload
    );
    const mappedUser = mapAuthResponseToUser(data);
    localStorage.setItem(AUTH_TOKEN_KEY, data.token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(mappedUser));
    const enrichedUser: User = {
      ...mappedUser,
      phone: [phone],
      student_id,
    } as User;
    setUser(enrichedUser);
    return { user: enrichedUser };
  };

  const signIn: AuthContextValue["signIn"] = async (email, password) => {
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
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    setUser(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, signUp, signIn, signOut }),
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
