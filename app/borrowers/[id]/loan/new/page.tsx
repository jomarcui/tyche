import LoanApplicationClient from "./LoanApplicationClient";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default async function LoanApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <DashboardLayout>
      <LoanApplicationClient borrowerId={id} />
    </DashboardLayout>
  );
}
