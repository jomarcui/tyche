"use client";

import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/services/api";
import { AuthContext } from "@/context/AuthContext";
import { formatPHP } from "@/utils/formatCurrency";
import { Loan } from "@/types/loan";

interface Borrower {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  loans: Loan[];
}

export default function BorrowerDetailsClient({
  borrowerId,
}: {
  borrowerId: string;
}) {
  const { token, loading: authLoading } = useContext(AuthContext)!;
  const [borrower, setBorrower] = useState<Borrower | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBorrower = async () => {
      if (!authLoading && token) {
        setLoading(true);
        try {
          const res = await api.get(`/borrowers/${borrowerId}`);
          setBorrower({
            ...res.data,
            loans: res.data.loans ?? [],
            name: res.data.firstName + " " + res.data.lastName,
          });
        } finally {
          setLoading(false);
        }
      }
    };
    fetchBorrower();
  }, [authLoading, token, borrowerId]);

  if (loading) return <p className="text-gray-500">Loading borrower...</p>;
  if (!borrower) return <p className="text-red-500">No borrower found.</p>;

  return (
    <div className="min-h-screen space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Left: Avatar + Name */}
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-lg font-semibold text-blue-600">
            {borrower.name?.[0]}
          </div>

          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              {borrower.name}
            </h1>
            <p className="text-sm text-gray-500">{borrower.email}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            href={`/borrowers/${borrower.id}/edit`}
            className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Edit
          </Link>

          <Link
            href={`/borrowers/${borrower.id}/loan/new`}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            + Apply Loan
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Loans</p>
          <p className="mt-1 text-xl font-semibold text-gray-800">
            {borrower.loans.length}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Active Loans</p>
          <p className="mt-1 text-xl font-semibold text-green-600">
            {borrower.loans.filter((l) => l.status === "active").length}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Borrowed</p>
          <p className="mt-1 text-xl font-semibold text-gray-800">
            {formatPHP(
              borrower.loans.reduce((sum, l) => sum + +l.principal, 0),
            )}
          </p>
        </div>
      </div>

      {/* Profile Info */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-5 py-4">
          <h2 className="text-base font-semibold text-gray-800">
            Profile Information
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 px-5 py-4 md:grid-cols-2">
          <div>
            <p className="text-xs text-gray-500">Full Name</p>
            <p className="text-sm font-medium text-gray-800">{borrower.name}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Email</p>
            <p className="text-sm text-gray-700">{borrower.email}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Phone</p>
            <p className="text-sm text-gray-700">{borrower.phone}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Address</p>
            <p className="text-sm text-gray-700">{borrower.address}</p>
          </div>
        </div>
      </div>

      {/* Loans */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2 className="text-base font-semibold text-gray-800">Loans</h2>

          <span className="text-sm text-gray-500">
            {borrower.loans.length} total
          </span>
        </div>

        {/* Content */}
        <div className="p-5">
          {borrower.loans.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {borrower.loans.map((loan) => (
                <div
                  key={loan.id}
                  className="rounded-xl border border-gray-200 bg-white p-5 transition hover:shadow-md"
                >
                  {/* Top */}
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-800">
                      #{loan.loanNumber}
                    </p>

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
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

                  {/* Body */}
                  <div className="mt-3 space-y-1">
                    <p className="text-lg font-semibold text-gray-800">
                      {formatPHP(loan.principal)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {loan.termMonths} months • {loan.interestRate}%
                    </p>
                  </div>

                  {/* Action */}
                  <Link
                    href={`/borrowers/${borrower.id}/loan/${loan.id}`}
                    className="mt-4 block rounded-lg border py-2 text-center text-sm font-medium hover:bg-gray-100"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">
              No loans yet for this borrower.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
