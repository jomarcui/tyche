"use client";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "@/services/api";
import { AuthContext } from "@/context/AuthContext";
import { useRouter, useParams } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "@/types/api";
import Loading from "@/components/Loading";

type BorrowerForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
};

export default function EditBorrowerPage() {
  const { token } = useContext(AuthContext)!;
  const router = useRouter();
  const params = useParams();
  const borrowerId = params?.id as string;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BorrowerForm>();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token && borrowerId) {
      api
        .get(`/borrowers/${borrowerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const borrower = res.data;
          setValue("firstName", borrower.firstName);
          setValue("lastName", borrower.lastName);
          setValue("email", borrower.email);
          setValue("phone", borrower.phone);
          setValue("address", borrower.address);
        })
        .catch(() => alert("Failed to load borrower"))
        .finally(() => setLoading(false));
    }
  }, [token, borrowerId, setValue]);

  const onSubmit = async (data: BorrowerForm) => {
    try {
      await api.patch(`/borrowers/${borrowerId}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      router.push("/borrowers");
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      alert(error.response?.data?.message || "Failed to update borrower");
    }
  };

  if (loading) return <Loading message="Loading borrower" />;

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="mx-auto max-w-xl rounded bg-white p-6 shadow">
          <h1 className="mb-6 text-2xl font-bold">Edit Borrower</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                {...register("firstName", {
                  required: "First name is required",
                })}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              {errors.firstName && (
                <p className="text-sm text-red-500">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                {...register("lastName", { required: "Last name is required" })}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              {errors.lastName && (
                <p className="text-sm text-red-500">
                  {errors.lastName.message}
                </p>
              )}
            </div>

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
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                {...register("phone", {
                  required: "Phone is required",
                  minLength: { value: 7, message: "Phone too short" },
                })}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <textarea
                {...register("address", { required: "Address is required" })}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              {errors.address && (
                <p className="text-sm text-red-500">{errors.address.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-white shadow hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              {isSubmitting ? "Updating..." : "Update Borrower"}
            </button>
          </form>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
