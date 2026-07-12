import { motion } from "framer-motion";
import { Link2, BarChart3, ShieldCheck, QrCode, Zap, Clock } from "lucide-react";

const ITEMS = [
  { icon: Link2, label: "Custom short links" },
  { icon: BarChart3, label: "Real-time analytics" },
  { icon: ShieldCheck, label: "Password protected links" },
  { icon: QrCode, label: "Instant QR codes" },
  { icon: Zap, label: "Fast redirects" },
  { icon: Clock, label: "Expiry scheduling" },
];

export default function Marquee() {
  const track = [...ITEMS, ...ITEMS]; // duplicate for seamless loop

  return (
    <div className="relative w-full overflow-hidden border-y border-line py-6">
      {/* edge fade */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-paper to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-paper to-transparent" />

      <motion.div
        className="flex w-max items-center gap-12"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        whileHover={{ transitionDuration: "60s" }}
      >
        {track.map(({ icon: Icon, label }, i) => (
          <div
            key={i}
            className="flex shrink-0 items-center gap-2 text-slate"
          >
            <Icon size={18} className="text-ink" />
            <span className="font-display text-sm font-semibold tracking-tight text-ink">
              {label}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
