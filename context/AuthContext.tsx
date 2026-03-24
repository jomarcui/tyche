"use client";
import { createContext, useState, useEffect, ReactNode } from "react";
import { api } from "@/services/api";
import { User } from "@/types/user";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    setToken(res.data.access_token);
    localStorage.setItem("token", res.data.access_token);
    const me = await api.get("/auth/me", {
      headers: { Authorization: `Bearer ${res.data.token}` },
    });
    setUser(me.data);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        setToken(storedToken);
        setUser(res.data as User);
      } catch {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {loading ? <p>Loading session...</p> : children}
    </AuthContext.Provider>
  );
}
