const COLOR = {
  protein: "bg-moss-500",
  carbohydrates: "bg-amber-400",
  fat: "bg-ink-400 dark:bg-ink-400"
};

const LABEL = {
  protein: "Protein",
  carbohydrates: "Carbs",
  fat: "Fat"
};

export default function MacroBar({ type, value, target }) {
  const pct = target > 0 ? Math.min((value / target) * 100, 100) : 0;

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between text-sm">
        <span className="font-medium text-ink-700 dark:text-ink-200">{LABEL[type]}</span>
        <span className="tabular-nums text-ink-500 dark:text-ink-400">
          {Math.round(value)}
          <span className="text-ink-400 dark:text-ink-500"> / {Math.round(target)}g</span>
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-ink-100 dark:bg-ink-700">
        <div
          className={`h-full rounded-full ${COLOR[type]} transition-all duration-700 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
