"use client";

import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/services/api";
import { AuthContext } from "@/context/AuthContext";

interface Loan {
  id: string;
  principal: number;
  termMonths: number;
  interestRate: number;
  status: string;
}

interface Borrower {
  id: string;
  name: string;
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
          const res = await api.get(`/borrowers/${borrowerId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          // normalize loans to always be an array
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
    <div className="w-full flex-1 bg-gray-50 px-6 py-8">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-4 shadow-sm">
        <h1 className="text-xl font-semibold text-gray-800">{borrower.name}</h1>
        <div className="flex gap-3">
          <Link
            href={`/borrowers/${borrower.id}/edit`}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
          >
            Edit
          </Link>
          <Link
            href={`/borrowers/${borrower.id}/loan/new`}
            className="rounded-lg bg-green-600 px-4 py-2 text-white transition hover:bg-green-700"
          >
            Apply Loan
          </Link>
        </div>
      </header>

      {/* Profile Card */}
      <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-2 text-lg font-medium text-gray-800">Profile</h2>
        <p className="text-gray-600">Email: {borrower.email}</p>
      </div>

      {/* Loans Section */}
      <section className="mt-8">
        <h3 className="mb-4 text-xl font-semibold text-gray-800">Loans</h3>
        {borrower.loans.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {borrower.loans.map((loan) => (
              <div
                key={loan.id}
                className="flex flex-col justify-between rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div>
                  <p className="font-medium text-gray-800">Loan #{loan.id}</p>
                  <p className="text-gray-600">₱{loan.principal}</p>
                  <p className="text-sm text-gray-500">
                    Term: {loan.termMonths} months @ {loan.interestRate}%
                  </p>
                  <span
                    className={`mt-2 inline-block rounded-full px-2 py-1 text-xs ${
                      loan.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : loan.status === "Closed"
                          ? "bg-gray-200 text-gray-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {loan.status}
                  </span>
                </div>
                <Link
                  href={`/borrowers/${borrower.id}/loan/${loan.id}`}
                  className="mt-4 rounded-lg bg-indigo-600 px-3 py-2 text-center text-sm text-white transition hover:bg-indigo-700"
                >
                  View Loan
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">
            No loans yet for this borrower.
          </p>
        )}
      </section>
    </div>
  );
}
