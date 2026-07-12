import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  Plus,
  Copy,
  Trash2,
  Check,
  ChevronLeft,
  ChevronRight,
  Link2,
  Lock,
  Unlock,
} from "lucide-react";
import {
  createShortUrl,
  getMyUrls,
  updateUrl,
  deleteUrl,
  enablePasswordProtection,
  removePasswordProtection,
} from "../../api/url.api.js";
import Button from "../../components/common/Button/Button.jsx";
import Input from "../../components/common/Input/Input.jsx";
import Badge from "../../components/common/Badge/Badge.jsx";
import Loader from "../../components/common/Loader/Loader.jsx";
import EmptyState from "../../components/common/EmptyState/EmptyState.jsx";
import Modal from "../../components/common/Modal/Modal.jsx";
import { getShortUrl } from "../../utils/url.js";

const LIMIT = 10;

export default function MyLinks() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [creating, setCreating] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Password Settings Modal state
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [selectedUrlForPassword, setSelectedUrlForPassword] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["my-urls", { page, search, sortBy, order }],
    queryFn: () => getMyUrls({ page, limit: LIMIT, search, sortBy, order }),
    keepPreviousData: true,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["my-urls"] });

  const toggleActive = useMutation({
    mutationFn: ({ id, isActive }) => updateUrl(id, { isActive }),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id) => deleteUrl(id),
    onSuccess: invalidate,
  });

  const urls = data?.data || [];
  const pagination = data?.pagination;

  const handleCopy = (shortCode) => {
    const shortUrl = getShortUrl(shortCode);
    navigator.clipboard.writeText(shortUrl);
    setCopiedId(shortCode);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="font-display max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">My Links</h1>
          <p className="mt-1 text-sm text-slate">
            {pagination?.total ?? 0} link{pagination?.total === 1 ? "" : "s"} total
          </p>
        </div>
        <Button onClick={() => setCreating(true)}>
          <Plus size={16} /> New link
        </Button>
      </div>

      {/* Search + sort controls */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate" />
          <input
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            placeholder="Search by URL..."
            className="w-full rounded-lg border border-line bg-white py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
          />
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 font-semibold"
        >
          <option value="createdAt">Newest</option>
          <option value="clicks">Most clicked</option>
          <option value="originalUrl">URL (A–Z)</option>
        </select>

        <button
          onClick={() => setOrder((o) => (o === "asc" ? "desc" : "asc"))}
          className="rounded-lg border border-line bg-white px-4 py-2.5 text-sm text-ink font-semibold hover:bg-mist transition"
        >
          {order === "asc" ? "Ascending" : "Descending"}
        </button>
      </div>

      {creating && (
        <CreateLinkForm
          onClose={() => setCreating(false)}
          onCreated={() => {
            setCreating(false);
            invalidate();
          }}
        />
      )}

      {/* List */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
        {isLoading ? (
          <div className="grid h-40 place-items-center">
            <Loader size={24} />
          </div>
        ) : urls.length === 0 ? (
          <EmptyState
            icon={Link2}
            title="No links found"
            description="Create your first short link to see it here."
          />
        ) : (
          <div className="divide-y divide-line">
            {urls.map((u) => (
              <div key={u.id} className="flex items-center gap-4 px-5 py-4 hover:bg-mist/10 transition">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <a
                      href={getShortUrl(u.shortCode)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-bold text-ink hover:text-accent"
                    >
                      /{u.shortCode}
                    </a>
                    <Badge tone={u.isActive ? "success" : "neutral"}>
                      {u.isActive ? "Active" : "Disabled"}
                    </Badge>
                    {u.password && <Badge tone="accent">Protected</Badge>}
                  </div>
                  <p className="mt-0.5 truncate text-xs text-slate">{u.originalUrl}</p>
                </div>

                <span className="hidden shrink-0 text-sm font-semibold text-ink sm:block">
                  {u.clicks} clicks
                </span>

                {/* Password Setting Trigger */}
                <button
                  onClick={() => {
                    setSelectedUrlForPassword(u);
                    setPasswordModalOpen(true);
                  }}
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg border transition ${
                    u.password
                      ? "border-amber-200 bg-amber-55/40 text-amber-600 hover:bg-amber-50"
                      : "border-line text-slate hover:bg-mist"
                  }`}
                  title={u.password ? "Password protected - Configure" : "Password protect link"}
                >
                  <Lock size={15} />
                </button>

                <button
                  onClick={() => handleCopy(u.shortCode)}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line text-ink hover:bg-mist transition"
                  aria-label="Copy short link"
                >
                  {copiedId === u.shortCode ? <Check size={15} /> : <Copy size={15} />}
                </button>

                <button
                  onClick={() => toggleActive.mutate({ id: u.id, isActive: !u.isActive })}
                  className="hidden rounded-lg border border-line px-3 py-2 text-xs font-semibold text-ink hover:bg-mist transition sm:block"
                >
                  {u.isActive ? "Disable" : "Enable"}
                </button>

                <button
                  onClick={() => {
                    if (confirm("Delete this link? This can't be undone.")) {
                      remove.mutate(u.id);
                    }
                  }}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line text-red-600 hover:bg-red-50 transition"
                  aria-label="Delete link"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="grid h-9 w-9 place-items-center rounded-lg border border-line text-ink disabled:opacity-40 hover:bg-mist transition"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-semibold text-slate">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="grid h-9 w-9 place-items-center rounded-lg border border-line text-ink disabled:opacity-40 hover:bg-mist transition"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Password Protection Dialog */}
      <PasswordProtectionModal
        open={passwordModalOpen}
        onClose={() => {
          setPasswordModalOpen(false);
          setSelectedUrlForPassword(null);
        }}
        url={selectedUrlForPassword}
        onSaved={invalidate}
      />
    </div>
  );
}

function CreateLinkForm({ onClose, onCreated }) {
  const [originalUrl, setOriginalUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: createShortUrl,
    onSuccess: onCreated,
    onError: (err) => setError(err.message),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    mutation.mutate({
      originalUrl,
      alias: alias || undefined,
      expiresAt: expiresAt || undefined,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 grid grid-cols-1 gap-3 rounded-2xl border border-line bg-white p-5 sm:grid-cols-4 shadow-sm"
    >
      <div className="sm:col-span-2">
        <Input
          label="Destination URL"
          type="url"
          required
          placeholder="https://example.com/very/long/path"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
        />
      </div>
      <Input
        label="Custom alias (optional)"
        placeholder="my-launch"
        value={alias}
        onChange={(e) => setAlias(e.target.value)}
      />
      <Input
        label="Expires on (optional)"
        type="date"
        value={expiresAt}
        onChange={(e) => setExpiresAt(e.target.value)}
      />

      {error && <p className="sm:col-span-4 text-sm text-red-600 font-medium">{error}</p>}

      <div className="flex gap-2 sm:col-span-4 mt-2">
        <Button type="submit" loading={mutation.isPending}>
          Create link
        </Button>
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

function PasswordProtectionModal({ open, onClose, url, onSaved }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSetPassword = async (e) => {
    e.preventDefault();
    if (!password) return;
    setError("");
    setSaving(true);

    try {
      await enablePasswordProtection(url.id, password);
      setPassword("");
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to set password.");
    } finally {
      setSaving(false);
    }
  };

  const handleRemovePassword = async () => {
    setError("");
    setSaving(true);

    try {
      await removePasswordProtection(url.id);
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove password.");
    } finally {
      setSaving(false);
    }
  };

  if (!url) return null;

  return (
    <Modal open={open} onClose={onClose} title="Password Protection Settings">
      {url.password ? (
        <div className="space-y-4">
          <div className="rounded-lg bg-amber-50 p-4 border border-amber-100 flex items-start gap-3">
            <Lock className="text-amber-600 h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800">Password Protection Active</p>
              <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                This link (/{url.shortCode}) is currently protected by a password. Visitors must enter it before redirection.
              </p>
            </div>
          </div>

          {error && <p className="text-sm text-red-600 font-semibold">{error}</p>}

          <Button
            onClick={handleRemovePassword}
            loading={saving}
            className="w-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2"
          >
            <Unlock size={16} /> Remove Password Protection
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSetPassword} className="space-y-4">
          <p className="text-xs text-slate leading-relaxed">
            Require visitors to enter a password before redirecting to the destination URL:
            <span className="block mt-1 font-semibold text-ink">{url.originalUrl}</span>
          </p>

          <Input
            label="Set Password"
            type="password"
            placeholder="Min 6 characters recommended"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-sm text-red-600 font-semibold">{error}</p>}

          <Button type="submit" loading={saving} className="w-full flex items-center justify-center gap-2">
            <Lock size={16} /> Enable Password Protection
          </Button>
        </form>
      )}
    </Modal>
  );
}
