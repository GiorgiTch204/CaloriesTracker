export function round(n, decimals = 0) {
  const factor = 10 ** decimals;
  return Math.round((Number(n) || 0) * factor) / factor;
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function formatDateLabel(iso) {
  const d = new Date(`${iso}T00:00:00`);
  const todayStr = todayISO();
  const yestStr = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  if (iso === todayStr) return "Today";
  if (iso === yestStr) return "Yesterday";

  return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

export function shiftDate(iso, days) {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function weekdayShort(iso) {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString(undefined, { weekday: "short" });
}

export const MEAL_LABELS = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snacks: "Snacks"
};

export const MEAL_ORDER = ["breakfast", "lunch", "dinner", "snacks"];
