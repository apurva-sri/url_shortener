const VARIANTS = {
  primary: "bg-ink text-white hover:bg-accent",
  ghost: "bg-transparent text-ink border border-line hover:bg-mist",
  danger: "bg-transparent text-red-600 border border-red-200 hover:bg-red-50",
};

export default function Button({
  children,
  variant = "primary",
  loading = false,
  disabled = false,
  className = "",
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-pill px-5 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}
