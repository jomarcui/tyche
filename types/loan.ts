export interface Loan {
  id: number;
  borrowerName: string;
  amount: number;
  interestRate: number;
  status: "pending" | "approved" | "rejected" | "active" | "closed";
  createdAt: string;
}
