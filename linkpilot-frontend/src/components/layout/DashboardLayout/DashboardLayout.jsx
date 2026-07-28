import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Sidebar from "../Sidebar/Sidebar.jsx";
import Topbar from "../Topbar/Topbar.jsx";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-mist">
      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-ink/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — always visible on lg+, slide-over on mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-pilot lg:relative lg:translate-x-0 lg:z-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <Topbar onMenuToggle={() => setSidebarOpen((o) => !o)} />
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
