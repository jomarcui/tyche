"use client";
import { useContext, useEffect, useState } from "react";
import { api } from "@/services/api";
import { Loan } from "@/types/loan";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { AuthContext } from "@/context/AuthContext";

export default function LoanList() {
  const { user, token, loading } = useContext(AuthContext)!;
  const [loans, setLoans] = useState<Loan[]>([]);

  useEffect(() => {
    if (!loading && user && token) {
      api
        .get("/loans", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setLoans(res.data));
    }
  }, [loading, user, token]);

  return (
    <DashboardLayout>
      <div>
        <h1>Loan Management</h1>
        <table>
          <thead>
            <tr>
              <th>Borrower</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan.id}>
                <td>{loan.borrowerName}</td>
                <td>{loan.amount}</td>
                <td>{loan.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
