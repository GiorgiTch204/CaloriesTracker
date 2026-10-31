import { useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { MEAL_LABELS, MEAL_ORDER, round } from "../lib/format";

function scale(value, grams) {
  return round((Number(value) || 0) * (grams / 100), 1);
}

export default function FoodGramsForm({ food, lockedMealType, onAdd, submitting }) {
  const [grams, setGrams] = useState(food.serving_weight_1 ? Math.round(food.serving_weight_1) : 100);
  const [mealType, setMealType] = useState(lockedMealType || "breakfast");

  const totals = useMemo(
    () => ({
      calories: scale(food.calories, grams),
      protein: scale(food.protein, grams),
      carbohydrates: scale(food.carbohydrates, grams),
      fat: scale(food.fat, grams)
    }),
    [food, grams]
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200">Amount (g)</label>
          <input
            type="number"
            min={1}
            value={grams}
            onChange={(e) => setGrams(Math.max(1, Number(e.target.value) || 0))}
            className="w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 outline-none focus:border-moss-400 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-50"
          />
          {food.serving_description_1 && (
            <p className="mt-1 text-xs text-ink-400">
              1 serving &middot; {food.serving_description_1} &middot; {food.serving_weight_1}g
            </p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200">Meal</label>
          <select
            value={mealType}
            disabled={!!lockedMealType}
            onChange={(e) => setMealType(e.target.value)}
            className="w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 outline-none focus:border-moss-400 disabled:bg-ink-50 disabled:text-ink-400 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-50 dark:disabled:bg-ink-800"
          >
            {MEAL_ORDER.map((m) => (
              <option key={m} value={m}>
                {MEAL_LABELS[m]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 rounded-xl bg-ink-50 p-3 text-center dark:bg-ink-900">
        <div>
          <p className="text-[11px] text-ink-400">Calories</p>
          <p className="font-display text-sm font-semibold text-ink-900 dark:text-ink-50">{totals.calories}</p>
        </div>
        <div>
          <p className="text-[11px] text-ink-400">Protein</p>
          <p className="font-display text-sm font-semibold text-ink-900 dark:text-ink-50">{totals.protein}g</p>
        </div>
        <div>
          <p className="text-[11px] text-ink-400">Carbs</p>
          <p className="font-display text-sm font-semibold text-ink-900 dark:text-ink-50">{totals.carbohydrates}g</p>
        </div>
        <div>
          <p className="text-[11px] text-ink-400">Fat</p>
          <p className="font-display text-sm font-semibold text-ink-900 dark:text-ink-50">{totals.fat}g</p>
        </div>
      </div>

      <button
        onClick={() => onAdd({ grams, mealType, totals })}
        disabled={submitting}
        className="flex items-center justify-center gap-2 rounded-full bg-moss-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-moss-700 disabled:opacity-60"
      >
        {submitting && <Loader2 size={16} className="animate-spin" />}
        Add to {MEAL_LABELS[mealType]}
      </button>
    </div>
  );
}
