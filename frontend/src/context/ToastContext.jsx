import { createContext, useCallback, useContext, useRef, useState } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info
};

const STYLES = {
  success: "border-moss-200 bg-moss-50 text-moss-800 dark:border-moss-700 dark:bg-moss-900/40 dark:text-moss-100",
  error: "border-brick-400/40 bg-red-50 text-brick-600 dark:border-brick-500/40 dark:bg-red-950/40 dark:text-brick-400",
  info: "border-ink-200 bg-white text-ink-700 dark:border-ink-700 dark:bg-ink-800 dark:text-ink-100"
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const notify = useCallback(
    (message, type = "info") => {
      const id = ++idRef.current;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => dismiss(id), 4000);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2 sm:w-auto">
        {toasts.map((t) => {
          const Icon = ICONS[t.type] || Info;
          return (
            <div
              key={t.id}
              role="status"
              className={`animate-rise flex items-start gap-2 rounded-xl border px-4 py-3 text-sm shadow-raised ${STYLES[t.type]}`}
            >
              <Icon size={18} className="mt-0.5 shrink-0" />
              <p className="flex-1">{t.message}</p>
              <button
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss notification"
                className="shrink-0 rounded p-0.5 opacity-60 hover:opacity-100"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
