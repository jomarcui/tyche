import LoanApplicationClient from "./LoanApplicationClient";

export default async function LoanApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // ✅ unwrap the promise
  return <LoanApplicationClient borrowerId={id} />;
}
