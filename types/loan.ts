export interface Loan {
  id: string;
  principal: number;
  termMonths: number;
  interestRate: number;
  status: "pending" | "approved" | "rejected" | "active" | "closed";
  startDate: string;
  loanNumber: string;
}
