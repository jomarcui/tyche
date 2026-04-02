"use client";
import { createContext, useState, useEffect, ReactNode } from "react";
import { api } from "@/services/api";
import { User } from "@/types/user";
import { AuthContextType } from "@/types/auth";

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    setToken(res.data.access_token);
    localStorage.setItem("token", res.data.access_token);
    const me = await api.get("/auth/me");
    setUser(me.data);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  const register = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ) => {
    const res = await api.post("/api/auth/register", {
      firstName,
      lastName,
      email,
      password,
    });
    setToken(res.data.token); // optional: auto-login after signup
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me");
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
    <AuthContext.Provider
      value={{ user, token, login, logout, loading, register }}
    >
      {loading ? <p>Loading session...</p> : children}
    </AuthContext.Provider>
  );
}
