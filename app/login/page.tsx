"use client";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "@/types/api";
import Link from "next/link";
import Input from "@/components/ui/Input";
import AuthLayout from "@/components/layout/AuthLayout";

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { login } = useContext(AuthContext)!;
  const router = useRouter();
  const searchParams = useSearchParams();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>();

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setError(null);

    try {
      await login(data.email, data.password);
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
    <AuthLayout>
      <h1 className="mb-6 text-center text-xl font-semibold text-gray-800">
        Login
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email */}
        <Input
          label="Email"
          type="email"
          placeholder="john.doe@example.com"
          error={errors.email?.message}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email address",
            },
          })}
        />

        {/* Password with Forgot Password link */}
        <div>
          <div className="flex items-center justify-between">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="mb-1.5 text-sm text-indigo-600 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
          <Input
            placeholder="••••••••"
            error={errors.password?.message}
            showPasswordToggle
            {...register("password", { required: "Password is required" })}
          />
        </div>

        {/* Error Message from API */}
        {error && <p className="text-sm text-red-500">{error}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-white shadow hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* Bottom Links */}
      <div className="mt-6 text-center text-sm text-gray-600">
        Don’t have an account?{" "}
        <Link href="/register" className="text-indigo-600 hover:underline">
          Create account
        </Link>
      </div>
    </AuthLayout>
  );
}
