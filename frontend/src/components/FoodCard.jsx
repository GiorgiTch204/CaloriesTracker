import { Flame } from "lucide-react";

export default function FoodCard({ food, onSelect }) {
  return (
    <button
      onClick={() => onSelect(food)}
      className="group flex flex-col items-start rounded-2xl border border-ink-100 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-moss-200 hover:shadow-raised focus-visible:-translate-y-0.5 dark:border-ink-700 dark:bg-ink-800 dark:hover:border-moss-700"
    >
      <span className="mb-1 inline-block rounded-full bg-ink-100 px-2 py-0.5 text-xs font-medium text-ink-500 dark:bg-ink-700 dark:text-ink-300">
        {food.food_group || "Uncategorized"}
      </span>
      <h3 className="mb-2 line-clamp-2 min-h-[2.5rem] font-display text-base font-medium leading-snug text-ink-900 dark:text-ink-50">
        {food.name}
      </h3>
      <div className="mt-auto flex w-full items-center justify-between text-sm">
        <span className="flex items-center gap-1 font-medium text-amber-600 dark:text-amber-400">
          <Flame size={14} /> {Math.round(food.calories)} kcal
        </span>
        <span className="text-xs text-ink-400 dark:text-ink-500">/100g</span>
      </div>
      <dl className="mt-3 grid w-full grid-cols-3 gap-2 border-t border-ink-100 pt-3 text-center dark:border-ink-700">
        <div>
          <dt className="text-[11px] text-ink-400 dark:text-ink-500">Protein</dt>
          <dd className="text-sm font-medium text-ink-700 dark:text-ink-200">{Math.round(food.protein)}g</dd>
        </div>
        <div>
          <dt className="text-[11px] text-ink-400 dark:text-ink-500">Carbs</dt>
          <dd className="text-sm font-medium text-ink-700 dark:text-ink-200">{Math.round(food.carbohydrates)}g</dd>
        </div>
        <div>
          <dt className="text-[11px] text-ink-400 dark:text-ink-500">Fat</dt>
          <dd className="text-sm font-medium text-ink-700 dark:text-ink-200">{Math.round(food.fat)}g</dd>
        </div>
      </dl>
    </button>
  );
}
