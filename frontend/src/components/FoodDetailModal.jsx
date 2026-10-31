import { useState } from "react";
import api, { apiErrorMessage } from "../lib/api";
import { useToast } from "../context/ToastContext";
import Modal from "./Modal";
import FoodGramsForm from "./FoodGramsForm";
import { MEAL_LABELS } from "../lib/format";

const NUTRIENTS = [
  ["sugars", "Sugars", "g"],
  ["fiber", "Fiber", "g"],
  ["cholesterol", "Cholesterol", "mg"],
  ["saturated_fats", "Saturated fat", "g"],
  ["sodium", "Sodium", "mg"],
  ["potassium", "Potassium", "mg"],
  ["calcium", "Calcium", "mg"],
  ["iron", "Iron", "mg"]
];

export default function FoodDetailModal({ food, onClose, onAdded }) {
  const [submitting, setSubmitting] = useState(false);
  const { notify } = useToast();

  if (!food) return null;

  async function handleAdd({ grams, mealType, totals }) {
    setSubmitting(true);
    try {
      await api.post("/diary", {
        foodId: food.id,
        foodName: food.name,
        mealType,
        grams,
        ...totals
      });
      notify(`Added ${food.name} to ${MEAL_LABELS[mealType]}`, "success");
      onAdded?.();
      onClose();
    } catch (err) {
      notify(apiErrorMessage(err, "Could not add this entry"), "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={!!food} onClose={onClose} title={food.name} maxWidth="max-w-xl">
      <div className="mb-5 flex flex-wrap gap-4 rounded-xl bg-ink-50 p-4 dark:bg-ink-900">
        {NUTRIENTS.map(([key, label, unit]) => (
          <div key={key} className="min-w-[5.5rem]">
            <p className="text-[11px] text-ink-400">{label}</p>
            <p className="text-sm font-medium text-ink-700 dark:text-ink-200">
              {Math.round((food[key] || 0) * 10) / 10}
              {unit}
            </p>
          </div>
        ))}
      </div>

      <h3 className="mb-3 font-display text-sm font-semibold text-ink-700 dark:text-ink-200">Add to diary</h3>
      <FoodGramsForm food={food} onAdd={handleAdd} submitting={submitting} />
    </Modal>
  );
}
