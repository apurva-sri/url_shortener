import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useAuth } from "../../../store/AuthContext.jsx";

const NAV_LINKS = [
  { label: "Features", hash: "features" },
  { label: "Analytics", hash: "analytics" },
  { label: "Pricing", hash: "pricing" },
  { label: "About", hash: "about" },
];

export default function Navbar() {
  const { isAuthenticated } = useAuth();
  const [hovered, setHovered] = useState(null);
  const [dark, setDark] = useState(() => {
    // Persist preference across reloads
    return localStorage.getItem("lp-theme") === "dark";
  });
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Apply / remove dark class on <html>
  useEffect(() => {
    const html = document.documentElement;
    if (dark) {
      html.classList.add("dark");
      localStorage.setItem("lp-theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("lp-theme", "light");
    }
  }, [dark]);

  // Monitor scrolling for the floating pill effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (hash) => {
    if (location.pathname !== "/") {
      // Navigate to landing page then scroll
      navigate(`/#${hash}`);
    } else {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className={`sticky top-0 z-50 w-full bg-transparent transition-all duration-300 ${scrolled ? "py-1.5" : "py-4"}`}>
      <div
        className={`mx-auto flex items-center justify-between transition-all duration-500 ease-pilot ${
          scrolled
            ? "max-w-5xl w-[92%] rounded-full border border-line bg-paper/95 shadow-md px-6 h-[58px] backdrop-blur-md"
            : "max-w-7xl w-[96%] rounded-full border border-transparent bg-paper/75 px-6 h-[72px] backdrop-blur-md"
        }`}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src="/logo/linkpilot-mark.svg" alt="LinkPilot" className="h-7 w-7" />
          <span className="font-display text-lg font-bold tracking-tight text-ink">
            LinkPilot
          </span>
        </Link>

        {/* Centered nav */}
        <nav
          className="relative hidden items-center gap-1 rounded-pill border border-line bg-paper/60 p-1 md:flex"
          onMouseLeave={() => setHovered(null)}
        >
          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.hash)}
              onMouseEnter={() => setHovered(link.label)}
              className="relative z-10 rounded-pill px-4 py-2 text-sm font-medium text-slate transition-colors duration-200 hover:text-white cursor-pointer"
            >
              {hovered === link.label && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 -z-10 rounded-pill bg-ink"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative">{link.label}</span>
            </button>
          ))}
        </nav>

        {/* Right side — theme toggle + auth actions */}
        <div className="flex items-center gap-3">
          <button
            aria-label="Toggle theme"
            onClick={() => setDark((d) => !d)}
            className="grid h-9 w-9 place-items-center rounded-full border border-line bg-paper text-ink transition hover:bg-mist"
            title={dark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="rounded-pill bg-ink px-5 py-2 text-sm font-medium text-paper transition hover:bg-ink2"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden text-sm font-medium text-ink transition hover:text-accent sm:block"
              >
                Log in
              </Link>

              <Link
                to="/register"
                className="rounded-pill bg-ink px-5 py-2 text-sm font-medium text-paper transition hover:bg-accent"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
