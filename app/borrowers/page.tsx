"use client";
import { useEffect, useState, useContext } from "react";
import { api } from "@/services/api";
import { AuthContext } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Loading from "@/components/Loading";

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

  useEffect(() => {
    const fetchBorrowers = async () => {
      if (!authLoading && token) {
        setDataLoading(true);
        try {
          const res = await api.get("/borrowers", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setBorrowers(res.data.data ?? []);
        } catch {
          setError("Failed to load borrowers");
        } finally {
          setDataLoading(false);
        }
      }
    };

    fetchBorrowers();
  }, [authLoading, token]);

  if (authLoading || dataLoading) return <Loading />;
  console.log("Borrowers to display:", borrowers);
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="p-6">
          <h1 className="mb-4 text-2xl font-bold">Borrowers</h1>
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
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {borrowers.map((b) => (
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
