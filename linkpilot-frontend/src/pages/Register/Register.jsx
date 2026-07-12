import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { register as registerApi } from "../../api/auth.api.js";
import Input from "../../components/common/Input/Input.jsx";
import Button from "../../components/common/Button/Button.jsx";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: registerApi,
    onSuccess: () => {
      // /register sends the OTP — hand off to verify screen with the email
      navigate("/verify-otp", { state: { email: form.email } });
    },
    onError: (err) => setError(err.message),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    mutation.mutate(form);
  };

  return (
    <AuthShell title="Create your account" subtitle="Start piloting links in minutes.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Input
          label="Password"
          type="password"
          required
          minLength={8}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" loading={mutation.isPending} className="mt-2 w-full">
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-ink hover:text-accent">
          Log in
        </Link>
      </p>
    </AuthShell>
  );
}

// Shared shell for auth pages — kept local since only Register/Login/VerifyOTP use it
export function AuthShell({ title, subtitle, children }) {
  return (
    <div className="grid min-h-screen place-items-center bg-paper px-6">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <img src="/logo/linkpilot-mark.svg" alt="LinkPilot" className="h-7 w-7" />
          <span className="font-display text-lg font-bold text-ink">LinkPilot</span>
        </Link>

        <div className="rounded-2xl border border-line bg-white p-8 shadow-sm">
          <h1 className="font-display text-xl font-bold text-ink">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-slate">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
