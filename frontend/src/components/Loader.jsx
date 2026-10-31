// A signature loading moment: a ring that fills like the calorie ring on the
// dashboard, so the brand mark feels the same whether you're waiting or
// looking at data. Used both full-page (`full`) and inline inside cards.
export default function Loader({ label = "Loading", full = false, size = 64 }) {
  const content = (
    <div className="flex flex-col items-center gap-3" role="status" aria-live="polite">
      <svg width={size} height={size} viewBox="0 0 64 64" className="motion-safe:animate-[spin-slow_1.4s_linear_infinite]">
        <circle cx="32" cy="32" r="26" fill="none" stroke="currentColor" strokeWidth="5" className="text-ink-200 dark:text-ink-700" />
        <circle
          cx="32"
          cy="32"
          r="26"
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="163.4"
          strokeDashoffset="110"
          className="text-moss-500"
        />
      </svg>
      <span className="text-sm font-medium text-ink-500 dark:text-ink-300">{label}&hellip;</span>
    </div>
  );

  if (!full) return content;

  return (
    <div className="flex min-h-[50vh] w-full items-center justify-center">
      {content}
    </div>
  );
}
