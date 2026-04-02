import Sidebar from "../Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <div
          className="flex items-center justify-between border-b border-gray-200 px-4 py-4"
          style={{ height: "72.6px" }}
        ></div>
        <main className="flex-1 bg-gray-100 p-6">{children}</main>
      </div>
    </div>
  );
}
