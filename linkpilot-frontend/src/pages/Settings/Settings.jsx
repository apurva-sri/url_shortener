import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../store/AuthContext.jsx";
import {
  User as UserIcon,
  Lock,
  CreditCard,
  Camera,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  FileText,
} from "lucide-react";
import Button from "../../components/common/Button/Button.jsx";
import { updateProfile, changePassword } from "../../api/auth.api.js";
import { createOrder, verifyPayment, getMyInvoices } from "../../api/payment.api.js";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function Settings() {
  const { user, setSession } = useAuth();
  const [activeTab, setActiveTab] = useState("profile"); // profile, security, billing
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success'|'error', text: '' }

  // Fetch Invoices
  const { data: invoicesData, isLoading: invoicesLoading, refetch: refetchInvoices } = useQuery({
    queryKey: ["my-invoices"],
    queryFn: getMyInvoices,
    enabled: activeTab === "billing",
  });

  const invoices = invoicesData?.data || [];

  const handleDownloadInvoice = (invoice) => {
    const win = window.open("", "_blank", "width=800,height=900");
    if (!win) return;
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${invoice.invoiceNumber}</title>
          <style>
            body { font-family: 'Segoe UI', Roboto, sans-serif; padding: 40px; color: #0f172a; line-height: 1.6; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; }
            .logo { font-size: 24px; font-weight: 800; color: #6366F1; }
            .badge { background: #dcfce7; color: #15803d; font-size: 11px; font-weight: bold; padding: 4px 12px; border-radius: 99px; }
            .details { margin-top: 30px; display: flex; justify-content: space-between; }
            .table { width: 100%; border-collapse: collapse; margin-top: 30px; }
            .table th, .table td { border: 1px solid #e2e8f0; padding: 12px; text-align: left; font-size: 13px; }
            .table th { background: #f8fafc; font-weight: 600; text-transform: uppercase; font-size: 11px; color: #64748b; }
            .total { margin-top: 24px; text-align: right; font-size: 18px; font-weight: bold; color: #0f172a; }
            .btn { background: #6366F1; color: white; border: none; padding: 10px 24px; border-radius: 10px; cursor: pointer; font-weight: bold; margin-top: 30px; }
            @media print { .btn { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">🚀 LinkPilot</div>
            <span class="badge">PAID</span>
          </div>
          <div class="details">
            <div>
              <h3 style="margin:0 0 8px 0; color:#6366F1;">INVOICE RECEIPT</h3>
              <p style="margin:2px 0;"><strong>Invoice #:</strong> ${invoice.invoiceNumber}</p>
              <p style="margin:2px 0;"><strong>Date:</strong> ${new Date(invoice.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
              <p style="margin:2px 0;"><strong>Payment ID:</strong> ${invoice.razorpayPaymentId || "pay_verified"}</p>
            </div>
            <div style="text-align:right;">
              <h3 style="margin:0 0 8px 0;">Billed To</h3>
              <p style="margin:2px 0;"><strong>${user?.name || user?.email?.split("@")[0] || "Customer"}</strong></p>
              <p style="margin:2px 0; color:#64748b;">${user?.email || ""}</p>
            </div>
          </div>
          <table class="table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Billing Cycle</th>
                <th>Amount Paid</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>LinkPilot <strong>${invoice.plan}</strong> Plan Subscription</td>
                <td>Monthly Access</td>
                <td>₹${(invoice.amount / 100).toFixed(2)} ${invoice.currency}</td>
              </tr>
            </tbody>
          </table>
          <div class="total">
            Total Paid: ₹${(invoice.amount / 100).toFixed(2)}
          </div>
          <button class="btn" onclick="window.print()">Download / Print PDF</button>
        </body>
      </html>
    `;
    win.document.write(html);
    win.document.close();
  };

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

  const handleUpgrade = async (targetPlan) => {
    setLoading(true);
    setMessage(null);

    try {
      const orderRes = await createOrder(targetPlan);
      const orderData = orderRes.data;

      // Real Razorpay Checkout integration — user must pay via Razorpay modal
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setMessage({ type: "error", text: "Failed to load Razorpay payment SDK." });
        setLoading(false);
        return;
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "LinkPilot",
        description: `Upgrade to ${targetPlan} Plan`,
        order_id: orderData.orderId,
        handler: async (response) => {
          try {
            const verifyRes = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              plan: targetPlan,
            });
            if (verifyRes?.data) {
              setSession({ user: verifyRes.data });
              setMessage({ type: "success", text: `Payment successful! Upgraded to ${targetPlan} plan.` });
              refetchInvoices();
            }
          } catch (err) {
            setMessage({ type: "error", text: err.response?.data?.message || "Payment verification failed." });
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.phone || "",
        },
        theme: {
          color: "#6366F1",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        setMessage({ type: "error", text: response.error.description || "Payment failed." });
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || err.message || "Failed to initiate checkout." });
      setLoading(false);
    }
  };

  const currentPlan = (user?.plan || "FREE").toUpperCase();

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
        {/* Navigation Tabs */}
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
            Billing & Subscriptions
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

          {/* BILLING & SUBSCRIPTIONS PANEL */}
          {activeTab === "billing" && (
            <div className="space-y-8">
              <div>
                <h2 className="font-display text-lg font-bold text-ink border-b border-line pb-2.5">Plans &amp; Subscriptions</h2>
                <p className="text-slate text-xs mt-1">Upgrade your subscription tier with Razorpay checkout or manage existing plan limits.</p>
              </div>

              {/* 3-Card Pricing Table */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* FREE PLAN ($0) */}
                <div className={`rounded-2xl border p-6 flex flex-col justify-between transition-all ${currentPlan === "FREE" ? "border-accent bg-accent-50/20 shadow-sm" : "border-line bg-white"}`}>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-display text-lg font-bold text-ink">Free Plan</h3>
                      {currentPlan === "FREE" && (
                        <span className="bg-mist border border-line text-ink text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Current Plan
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate min-h-[36px]">Perfect for starting out and basic link shortening needs.</p>
                    <div className="my-4">
                      <span className="text-3xl font-extrabold text-ink">$0</span>
                      <span className="text-xs text-slate">/mo</span>
                    </div>

                    <ul className="space-y-2.5 text-xs text-slate mb-6">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                        <span><strong>2 active links</strong> limit</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                        <span>Standard black & white QR codes</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                        <span>Basic redirection logs</span>
                      </li>
                      <li className="flex items-center gap-2 opacity-50">
                        <AlertCircle size={14} className="text-slate shrink-0" />
                        <span className="line-through">Custom aliases & tags</span>
                      </li>
                      <li className="flex items-center gap-2 opacity-50">
                        <AlertCircle size={14} className="text-slate shrink-0" />
                        <span className="line-through">Password protection</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    disabled
                    className="w-full py-2.5 rounded-xl border border-line bg-mist text-ink font-semibold text-xs opacity-70 cursor-default"
                  >
                    {currentPlan === "FREE" ? "Current Plan" : "Free Tier"}
                  </button>
                </div>

                {/* STARTER PLAN ($1) */}
                <div className={`rounded-2xl border p-6 flex flex-col justify-between transition-all ${currentPlan === "STARTER" ? "border-accent bg-accent-50/20 shadow-sm" : "border-line bg-white"}`}>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-display text-lg font-bold text-ink">Starter Plan</h3>
                      {currentPlan === "STARTER" && (
                        <span className="bg-accent text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                          Current Plan
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate min-h-[36px]">For individual creators needing custom aliases & analytics.</p>
                    <div className="my-4">
                      <span className="text-3xl font-extrabold text-ink">$1</span>
                      <span className="text-xs text-slate">/mo</span>
                    </div>

                    <ul className="space-y-2.5 text-xs text-slate mb-6">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                        <span><strong>10 active links</strong> limit</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                        <span>Custom aliases & tags</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                        <span>Branded customized QR codes</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                        <span>Deep device & visitor analytics</span>
                      </li>
                      <li className="flex items-center gap-2 opacity-50">
                        <AlertCircle size={14} className="text-slate shrink-0" />
                        <span className="line-through">Password protection (Pro only)</span>
                      </li>
                    </ul>
                  </div>

                  {currentPlan === "STARTER" ? (
                    <button disabled className="w-full py-2.5 rounded-xl border border-line bg-mist text-ink font-semibold text-xs opacity-70">
                      Current Plan
                    </button>
                  ) : (
                    <Button
                      onClick={() => handleUpgrade("STARTER")}
                      disabled={loading}
                      className="w-full py-2.5 text-xs flex items-center justify-center gap-1.5"
                    >
                      {loading && <Loader2 className="animate-spin" size={14} />}
                      Upgrade to Starter ($1)
                    </Button>
                  )}
                </div>

                {/* PRO PLAN ($19) */}
                <div className={`relative rounded-2xl border p-6 flex flex-col justify-between transition-all ${currentPlan === "PRO" ? "border-accent bg-accent-50/20 shadow-md" : "border-accent bg-white shadow-sm"}`}>
                  <div className="absolute -top-3 right-6 bg-accent text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                    <Sparkles size={11} /> MOST POPULAR
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-display text-lg font-bold text-ink">Pro Plan</h3>
                      {currentPlan === "PRO" && (
                        <span className="bg-accent text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                          Current Plan
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate min-h-[36px]">For growing brands who need advanced tracking & link security.</p>
                    <div className="my-4">
                      <span className="text-3xl font-extrabold text-ink">$19</span>
                      <span className="text-xs text-slate">/mo</span>
                    </div>

                    <ul className="space-y-2.5 text-xs text-slate mb-6">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                        <span><strong>Unlimited</strong> shortened links</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                        <span>Custom aliases & tags</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                        <span><strong>Password protection</strong> on links</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                        <span>Branded customized QR codes</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                        <span>Deep device/visitor analytics</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                        <span>Custom domains integration</span>
                      </li>
                    </ul>
                  </div>

                  {currentPlan === "PRO" ? (
                    <button disabled className="w-full py-2.5 rounded-xl border border-line bg-mist text-ink font-semibold text-xs opacity-70">
                      Current Plan
                    </button>
                  ) : (
                    <Button
                      onClick={() => handleUpgrade("PRO")}
                      disabled={loading}
                      className="w-full py-2.5 text-xs bg-accent hover:bg-accent/90 text-white flex items-center justify-center gap-1.5"
                    >
                      {loading && <Loader2 className="animate-spin" size={14} />}
                      Upgrade to Pro ($19)
                    </Button>
                  )}
                </div>
              </div>

              {/* Invoice History Section */}
              <div className="space-y-4 pt-6 border-t border-line">
                <div>
                  <h3 className="font-display text-base font-bold text-ink">Billing & Invoice History</h3>
                  <p className="text-slate text-xs mt-1">View and download official PDF tax invoices for your subscription payments.</p>
                </div>

                {invoicesLoading ? (
                  <div className="py-8 grid place-items-center"><Loader2 className="animate-spin text-accent" size={20} /></div>
                ) : invoices.length === 0 ? (
                  <div className="rounded-xl border border-line bg-mist/20 px-6 py-8 text-center">
                    <p className="text-xs text-slate font-medium">No paid invoices found. When you upgrade your plan, your invoice will appear here.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-line bg-white">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-mist/50 border-b border-line text-slate font-semibold uppercase">
                        <tr>
                          <th className="px-4 py-3">Invoice #</th>
                          <th className="px-4 py-3">Date</th>
                          <th className="px-4 py-3">Plan</th>
                          <th className="px-4 py-3">Amount</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-line">
                        {invoices.map((inv) => (
                          <tr key={inv.id} className="hover:bg-mist/20 transition">
                            <td className="px-4 py-3 font-semibold text-ink">{inv.invoiceNumber}</td>
                            <td className="px-4 py-3 text-slate">{new Date(inv.createdAt).toLocaleDateString()}</td>
                            <td className="px-4 py-3 font-bold text-accent">{inv.plan}</td>
                            <td className="px-4 py-3 font-semibold text-ink">₹{(inv.amount / 100).toFixed(2)}</td>
                            <td className="px-4 py-3">
                              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                {inv.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button
                                onClick={() => handleDownloadInvoice(inv)}
                                className="font-semibold text-accent hover:underline text-xs flex items-center gap-1 ml-auto"
                              >
                                Download PDF
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
