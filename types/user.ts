export interface User {
  userId: number;
  email: string;
  name: string;
  role: "admin" | "borrower";
  createdAt: string;
  updatedAt: string;
}
