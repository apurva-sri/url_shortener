import { useState } from "react";
import { Search, Bell, ChevronDown, LogOut } from "lucide-react";
import { useAuth } from "../../../store/AuthContext.jsx";

export default function Topbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const initials = (user?.email || "U").slice(0, 2).toUpperCase();

  return (
    <header className="flex h-16 items-center justify-between border-b border-line bg-white px-6 shrink-0">
      {/* Search Bar */}
      <div className="relative w-full max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate" />
        <input
          placeholder="Search anything..."
          className="w-full rounded-lg border border-line bg-mist py-2 pl-9 pr-12 text-sm text-ink placeholder:text-slate focus:outline-none focus:ring-2 focus:ring-accent/40"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-line bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate">
          ⌘K
        </kbd>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications Button */}
        <button
          aria-label="Notifications"
          className="relative grid h-9 w-9 place-items-center rounded-full border border-line text-slate hover:bg-mist hover:text-ink transition"
          title="Notifications"
        >
          <Bell size={16} />
          <span className="absolute top-1 right-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* Profile Dropdown */}
        <div className="relative font-display">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-3 rounded-full py-1 pl-1 pr-2 hover:bg-mist transition"
          >
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80"
              alt="Anurag"
              className="h-8 w-8 rounded-full object-cover border border-line"
            />
            <span className="hidden text-left sm:block">
              <span className="block text-sm font-bold leading-tight text-ink">
                {user?.email?.split("@")[0] || "Anurag"}
              </span>
              <span className="block text-[10px] font-semibold leading-tight text-accent mt-0.5">
                Pro Plan
              </span>
            </span>
            <ChevronDown size={14} className="text-slate" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-12 z-20 w-48 rounded-xl border border-line bg-white p-1 shadow-lg">
              <div className="px-3 py-2 text-xs border-b border-line text-slate">
                Signed in as <span className="font-semibold text-ink">{user?.email || "anurag@example.com"}</span>
              </div>
              <button
                onClick={logout}
                className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-slate hover:bg-mist hover:text-red-600 transition"
              >
                <LogOut size={14} /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
