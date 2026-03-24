"use client";
import { useState, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "@/types/api";

export default function LoginPage() {
  const { login } = useContext(AuthContext)!;
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      const redirect = searchParams.get("redirect");
      router.push(redirect || "/");
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      setError(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "2rem" }}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
