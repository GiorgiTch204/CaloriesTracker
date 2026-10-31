import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export default function Modal({ open, onClose, title, children, maxWidth = "max-w-lg" }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    panelRef.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/40 p-0 sm:items-center sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`animate-rise max-h-[92vh] w-full overflow-y-auto scroll-thin rounded-t-2xl bg-white p-5 shadow-raised dark:bg-ink-800 sm:rounded-2xl sm:p-6 ${maxWidth}`}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink-900 dark:text-ink-50">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-full p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700 dark:hover:bg-ink-700 dark:hover:text-ink-100"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
