"use client";
import { useEffect, useState, useContext } from "react";
import { api } from "@/services/api";
import { AuthContext } from "@/context/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Loading from "@/components/Loading";
import Link from "next/link";

interface Borrower {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  isActive: boolean;
}

export default function BorrowersPage() {
  const { token, loading: authLoading } = useContext(AuthContext)!;
  const [borrowers, setBorrowers] = useState<Borrower[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [dataLoading, setDataLoading] = useState(true);

  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    const fetchBorrowers = async () => {
      if (authLoading) return; // wait until auth state is resolved

      setDataLoading(true);
      try {
        const res = await api.get("/borrowers");
        const data = Array.isArray(res.data) ? res.data : (res.data.data ?? []);
        setBorrowers(data);
      } catch {
        setError("Failed to load borrowers");
      } finally {
        setDataLoading(false);
      }
    };

    if (token) {
      fetchBorrowers();
    }
  }, [authLoading, token]);

  if (authLoading || dataLoading)
    return <Loading message="Loading borrowers..." />;

  // pagination logic
  const totalPages = Math.ceil(borrowers.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentBorrowers = borrowers.slice(startIndex, startIndex + pageSize);

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Borrowers</h1>
            <p className="text-sm text-gray-500">Manage your borrowers list</p>
          </div>

          <Link
            href="/borrowers/create"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
          >
            + Add Borrower
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          {/* Table */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            {/* Table Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <h2 className="text-base font-semibold text-gray-800">
                All Borrowers
              </h2>

              {/* Search (optional UI only for now) */}
              <input
                type="text"
                placeholder="Search..."
                className="w-64 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full">
                {/* Head */}
                <thead className="bg-gray-50">
                  <tr className="text-left text-xs font-medium text-gray-500 uppercase">
                    <th className="px-5 py-3">Borrower</th>
                    <th className="px-5 py-3">Contact</th>
                    <th className="px-5 py-3">Address</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>

                {/* Body */}
                <tbody className="divide-y divide-gray-100">
                  {currentBorrowers.map((b) => (
                    <tr key={b.id} className="transition hover:bg-gray-50">
                      {/* Borrower (Avatar + Name + Email) */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {/* Avatar */}
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600">
                            {b.firstName[0]}
                            {b.lastName[0]}
                          </div>

                          <div>
                            <p className="font-medium text-gray-800">
                              {b.firstName} {b.lastName}
                            </p>
                            <p className="text-xs text-gray-500">{b.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-5 py-4 text-sm text-gray-600">
                        {b.phone}
                      </td>

                      {/* Address */}
                      <td className="px-5 py-4 text-sm text-gray-600">
                        {b.address}
                      </td>

                      {/* Status Badge */}
                      <td className="px-5 py-4">
                        {b.isActive ? (
                          <span className="inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
                            Inactive
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/borrowers/${b.id}`}
                            className="rounded-md border px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
                          >
                            View
                          </Link>

                          <Link
                            href={`/borrowers/${b.id}/edit`}
                            className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                          >
                            Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-gray-200 px-5 py-4">
              <p className="text-sm text-gray-500">
                Showing {currentBorrowers.length} of {borrowers.length}
              </p>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="rounded-lg border px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                >
                  Prev
                </button>

                <span className="text-sm text-gray-500">
                  {currentPage} / {totalPages}
                </span>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="rounded-lg border px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </DashboardLayout>
  );
}
