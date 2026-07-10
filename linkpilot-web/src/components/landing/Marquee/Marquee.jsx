import { motion } from "framer-motion";

const items = [
  "Analytics",
  "QR Codes",
  "Password Protection",
  "Geo Tracking",
  "Custom Alias",
  "Smart Links",
  "Visitor Insights",
  "Team Workspace",
];

function LandingMarquee() {
  const marqueeItems = [...items, ...items];

  return (
    <section className="overflow-hidden border-y border-neutral-200 bg-white py-6">
      <motion.div
        className="flex w-max gap-12"
        animate={{
          x: ["0%", "-50%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {marqueeItems.map((item, index) => (
          <div
            key={`${item}-${index}`}
            className="flex items-center gap-12 whitespace-nowrap"
          >
            <span className="text-xl font-semibold text-neutral-400">
              {item}
            </span>

            <span className="text-neutral-300">•</span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}

export default LandingMarquee;
