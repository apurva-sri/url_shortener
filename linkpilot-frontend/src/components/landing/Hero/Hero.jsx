import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useAuth } from "../../../store/AuthContext.jsx";

export default function Hero() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative overflow-hidden bg-paper px-6 pb-20 pt-20 lg:px-10 lg:pt-28">
      {/* faint corner grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative mx-auto max-w-4xl text-center">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-pill border border-line bg-mist px-4 py-1.5 text-xs font-medium text-slate"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Built for growth teams who ship links daily
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display mt-6 text-5xl font-bold leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-7xl"
        >
          Shorter links.
          <br />
          <span className="italic font-semibold text-accent">Smarter</span>{" "}
          growth.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-6 max-w-xl text-base text-slate sm:text-lg"
        >
          Shorten, protect, and track every link from one dashboard.
          Custom aliases, QR codes, and real-time analytics — no clutter,
          just the numbers that matter.
        </motion.p>

        {/* Clean, high-conversion Call To Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {isAuthenticated ? (
            <Link to="/dashboard">
              <button className="rounded-full bg-ink hover:bg-ink2 px-8 py-3.5 text-sm font-bold text-white transition shadow-sm flex items-center gap-2">
                Go to Workspace <ArrowRight size={16} />
              </button>
            </Link>
          ) : (
            <>
              <Link to="/register">
                <button className="rounded-full bg-ink hover:bg-ink2 px-8 py-3.5 text-sm font-bold text-paper transition shadow-sm flex items-center gap-2">
                  Get Started for free <ArrowRight size={16} />
                </button>
              </Link>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
