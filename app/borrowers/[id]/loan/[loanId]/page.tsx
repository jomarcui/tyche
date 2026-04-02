import LoanDetailsClient from "./LoanDetailsClient";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default async function LoanDetailsPage({
  params,
}: {
  params: Promise<{ id: string; loanId: string }>;
}) {
  const { id, loanId } = await params;
  return (
    <DashboardLayout>
      <LoanDetailsClient borrowerId={id} loanId={loanId} />
    </DashboardLayout>
  );
}
