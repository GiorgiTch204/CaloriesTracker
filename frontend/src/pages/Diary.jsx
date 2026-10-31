import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import api, { apiErrorMessage } from "../lib/api";
import { useToast } from "../context/ToastContext";
import { formatDateLabel, shiftDate, todayISO, MEAL_ORDER } from "../lib/format";
import MealCard from "../components/MealCard";
import AddFoodModal from "../components/AddFoodModal";
import ConfirmDialog from "../components/ConfirmDialog";
import Loader from "../components/Loader";

export default function Diary() {
  const [date, setDate] = useState(todayISO());
  const [meals, setMeals] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addMealType, setAddMealType] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const { notify } = useToast();

  const load = useCallback((d) => {
    setLoading(true);
    api
      .get("/diary", { params: { date: d } })
      .then(({ data }) => setMeals(data.meals))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load(date);
  }, [date, load]);

  async function handleDelete(entry) {
    try {
      await api.delete(`/diary/${entry.id}`);
      notify(`Removed ${entry.food_name}`, "success");
      load(date);
    } catch (err) {
      notify(apiErrorMessage(err, "Could not remove this entry"), "error");
    }
  }

  const totalCalories = meals ? Object.values(meals).flat().reduce((s, e) => s + e.calories, 0) : 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-ink-100 bg-white p-4 dark:border-ink-700 dark:bg-ink-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDate((d) => shiftDate(d, -1))}
            aria-label="Previous day"
            className="rounded-full p-2 text-ink-500 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-700"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex items-center gap-2 px-2">
            <CalendarDays size={16} className="text-ink-400" />
            <span className="font-display text-base font-medium text-ink-900 dark:text-ink-50">{formatDateLabel(date)}</span>
          </div>
          <button
            onClick={() => setDate((d) => shiftDate(d, 1))}
            disabled={date >= todayISO()}
            aria-label="Next day"
            className="rounded-full p-2 text-ink-500 hover:bg-ink-100 disabled:opacity-30 dark:text-ink-300 dark:hover:bg-ink-700"
          >
            <ChevronRight size={18} />
          </button>
          {date !== todayISO() && (
            <button
              onClick={() => setDate(todayISO())}
              className="ml-1 rounded-full border border-ink-200 px-3 py-1 text-xs font-medium text-ink-600 hover:bg-ink-50 dark:border-ink-600 dark:text-ink-200 dark:hover:bg-ink-700"
            >
              Jump to today
            </button>
          )}
        </div>
        <p className="text-sm text-ink-500 dark:text-ink-400">
          Total: <span className="font-medium text-ink-800 dark:text-ink-100">{Math.round(totalCalories)} kcal</span>
        </p>
      </div>

      {loading || !meals ? (
        <Loader full label="Loading your diary" />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {MEAL_ORDER.map((m) => (
            <MealCard
              key={m}
              mealType={m}
              entries={meals[m]}
              onAdd={() => setAddMealType(m)}
              onDelete={setToDelete}
            />
          ))}
        </div>
      )}

      <AddFoodModal
        open={!!addMealType}
        mealType={addMealType}
        onClose={() => setAddMealType(null)}
        onAdded={() => load(date)}
      />

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => handleDelete(toDelete)}
        title="Remove this entry?"
        description={toDelete ? `This will remove "${toDelete.food_name}" from your diary.` : ""}
        confirmLabel="Remove"
        danger
      />
    </div>
  );
}
