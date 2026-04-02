"use client";

import { useEffect, useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";
import { AuthContext } from "@/context/AuthContext";
import Loading from "@/components/Loading";
import { formatPHP } from "@/utils/formatCurrency";
import Link from "next/link";

interface Borrower {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
}

interface LoanFormValues {
  amount: string;
  term: string;
  interestRate: string;
}

export default function LoanApplicationClient({
  borrowerId,
}: {
  borrowerId: string;
}) {
  const { token, loading: authLoading } = useContext(AuthContext)!;
  const router = useRouter();

  const [borrower, setBorrower] = useState<Borrower | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoanFormValues>({
    defaultValues: {
      amount: "",
      term: "",
      interestRate: "",
    },
  });

  // Watch form fields for live preview
  const amount = watch("amount") || "0";
  const term = watch("term") || "0";
  const interestRate = watch("interestRate") || "0";

  useEffect(() => {
    const fetchBorrower = async () => {
      if (!authLoading && token) {
        setLoading(true);
        try {
          const res = await api.get(`/borrowers/${borrowerId}`);
          setBorrower({ ...res.data, loans: res.data.loans ?? [] });
        } finally {
          setLoading(false);
        }
      }
    };
    fetchBorrower();
  }, [authLoading, token, borrowerId]);

  const onSubmit = async (data: LoanFormValues) => {
    if (!authLoading && token) {
      setLoading(true);
      setError(null);
      try {
        await api.post(`/borrowers/${borrowerId}/loans`, {
          principal: Number(data.amount),
          termMonths: Number(data.term),
          interestRate: Number(data.interestRate),
          startDate: new Date(),
        });
        router.push(`/borrowers/${borrowerId}`);
      } catch {
        setError("Failed to create loan");
      } finally {
        setLoading(false);
      }
    }
  };

  if (!borrower) return <Loading message="Loading borrower..." />;

  const principal = Number(amount);
  const rate = Number(interestRate) / 100;
  const months = Number(term);
  const totalInterest = principal * rate; // Simple interest
  const totalRepayment = principal + totalInterest;
  const monthlyPayment = months ? totalRepayment / months : 0;

  return (
    <div className="min-h-screen space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">
          New Loan Application
        </h1>
        <p className="text-sm text-gray-500">
          Fill in the details to create a new loan
        </p>
      </div>

      {/* Borrower Info */}
      <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600">
          {borrower.firstName[0]}
          {borrower.lastName[0]}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-800">
            {borrower.firstName} {borrower.lastName}
          </p>
          <p className="text-xs text-gray-500">{borrower.email}</p>
        </div>
        <Link
          href={`/borrowers/${borrower.id}`}
          className="text-sm text-blue-600 hover:underline"
        >
          View Profile
        </Link>
      </div>

      {/* Form Card */}
      <div className="max-w-2xl rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Card Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-800">
            Loan Details
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-6">
          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Loan Amount */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Loan Amount
            </label>
            <div className="relative">
              <span className="absolute top-2.5 left-3 text-sm text-gray-400">
                ₱
              </span>
              <input
                {...register("amount", { required: "Loan amount is required" })}
                type="number"
                className="w-full rounded-lg border border-gray-200 py-2.5 pr-3 pl-7 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
            {errors.amount && (
              <p className="mt-1 text-xs text-red-500">
                {errors.amount.message}
              </p>
            )}
          </div>

          {/* Grid: Term & Interest */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Term (months)
              </label>
              <input
                {...register("term", { required: "Term is required" })}
                type="number"
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="e.g. 12"
              />
              {errors.term && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.term.message}
                </p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Interest Rate (%)
              </label>
              <div className="relative">
                <input
                  {...register("interestRate", {
                    required: "Interest rate is required",
                  })}
                  type="number"
                  step="0.01"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 pr-8 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g. 5.5"
                />
                <span className="absolute top-2.5 right-3 text-sm text-gray-400">
                  %
                </span>
              </div>
              {errors.interestRate && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.interestRate.message}
                </p>
              )}
            </div>
          </div>

          {/* Loan Preview */}
          <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="text-xs text-gray-500">Loan Summary</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-gray-500">Loan Amount</p>
                <p className="font-medium text-gray-800">
                  {formatPHP(principal)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Interest Rate</p>
                <p className="font-medium text-gray-800">
                  {interestRate || 0}%
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Term</p>
                <p className="font-medium text-gray-800">{term || 0} months</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Repayment</p>
                <p className="font-medium text-gray-800">
                  {formatPHP(totalRepayment)}
                </p>
              </div>
            </div>
            <div className="flex justify-between rounded-md bg-blue-50 px-3 py-2 text-sm">
              <span className="text-gray-600">Estimated Monthly</span>
              <span className="font-semibold text-blue-700">
                {formatPHP(monthlyPayment)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Link
              href={`/borrowers/${borrower.id}`}
              className="rounded-lg border px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-70"
            >
              {loading ? "Submitting..." : "Create Loan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
