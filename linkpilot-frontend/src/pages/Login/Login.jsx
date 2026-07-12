import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { login as loginApi } from "../../api/auth.api.js";
import { useAuth } from "../../store/AuthContext.jsx";
import Input from "../../components/common/Input/Input.jsx";
import Button from "../../components/common/Button/Button.jsx";
import { AuthShell } from "../Register/Register.jsx";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setSession } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (res) => {
      // NOTE: adjust these keys once auth.service.js's login response shape
      // is confirmed — assuming { token, user } inside `data` for now.
      setSession({ token: res.data.token, user: res.data.user });
      navigate("/dashboard");
    },
    onError: (err) => setError(err.message),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    mutation.mutate(form);
  };

  return (
    <AuthShell title="Welcome back" subtitle="Log in to your LinkPilot dashboard.">
      {location.state?.verified && (
        <p className="mb-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Email verified — you can log in now.
        </p>
      )}

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
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" loading={mutation.isPending} className="mt-2 w-full">
          Log in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate">
        New to LinkPilot?{" "}
        <Link to="/register" className="font-medium text-ink hover:text-accent">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}
