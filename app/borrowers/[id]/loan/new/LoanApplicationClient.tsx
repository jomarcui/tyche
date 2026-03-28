"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";
import { AuthContext } from "@/context/AuthContext";

export default function LoanApplicationClient({
  borrowerId,
}: {
  borrowerId: string;
}) {
  const { token, loading: authLoading } = useContext(AuthContext)!;
  const router = useRouter();

  const [amount, setAmount] = useState("");
  const [term, setTerm] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authLoading && token) {
      setLoading(true);
      try {
        await api.post(
          `/borrowers/${borrowerId}/loans`,
          {
            principal: amount,
            termMonths: term,
            interestRate,
            startDate: new Date(), // or user-provided
          },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        router.push(`/borrowers/${borrowerId}`);
      } catch {
        setError("Failed to create loan");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="w-full flex-1 bg-gray-50 px-6 py-8">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">
        New Loan Application
      </h2>

      <form
        onSubmit={handleSubmit}
        className="max-w-lg space-y-4 rounded-xl bg-white p-6 shadow-sm"
      >
        {error && <p className="text-red-500">{error}</p>}

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Loan Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Term (months)
          </label>
          <input
            type="number"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Interest Rate (%)
          </label>
          <input
            type="number"
            step="0.01"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-green-600 py-2 text-white transition hover:bg-green-700"
        >
          {loading ? "Submitting..." : "Create Loan"}
        </button>
      </form>
    </div>
  );
}
