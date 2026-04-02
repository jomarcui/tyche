"use client";

import { useContext, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChartColumnBig, Home, Settings } from "lucide-react";
import { AuthContext } from "@/context/AuthContext";

export default function Sidebar() {
  const { user } = useContext(AuthContext)!;
  const [collapsed, setCollapsed] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const pathname = usePathname();

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <aside
      className={`flex h-screen flex-col border-r border-gray-200 bg-white transition-all duration-300 ${collapsed ? "w-20" : "w-64"}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4">
        {!collapsed && <span className="text-lg font-semibold">Tyche</span>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded p-2 hover:bg-gray-100"
        >
          ☰
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 space-y-2 overflow-y-auto p-3">
        {/* Dashboard */}
        <Link
          href="/"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${isActive("/") ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}
        >
          <Home size={18} />
          {!collapsed && "Dashboard"}
        </Link>

        {/* Analytics */}
        <Link
          href="/analytics"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${isActive("/analytics") ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}
        >
          <ChartColumnBig size={18} />
          {!collapsed && "Analytics"}
        </Link>

        {/* Dropdown */}
        <div>
          <button
            onClick={() => toggleMenu("management")}
            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <div className="flex items-center gap-3">
              <Settings size={18} />
              {!collapsed && "Management"}
            </div>
            {!collapsed && <span>{openMenu === "management" ? "▲" : "▼"}</span>}
          </button>

          {/* Submenu */}
          <div
            className={`mt-1 ml-6 space-y-1 overflow-hidden transition-all duration-300 ${openMenu === "management" ? "max-h-40" : "max-h-0"}`}
          >
            {user?.role === "admin" && (
              <Link
                href="/users"
                className="block rounded px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
              >
                Users
              </Link>
            )}

            <Link
              href="/borrowers"
              className="block rounded px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
            >
              Borrowers
            </Link>
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4 text-xs text-gray-400">
        {!collapsed && "© 2026 MyAdmin"}
      </div>
    </aside>
  );
}
