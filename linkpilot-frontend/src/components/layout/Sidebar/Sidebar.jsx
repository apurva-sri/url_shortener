import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Link2,
  QrCode,
  BarChart3,
  Globe,
  Users,
  Settings,
  Code2,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../../store/AuthContext.jsx";

const LINKS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/dashboard/links", label: "Links", icon: Link2 },
  { to: "/dashboard/qr", label: "QR Codes", icon: QrCode },
  { to: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
];

const SOON = [
  { label: "Custom Domains", icon: Globe },
  { label: "Teams", icon: Users },
  { label: "API", icon: Code2 },
];

export default function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-line bg-white px-4 py-6">
      {/* Brand logo */}
      <div className="mb-6 flex items-center gap-2 px-2">
        <img src="/logo/linkpilot-mark.svg" alt="LinkPilot" className="h-7 w-7" />
        <span className="font-display text-lg font-bold text-ink">LinkPilot</span>
      </div>

      {/* Navigation menu */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto no-scrollbar">
        {LINKS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-accent-50 text-accent font-semibold"
                  : "text-slate hover:bg-mist hover:text-ink"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}

        <NavLink
          to="/dashboard/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
              isActive
                ? "bg-accent-50 text-accent font-semibold"
                : "text-slate hover:bg-mist hover:text-ink"
            }`
          }
        >
          <Settings size={18} />
          Settings
        </NavLink>

        <div className="my-2 border-t border-line" />

        {SOON.map(({ label, icon: Icon }) => (
          <div
            key={label}
            title="Coming soon"
            className="flex cursor-not-allowed items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-slate/50 hover:bg-mist/30"
          >
            <span className="flex items-center gap-3">
              <Icon size={18} />
              {label}
            </span>
            <span className="rounded bg-mist px-1.5 py-0.5 text-[10px] font-semibold text-slate/60">
              Soon
            </span>
          </div>
        ))}

        <div className="my-2 border-t border-line" />

        <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate transition hover:bg-mist hover:text-ink">
          <HelpCircle size={18} />
          Help & Support
        </button>
      </nav>

      {/* Pro Upgrade Card */}
      <div className="mt-4 mb-4 rounded-xl border border-line bg-paper p-4 relative overflow-hidden shrink-0">
        <div className="absolute -right-4 -bottom-4 w-12 h-12 bg-accent/5 rounded-full" />
        <h4 className="font-display text-xs font-bold text-ink">Upgrade to Pro</h4>
        <p className="mt-1 text-[11px] text-slate leading-relaxed">
          Unlock advanced features and grow your brand.
        </p>
        <button className="mt-3 w-full rounded-lg bg-ink py-2 text-xs font-semibold text-white transition hover:bg-ink/90">
          Upgrade Now
        </button>
      </div>

      {/* Logout button */}
      <button
        onClick={logout}
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate transition hover:bg-mist hover:text-red-600 shrink-0"
      >
        <LogOut size={18} />
        Log out
      </button>
    </aside>
  );
}
