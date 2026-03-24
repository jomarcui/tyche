"use client";
import { useState } from "react";
import { api } from "@/services/api";

export default function NewLoan() {
  const [borrowerName, setBorrowerName] = useState("");
  const [amount, setAmount] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post("/loans", { borrowerName, amount });
    alert("Loan application submitted!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Borrower Name"
        value={borrowerName}
        onChange={e => setBorrowerName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={e => setAmount(Number(e.target.value))}
      />
      <button type="submit">Apply</button>
    </form>
  );
}
