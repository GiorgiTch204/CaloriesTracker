import { Plus, Trash2, UtensilsCrossed } from "lucide-react";
import { MEAL_LABELS } from "../lib/format";

export default function MealCard({ mealType, entries, onAdd, onDelete }) {
  const calories = entries.reduce((sum, e) => sum + e.calories, 0);

  return (
    <div className="flex flex-col rounded-2xl border border-ink-100 bg-white p-4 dark:border-ink-700 dark:bg-ink-800">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="font-display text-base font-semibold text-ink-900 dark:text-ink-50">
            {MEAL_LABELS[mealType]}
          </h3>
          <p className="text-xs text-ink-500 dark:text-ink-400">{Math.round(calories)} kcal</p>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-1 rounded-full bg-moss-50 px-3 py-1.5 text-xs font-medium text-moss-700 hover:bg-moss-100 dark:bg-moss-900/40 dark:text-moss-200 dark:hover:bg-moss-900/70"
        >
          <Plus size={14} /> Add food
        </button>
      </div>

      {entries.length === 0 ? (
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-dashed border-ink-200 px-3 py-4 text-sm text-ink-400 dark:border-ink-700 dark:text-ink-500">
          <UtensilsCrossed size={16} />
          Nothing logged yet
        </div>
      ) : (
        <ul className="flex flex-1 flex-col gap-2">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="group flex items-center justify-between gap-2 rounded-xl bg-ink-50 px-3 py-2 dark:bg-ink-900/40"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink-800 dark:text-ink-100">{entry.food_name}</p>
                <p className="text-xs text-ink-500 dark:text-ink-400">
                  {entry.grams}g &middot; {Math.round(entry.calories)} kcal
                </p>
              </div>
              <button
                onClick={() => onDelete(entry)}
                aria-label={`Remove ${entry.food_name}`}
                className="shrink-0 rounded-full p-1.5 text-ink-400 opacity-0 hover:bg-red-50 hover:text-brick-500 group-hover:opacity-100 focus-visible:opacity-100 dark:hover:bg-red-950/40"
              >
                <Trash2 size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
