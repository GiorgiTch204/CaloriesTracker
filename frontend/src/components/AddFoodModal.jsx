import { useEffect, useState } from "react";
import { Search, Flame, ChevronLeft } from "lucide-react";
import api, { apiErrorMessage } from "../lib/api";
import { useToast } from "../context/ToastContext";
import Modal from "./Modal";
import FoodGramsForm from "./FoodGramsForm";
import Loader from "./Loader";
import { MEAL_LABELS } from "../lib/format";

export default function AddFoodModal({ open, onClose, mealType, onAdded }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { notify } = useToast();

  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
      setSelected(null);
    }
  }, [open]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setSearching(true);
    const timer = setTimeout(() => {
      api
        .get("/foods/search", { params: { q: query, limit: 20 } })
        .then(({ data }) => setResults(data.results))
        .catch(() => setResults([]))
        .finally(() => setSearching(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  async function handleAdd({ grams, mealType: chosenMeal, totals }) {
    setSubmitting(true);
    try {
      await api.post("/diary", {
        foodId: selected.id,
        foodName: selected.name,
        mealType: chosenMeal,
        grams,
        ...totals
      });
      notify(`Added ${selected.name} to ${MEAL_LABELS[chosenMeal]}`, "success");
      onAdded();
      onClose();
    } catch (err) {
      notify(apiErrorMessage(err, "Could not add this entry"), "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={selected ? selected.name : `Add food to ${MEAL_LABELS[mealType] || "diary"}`}>
      {selected ? (
        <div>
          <button
            onClick={() => setSelected(null)}
            className="mb-3 flex items-center gap-1 text-sm text-ink-500 hover:text-ink-700 dark:text-ink-400"
          >
            <ChevronLeft size={15} /> Back to results
          </button>
          <FoodGramsForm food={selected} lockedMealType={mealType} onAdd={handleAdd} submitting={submitting} />
        </div>
      ) : (
        <div>
          <div className="relative mb-3">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search foods, e.g. grilled chicken"
              className="w-full rounded-xl border border-ink-200 bg-white py-2.5 pl-9 pr-3 text-sm text-ink-900 outline-none focus:border-moss-400 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-50"
            />
          </div>

          <div className="max-h-80 overflow-y-auto scroll-thin">
            {searching && <Loader label="Searching" />}
            {!searching && query && results.length === 0 && (
              <p className="py-6 text-center text-sm text-ink-400">No foods found for &ldquo;{query}&rdquo;</p>
            )}
            {!searching && !query && (
              <p className="py-6 text-center text-sm text-ink-400">Start typing to search 14,000+ foods</p>
            )}
            <ul className="flex flex-col gap-1">
              {results.map((food) => (
                <li key={food.id}>
                  <button
                    onClick={() => setSelected(food)}
                    className="flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-sm hover:bg-ink-50 dark:hover:bg-ink-700"
                  >
                    <span className="min-w-0 flex-1 truncate text-ink-800 dark:text-ink-100">{food.name}</span>
                    <span className="flex shrink-0 items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                      <Flame size={12} /> {Math.round(food.calories)} kcal
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </Modal>
  );
}
