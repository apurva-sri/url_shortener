import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useAuth } from "../../../store/AuthContext.jsx";

const NAV_LINKS = [
  { label: "Features", to: "/#features" },
  { label: "Analytics", to: "/#analytics" },
  { label: "Pricing", to: "/#pricing" },
  { label: "Docs", to: "/#docs" },
];

export default function Navbar() {
  const { isAuthenticated } = useAuth();
  const [hovered, setHovered] = useState(null);
  const [dark, setDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Monitor scrolling to transition the width and style of the floating pill
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full py-3 bg-transparent transition-all duration-300">
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
            <NavLink
              key={link.label}
              to={link.to}
              onMouseEnter={() => setHovered(link.label)}
              className="relative z-10 rounded-pill px-4 py-2 text-sm font-medium text-slate transition-colors duration-200 hover:text-white"
            >
              {hovered === link.label && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 -z-10 rounded-pill bg-ink"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative">{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Right side — theme toggle + auth actions */}
        <div className="flex items-center gap-3">
          <button
            aria-label="Toggle theme"
            onClick={() => setDark((d) => !d)}
            className="grid h-9 w-9 place-items-center rounded-full border border-line text-ink transition hover:bg-mist"
          >
            {dark ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="rounded-pill bg-ink px-5 py-2 text-sm font-medium text-white transition hover:bg-ink2"
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
                className="rounded-pill bg-ink px-5 py-2 text-sm font-medium text-white transition hover:bg-accent"
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
