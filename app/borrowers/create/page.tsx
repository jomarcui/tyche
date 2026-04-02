"use client";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { api } from "@/services/api";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "@/types/api";
import Link from "next/link";

type BorrowerForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
};

export default function CreateBorrowerPage() {
  const { token } = useContext(AuthContext)!;
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BorrowerForm>();

  const onSubmit = async (data: BorrowerForm) => {
    try {
      await api.post("/borrowers", data);
      router.push("/borrowers");
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      alert(error.response?.data?.message || "Failed to create borrower");
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen w-full flex-1">
        {/* Page Header */}
        <header className="sticky top-0 z-10 mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">
            Create Borrower
          </h1>
          <Link
            href="/borrowers"
            className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
          >
            Back to Borrowers
          </Link>
        </header>

        {/* Form Card */}
        <div className="max-w-2xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* First Name / Last Name */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  {...register("firstName", {
                    required: "First name is required",
                  })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  {...register("lastName", {
                    required: "Last name is required",
                  })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                })}
                type="email"
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="john.doe@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                {...register("phone", {
                  required: "Phone is required",
                  minLength: { value: 7, message: "Phone too short" },
                })}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="09123456789"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <textarea
                {...register("address", { required: "Address is required" })}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="123 Main St, Pasig City"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.address.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-white shadow hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              {isSubmitting ? "Creating..." : "Create Borrower"}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
