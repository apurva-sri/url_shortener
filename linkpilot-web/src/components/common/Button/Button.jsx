import clsx from "clsx";
import { motion } from "framer-motion";

function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
  ...props
}) {
  const baseClasses =
    "relative overflow-hidden rounded-2xl font-semibold transition-all duration-300 focus:outline-none";

  const variants = {
    primary: "bg-black text-white hover:bg-neutral-900",

    secondary:
      "border border-neutral-300 bg-white text-black hover:bg-neutral-100",

    ghost: "bg-transparent text-black hover:bg-neutral-100",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",

    md: "px-6 py-3",

    lg: "px-8 py-4 text-lg",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.02 }}
      className={clsx(
        baseClasses,
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export default Button;
