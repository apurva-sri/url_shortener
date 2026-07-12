import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { verifyEmail, resendOTP } from "../../api/auth.api.js";
import Input from "../../components/common/Input/Input.jsx";
import Button from "../../components/common/Button/Button.jsx";
import { AuthShell } from "../Register/Register.jsx";

export default function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [resent, setResent] = useState(false);

  const verifyMutation = useMutation({
    mutationFn: verifyEmail,
    onSuccess: () => navigate("/login", { state: { verified: true } }),
    onError: (err) => setError(err.message),
  });

  const resendMutation = useMutation({
    mutationFn: resendOTP,
    onSuccess: () => setResent(true),
    onError: (err) => setError(err.message),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    verifyMutation.mutate({ email, otp });
  };

  return (
    <AuthShell
      title="Verify your email"
      subtitle={email ? `Enter the code sent to ${email}` : "Enter the code we emailed you"}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="6-digit code"
          inputMode="numeric"
          maxLength={6}
          required
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          className="tracking-[0.4em] text-center"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}
        {resent && !error && (
          <p className="text-sm text-emerald-600">A new code was sent.</p>
        )}

        <Button type="submit" loading={verifyMutation.isPending} className="mt-2 w-full">
          Verify email
        </Button>

        <button
          type="button"
          onClick={() => resendMutation.mutate({ email })}
          disabled={resendMutation.isPending}
          className="text-sm font-medium text-slate hover:text-ink disabled:opacity-60"
        >
          {resendMutation.isPending ? "Sending..." : "Resend code"}
        </button>
      </form>
    </AuthShell>
  );
}
