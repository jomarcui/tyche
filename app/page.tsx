import DashboardLayout from "@/components/layout/DashboardLayout";

export default function Home() {
  return (
    <DashboardLayout>
      <h1 className="mb-6 text-4xl font-bold">Welcome to Tyche</h1>
      <p className="mb-6 text-lg text-gray-600">
        Your loan management system built with Next.js and Tailwind CSS.
      </p>
    </DashboardLayout>
  );
}
