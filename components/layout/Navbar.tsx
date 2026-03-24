export default function Navbar() {
  return (
    <div className="flex h-16 items-center justify-between border-b bg-white px-6">
      <h1 className="text-lg font-semibold text-gray-800">Tyche</h1>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">Admin</span>

        <button className="rounded bg-red-500 px-3 py-1 text-white">
          Logout
        </button>
      </div>
    </div>
  );
}
