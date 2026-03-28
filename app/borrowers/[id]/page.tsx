import ProtectedRoute from "@/components/ProtectedRoute";
import BorrowerDetailsClient from "./BorrowerDetailsClient";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default async function BorrowerDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <BorrowerDetailsClient borrowerId={id} />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
