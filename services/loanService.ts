import { apiFetch } from "./api";

export async function getLoans() {
  return apiFetch("/loans");
}

export async function createLoan(data: any) {
  return apiFetch("/loans", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
