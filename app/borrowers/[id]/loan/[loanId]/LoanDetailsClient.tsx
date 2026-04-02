"use client";

import { useContext, useEffect, useState } from "react";
import { api } from "@/services/api";
import { AuthContext } from "@/context/AuthContext";
import Link from "next/link";
import { formatPHP } from "@/utils/formatCurrency";
import Loading from "@/components/Loading";
import { Loan } from "@/types/loan";

interface Borrower {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  email: string;
}

export default function LoanDetailsClient({
  borrowerId,
  loanId,
}: {
  borrowerId: string;
  loanId: string;
}) {
  const { token, loading: authLoading } = useContext(AuthContext)!;
  const [borrower, setBorrower] = useState<Borrower | null>(null);

  const [loan, setLoan] = useState<Loan | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!authLoading && token) {
        setLoading(true);
        try {
          // Fetch borrower
          const borrowerRes = await api.get(`/borrowers/${borrowerId}`);

          const borrowerData = {
            ...borrowerRes.data,
            loans: borrowerRes.data.loans ?? [],
          };
          setBorrower(borrowerData);

          // Fetch loan
          const loanRes = await api.get(
            `/borrowers/${borrowerId}/loans/${loanId}`,
          );
          setLoan(loanRes.data);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [authLoading, token, borrowerId, loanId]);

  if (loading) return <Loading message="Loading loan..." />;
  if (!loan) return <p className="text-red-500">Loan not found.</p>;
  if (!borrower) return <p className="text-red-500">Borrower not found.</p>;

  const principal = loan.principal;
  const rate = loan.interestRate / 100; // annual interest
  const months = loan.termMonths;

  const monthlyRate = rate / 12;
  const monthlyPayment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);

  const totalRepayment = monthlyPayment * months;
  const totalInterest = totalRepayment - principal;
  return (
    <div className="min-h-screen space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-gray-800">
            Loan #{loan.loanNumber}
          </h1>
        </div>
        <Link
          href={`/borrowers/${borrower.id}`}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
        >
          Back to Borrower
        </Link>
      </div>

      {/* Borrower Info Card */}
      <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-semibold text-blue-600">
          {borrower.firstName[0]}
          {borrower.lastName[0]}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-800">
            {borrower.firstName} {borrower.lastName}
          </p>
          <p className="text-xs text-gray-500">{borrower.email}</p>
          <p className="text-xs text-gray-500">{borrower.phone}</p>
        </div>
        <Link
          href={`/borrowers/${borrower.id}`}
          className="text-sm text-blue-600 hover:underline"
        >
          View Profile
        </Link>
      </div>

      {/* Loan Details Card */}
      <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        {/* Loan Info Grid */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <p className="text-xs text-gray-500">Principal</p>
            <p className="font-medium text-gray-800">
              {formatPHP(loan.principal)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Term</p>
            <p className="font-medium text-gray-800">
              {loan.termMonths} months
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Interest Rate</p>
            <p className="font-medium text-gray-800">{loan.interestRate}%</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Start Date</p>
            <p className="font-medium text-gray-800">
              {new Date(loan.startDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div>
          <span
            className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
              loan.status === "active"
                ? "bg-green-100 text-green-700"
                : loan.status === "closed"
                  ? "bg-gray-200 text-gray-700"
                  : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {loan.status}
          </span>
        </div>

        {/* Financial Summary */}
        <div className="space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="text-xs text-gray-500">Financial Summary</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-gray-500">Total Interest</p>
              <p className="font-medium text-gray-800">
                {formatPHP(totalInterest)}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Total Repayment</p>
              <p className="font-medium text-gray-800">
                {formatPHP(totalRepayment)}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Estimated Monthly</p>
              <p className="font-medium text-gray-800">
                {formatPHP(monthlyPayment)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
