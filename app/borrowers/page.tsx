"use client";
import { useEffect, useState, useContext } from "react";
import { api } from "@/services/api";
import { AuthContext } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
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
      if (!authLoading && token) {
        setDataLoading(true);
        api
          .get("/borrowers", { headers: { Authorization: `Bearer ${token}` } })
          .then((res) => {
            // adjust if backend wraps response in { data: [...] }
            const data = Array.isArray(res.data)
              ? res.data
              : (res.data.data ?? []);
            setBorrowers(data);
          })
          .catch(() => setError("Failed to load borrowers"))
          .finally(() => setDataLoading(false));
      }
    };

    fetchBorrowers();
  }, [authLoading, token]);

  if (authLoading || dataLoading) return <Loading />;

  // pagination logic
  const totalPages = Math.ceil(borrowers.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentBorrowers = borrowers.slice(startIndex, startIndex + pageSize);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Borrowers</h1>
          </div>
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {borrowers.length} borrower{borrowers.length !== 1 && "s"}
            </div>
            <div>
              <Link
                href="/borrowers/create"
                className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-white shadow transition hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                Add Borrower
              </Link>
            </div>
          </div>

          {error && <p className="text-red-500">{error}</p>}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 rounded-lg shadow">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    First Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Last Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Address
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {currentBorrowers.map((b) => (
                  <tr key={b.id} className="transition hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {b.firstName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {b.lastName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {b.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {b.phone}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {b.address}
                    </td>
                    <td className="px-6 py-4 text-right text-sm">
                      <Link
                        href={`/borrowers/${b.id}`}
                        className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-1 text-sm font-medium text-white shadow transition hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      >
                        View Details
                      </Link>
                    </td>
                    {/* <td className="px-6 py-4 text-right text-sm">
                      <Link
                        href={`/borrowers/${b.id}/edit`}
                        className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-1 text-sm font-medium text-white shadow transition hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      >
                        Edit
                      </Link>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="mt-4 flex items-center justify-between">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="rounded bg-gray-200 px-3 py-1 hover:bg-gray-300 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="rounded bg-gray-200 px-3 py-1 hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
