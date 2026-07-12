import { useAuth } from "../../store/AuthContext.jsx";

export default function Settings() {
  const { user } = useAuth();

  return (
    <div className="max-w-lg rounded-2xl border border-line bg-white p-6">
      <h1 className="font-display text-lg font-semibold text-ink">Settings</h1>
      <p className="mt-1 text-sm text-slate">
        Profile editing, password change, and account settings need a backend
        endpoint that doesn't exist yet (Phase 10+ on your roadmap). For now,
        here's what's on file:
      </p>
      <div className="mt-4 rounded-lg bg-mist px-4 py-3 text-sm text-ink">
        {user?.email || "—"}
      </div>
    </div>
  );
}
