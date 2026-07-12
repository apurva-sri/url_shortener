import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Lock, AlertCircle, Loader2 } from "lucide-react";
import Button from "../../components/common/Button/Button.jsx";
import Input from "../../components/common/Input/Input.jsx";
import axios from "axios";

export default function RedirectPage() {
  const { shortCode } = useParams();
  const [loading, setLoading] = useState(true);
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [unlocking, setUnlocking] = useState(false);

  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
  const backendBase = apiBase.replace(/\/api\/?$/, "");
  const targetUrl = `${backendBase}/${shortCode}`;

  useEffect(() => {
    const resolveLink = async () => {
      try {
        // Fetch with manual redirect to check if it's a direct redirect or password protected
        const res = await fetch(targetUrl, { redirect: "manual" });

        // If redirect: 'manual' triggers a redirect, response type is 'opaqueredirect' or status is 0
        if (res.type === "opaqueredirect" || res.status === 0) {
          window.location.replace(targetUrl);
          return;
        }

        // If status is 200, it's returning the JSON object (indicating password required)
        if (res.status === 200) {
          const data = await res.json();
          if (data.data?.passwordRequired) {
            setPasswordRequired(true);
            setLoading(false);
            return;
          }
        }

        // Handle other non-200 responses
        if (res.status === 404) {
          setError("Short link not found or has been deleted.");
        } else if (res.status === 410) {
          setError("This link has expired or has been disabled by the creator.");
        } else {
          // If it fell through, just let the browser attempt navigation
          window.location.replace(targetUrl);
        }
        setLoading(false);
      } catch (err) {
        console.error("Resolve error:", err);
        setError("Network error. Please check your internet connection.");
        setLoading(false);
      }
    };

    resolveLink();
  }, [targetUrl]);

  const handleUnlock = async (e) => {
    e.preventDefault();
    setError("");
    setUnlocking(true);

    try {
      const res = await axios.post(`${apiBase}/url/verify-password`, {
        shortCode,
        password,
      });

      if (res.data?.success && res.data?.data?.originalUrl) {
        window.location.replace(res.data.data.originalUrl);
      } else {
        setError("Something went wrong. Please try again.");
        setUnlocking(false);
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || "Invalid password. Please try again.";
      setError(errMsg);
      setUnlocking(false);
    }
  };

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-paper relative overflow-hidden">
        {/* Subtle grid background pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="z-10 flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
          <p className="font-display text-sm font-medium text-slate">Resolving short link...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid min-h-screen place-items-center bg-paper relative overflow-hidden px-6">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="z-10 w-full max-w-md text-center bg-white border border-line rounded-2xl p-8 shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h1 className="mt-4 font-display text-xl font-bold text-ink">Link Unavailable</h1>
          <p className="mt-2 text-sm text-slate leading-relaxed">{error}</p>
          <div className="mt-6">
            <Link to="/">
              <Button className="w-full">Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen place-items-center bg-paper relative overflow-hidden px-6">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      <div className="z-10 w-full max-w-sm">
        {/* Logo */}
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <img src="/logo/linkpilot-mark.svg" alt="LinkPilot" className="h-7 w-7" />
          <span className="font-display text-lg font-bold text-ink">LinkPilot</span>
        </Link>

        {/* Password Card */}
        <div className="rounded-2xl border border-line bg-white p-8 shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent-50 text-accent">
            <Lock className="h-5 w-5" />
          </div>
          
          <h1 className="mt-4 text-center font-display text-xl font-bold text-ink">Password Required</h1>
          <p className="mt-2 text-center text-sm text-slate leading-relaxed">
            This link is password protected. Please enter the password to continue.
          </p>

          <form onSubmit={handleUnlock} className="mt-6 flex flex-col gap-4">
            <Input
              type="password"
              placeholder="Enter password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-center"
              autoFocus
            />

            {error && <p className="text-center text-sm text-red-600 font-medium">{error}</p>}

            <Button type="submit" loading={unlocking} className="w-full">
              Unlock Link
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-slate">
            Don't have the password? <span className="font-medium text-ink hover:underline cursor-help" title="Contact the person who shared this link.">Contact the owner</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
