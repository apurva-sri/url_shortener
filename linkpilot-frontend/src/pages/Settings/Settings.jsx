import { useState } from "react";
import { useAuth } from "../../store/AuthContext.jsx";
import {
  User as UserIcon,
  Lock,
  CreditCard,
  Camera,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Button from "../../components/common/Button/Button.jsx";
import { updateProfile, changePassword } from "../../api/auth.api.js";


export default function Settings() {
  const { user, setSession } = useAuth();
  const [activeTab, setActiveTab] = useState("profile"); // profile, security, billing
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success'|'error', text: '' }

  // Profile Form States
  const [name, setName] = useState(user?.name || user?.email?.split("@")[0] || "");
  const [username, setUsername] = useState(user?.username || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [avatar, setAvatar] = useState(
    user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80"
  );

  // Security Form States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        setMessage({ type: "error", text: "Image must be less than 1MB" });
        setTimeout(() => setMessage(null), 3000);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    updateProfile({ name, username, phone, avatar })
      .then((res) => {
        setLoading(false);
        if (res.success && res.data) {
          setSession({ user: res.data });
          setMessage({ type: "success", text: "Profile settings saved successfully!" });
        } else {
          setMessage({ type: "error", text: res.message || "Failed to update profile." });
        }
        setTimeout(() => setMessage(null), 4000);
      })
      .catch((err) => {
        setLoading(false);
        setMessage({ type: "error", text: err.message || "Failed to update profile." });
        setTimeout(() => setMessage(null), 4000);
      });
  };

  const handleSecuritySubmit = (e) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match!" });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "New password must be at least 6 characters!" });
      return;
    }

    setLoading(true);

    changePassword({ currentPassword, newPassword })
      .then((res) => {
        setLoading(false);
        if (res.success) {
          setMessage({ type: "success", text: "Password updated successfully!" });
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        } else {
          setMessage({ type: "error", text: res.message || "Failed to change password." });
        }
        setTimeout(() => setMessage(null), 4000);
      })
      .catch((err) => {
        setLoading(false);
        setMessage({ type: "error", text: err.message || "Failed to change password." });
        setTimeout(() => setMessage(null), 4000);
      });
  };

  const handleDownloadInvoice = (invoiceId) => {
    alert(`Downloading invoice ${invoiceId} in PDF format...`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink">Account Settings</h1>
        <p className="text-slate text-sm mt-1">Manage your workspace identity, credentials, and plan subscription details.</p>
      </div>

      {message && (
        <div
          className={`flex items-center gap-2.5 rounded-xl border p-4 text-sm transition-all duration-300 ${
            message.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {message.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{message.text}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Navigation Tabs (Left Sidebar layout on desktop) */}
        <div className="w-full md:w-64 rounded-2xl border border-line bg-white p-2.5 flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible no-scrollbar shrink-0">
          <button
            onClick={() => { setActiveTab("profile"); setMessage(null); }}
            className={`flex items-center gap-3 w-full rounded-xl px-4 py-3 text-sm font-medium transition whitespace-nowrap ${
              activeTab === "profile"
                ? "bg-accent-50 text-accent font-semibold"
                : "text-slate hover:bg-mist hover:text-ink"
            }`}
          >
            <UserIcon size={18} />
            My Profile
          </button>
          <button
            onClick={() => { setActiveTab("security"); setMessage(null); }}
            className={`flex items-center gap-3 w-full rounded-xl px-4 py-3 text-sm font-medium transition whitespace-nowrap ${
              activeTab === "security"
                ? "bg-accent-50 text-accent font-semibold"
                : "text-slate hover:bg-mist hover:text-ink"
            }`}
          >
            <Lock size={18} />
            Security & Passwords
          </button>
          <button
            onClick={() => { setActiveTab("billing"); setMessage(null); }}
            className={`flex items-center gap-3 w-full rounded-xl px-4 py-3 text-sm font-medium transition whitespace-nowrap ${
              activeTab === "billing"
                ? "bg-accent-50 text-accent font-semibold"
                : "text-slate hover:bg-mist hover:text-ink"
            }`}
          >
            <CreditCard size={18} />
            Billing & Invoices
          </button>
        </div>

        {/* Tab View Panels */}
        <div className="flex-1 w-full rounded-2xl border border-line bg-white p-6 md:p-8">
          {/* PROFILE PANEL */}
          {activeTab === "profile" && (
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div>
                <h2 className="font-display text-lg font-bold text-ink border-b border-line pb-2.5">Profile Details</h2>
                <p className="text-slate text-xs mt-1">Configure your personal public account profile avatar and labels.</p>
              </div>

              {/* Avatar Selector */}
              <div className="flex items-center gap-6">
                <div className="relative group h-20 w-20 rounded-full overflow-hidden border border-line bg-mist shadow-xs">
                  <img
                    src={avatar}
                    alt="Profile Avatar"
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <label
                    htmlFor="avatar-upload"
                    className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-200"
                    title="Change Photo"
                  >
                    <Camera size={16} />
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-ink">Profile Avatar</h4>
                  <p className="text-xs text-slate">Supports JPG or PNG formats under 1MB. Resolution defaults to 1:1.</p>
                  <label
                    htmlFor="avatar-upload"
                    className="inline-block mt-1 text-xs font-semibold text-accent hover:underline cursor-pointer"
                  >
                    Upload custom photo
                  </label>
                </div>
              </div>

              {/* Input Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full rounded-xl border border-line bg-mist px-4 py-2.5 text-sm text-slate select-none cursor-not-allowed"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate uppercase tracking-wider">Display Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Anurag"
                    className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-ink placeholder:text-slate focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate uppercase tracking-wider">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. anurag_short"
                    className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-ink placeholder:text-slate focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate uppercase tracking-wider">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-ink placeholder:text-slate focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-line flex justify-end">
                <Button type="submit" disabled={loading} className="w-full md:w-auto px-6 flex items-center justify-center gap-2">
                  {loading && <Loader2 className="animate-spin" size={14} />}
                  Save Changes
                </Button>
              </div>
            </form>
          )}

          {/* SECURITY PANEL */}
          {activeTab === "security" && (
            <form onSubmit={handleSecuritySubmit} className="space-y-6">
              <div>
                <h2 className="font-display text-lg font-bold text-ink border-b border-line pb-2.5">Security Settings</h2>
                <p className="text-slate text-xs mt-1">Manage your login credential tokens to keep your link pilot secure.</p>
              </div>

              <div className="space-y-4 max-w-md">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate uppercase tracking-wider">Current Password</label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-ink placeholder:text-slate focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate uppercase tracking-wider">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-ink placeholder:text-slate focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate uppercase tracking-wider">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Match new password"
                    className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-ink placeholder:text-slate focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-line flex justify-end">
                <Button type="submit" disabled={loading} className="w-full md:w-auto px-6 flex items-center justify-center gap-2">
                  {loading && <Loader2 className="animate-spin" size={14} />}
                  Update Password
                </Button>
              </div>
            </form>
          )}

          {/* BILLING PANEL */}
          {activeTab === "billing" && (
            <div className="space-y-8">
              <div>
                <h2 className="font-display text-lg font-bold text-ink border-b border-line pb-2.5">Plan &amp; Subscriptions</h2>
                <p className="text-slate text-xs mt-1">Review your current plan and usage.</p>
              </div>

              {/* Free Plan Card */}
              <div className="rounded-2xl border border-line bg-mist/30 p-6 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate bg-mist border border-line px-2 py-0.5 rounded-full">
                    FREE PLAN
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold text-ink">LinkPilot Free</h3>
                <p className="text-xs text-slate max-w-md">
                  You are on the free plan. All core features — link shortening, QR codes, and click analytics — are fully available.
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-ink pt-2">
                  <div>
                    <span className="text-slate font-medium block">Billing Cycle:</span>
                    <span>No active subscription</span>
                  </div>
                </div>
              </div>

              {/* Invoice History */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-display text-base font-bold text-ink">Billing Invoice History</h3>
                  <p className="text-slate text-xs mt-1">No invoices yet — you haven't made any payments.</p>
                </div>
                <div className="rounded-xl border border-line bg-mist/20 px-6 py-10 text-center">
                  <p className="text-sm text-slate font-medium">No billing history available.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
