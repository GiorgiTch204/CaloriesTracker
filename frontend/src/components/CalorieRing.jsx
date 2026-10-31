// The dashboard's signature mark: a large calorie ring rendered in the
// display serif, reused (smaller) as the loading motif so the brand feels
// consistent whether data is arriving or already here.
export default function CalorieRing({ consumed, target, size = 180, onDark = false }) {
  const radius = size / 2 - 14;
  const circumference = 2 * Math.PI * radius;
  const pct = target > 0 ? Math.min(consumed / target, 1) : 0;
  const offset = circumference * (1 - pct);
  const over = target > 0 && consumed > target;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={12}
          className={onDark ? "text-white/10" : "text-ink-100 dark:text-ink-700"}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={12}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`transition-[stroke-dashoffset] duration-700 ease-out ${over ? "text-brick-500" : "text-moss-500"}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={`font-display text-3xl font-semibold tabular-nums ${
            onDark ? "text-white" : "text-ink-900 dark:text-ink-50"
          }`}
        >
          {Math.round(consumed).toLocaleString()}
        </span>
        <span className={`text-xs ${onDark ? "text-ink-300" : "text-ink-500 dark:text-ink-400"}`}>
          of {Math.round(target).toLocaleString()} kcal
        </span>
      </div>
    </div>
  );
}
