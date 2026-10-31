import CalorieRing from "./CalorieRing";

export default function AuthShell({ heading, sub, children, footer }) {
  return (
    <div className="flex min-h-screen bg-ink-50 dark:bg-ink-950">
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-ink-900 p-10 text-white lg:flex">
        <div className="flex items-center gap-2">
          <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
            <rect width="32" height="32" rx="8" fill="#0b1310" />
            <circle cx="16" cy="16" r="9.5" fill="none" stroke="#2d4138" strokeWidth="3" />
            <path d="M16 6.5a9.5 9.5 0 0 1 9.5 9.5" fill="none" stroke="#e8a33d" strokeWidth="3" strokeLinecap="round" />
            <path d="M16 6.5a9.5 9.5 0 0 1 8 4.6" fill="none" stroke="#1f7a5c" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <span className="font-display text-lg font-semibold">NutriTrack</span>
        </div>

        <div>
          <div className="mb-8 flex items-center gap-6 rounded-2xl border border-white/10 bg-white/5 p-6">
            <CalorieRing consumed={1540} target={2000} size={120} onDark />
            <div>
              <p className="font-display text-2xl font-semibold leading-tight">
                Know exactly<br />what's left today.
              </p>
            </div>
          </div>
          <p className="max-w-sm text-ink-300">
            Log meals in seconds, watch your macros fill in real time, and see the trend behind every day you track.
          </p>
        </div>

        <p className="text-xs text-ink-400">&copy; {new Date().getFullYear()} NutriTrack</p>
      </div>

      <div className="flex w-full flex-col items-center justify-center p-6 lg:w-1/2">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-2xl font-semibold text-ink-900 dark:text-ink-50">{heading}</h1>
          {sub && <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">{sub}</p>}

          <div className="mt-6 rounded-2xl border border-ink-100 bg-white p-6 shadow-soft dark:border-ink-700 dark:bg-ink-800">
            {children}
          </div>

          {footer && <p className="mt-5 text-center text-sm text-ink-500 dark:text-ink-400">{footer}</p>}
        </div>
      </div>
    </div>
  );
}
