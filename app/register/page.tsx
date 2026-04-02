"use client";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "@/types/api";
import Link from "next/link";
import Input from "@/components/ui/Input";
import AuthLayout from "@/components/layout/AuthLayout";
import RegisterPageWrapper from "./RegisterPageWrapper";

interface RegisterFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const { register: registerUser } = useContext(AuthContext)!;
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>();

  const onSubmit = async (data: RegisterFormValues) => {
    setLoading(true);
    setError(null);

    try {
      await registerUser(
        data.firstName,
        data.lastName,
        data.email,
        data.password,
      );
      router.push("/"); // redirect after successful signup
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      setError(error.response?.data?.message || "Account creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterPageWrapper>
      <AuthLayout>
        <h1 className="mb-6 text-center text-xl font-semibold text-gray-800">
          Create Account
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="First Name"
            placeholder="John"
            error={errors.firstName?.message}
            {...register("firstName", { required: "First name is required" })}
          />

          <Input
            label="Last Name"
            placeholder="Doe"
            error={errors.lastName?.message}
            {...register("lastName", { required: "Last name is required" })}
          />

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

          <Input
            label="Password"
            placeholder="••••••••"
            showPasswordToggle
            error={errors.password?.message}
            {...register("password", { required: "Password is required" })}
          />

          <Input
            label="Confirm Password"
            placeholder="••••••••"
            showPasswordToggle
            error={errors.confirmPassword?.message}
            {...register("confirmPassword", {
              required: "Confirm your password",
              validate: (value) =>
                value === watch("password") || "Passwords do not match",
            })}
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-white shadow hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-600 hover:underline">
            Login
          </Link>
        </div>
      </AuthLayout>
    </RegisterPageWrapper>
  );
}
