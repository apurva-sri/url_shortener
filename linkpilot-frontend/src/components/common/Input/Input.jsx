export default function Input({ label, error, className = "", ...props }) {
  return (
    <label className="block text-left">
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-ink">
          {label}
        </span>
      )}
      <input
        className={`w-full rounded-lg border px-4 py-2.5 text-sm text-ink placeholder:text-slate focus:outline-none focus:ring-2 focus:ring-accent/40 ${
          error ? "border-red-400" : "border-line"
        } ${className}`}
        {...props}
      />
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}
