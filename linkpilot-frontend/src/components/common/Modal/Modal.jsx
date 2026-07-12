import { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({ open, onClose, title, children, maxWidth = "max-w-md" }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4">
      <div className={`w-full ${maxWidth} rounded-2xl border border-line bg-white p-6 shadow-xl`}>
        <div className="mb-4 flex items-center justify-between">
          {title && <h2 className="font-display text-lg font-bold text-ink">{title}</h2>}
          <button
            onClick={onClose}
            className="ml-auto grid h-8 w-8 place-items-center rounded-full text-slate hover:bg-mist"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
