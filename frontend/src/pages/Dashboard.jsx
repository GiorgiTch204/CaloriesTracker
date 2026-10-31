import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UtensilsCrossed, Lock, TrendingUp, Flame } from "lucide-react";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { MEAL_LABELS, MEAL_ORDER } from "../lib/format";
import CalorieRing from "../components/CalorieRing";
import MacroBar from "../components/MacroBar";
import TrendChart from "../components/TrendChart";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    api
      .get("/dashboard")
      .then(({ data }) => setData(data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <Loader full label="Crunching today's numbers" />;
  if (!data) return null;

  const { totals, targets, meals, recentEntries, trend, hasAnyData, remaining } = data;
  const weeklyAvg = Math.round(trend.reduce((s, d) => s + d.calories, 0) / trend.length);
  const bestDay = trend.reduce((best, d) => (d.calories > best.calories ? d : best), trend[0]);

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-6 rounded-2xl border border-ink-100 bg-white p-6 dark:border-ink-700 dark:bg-ink-800 sm:flex-row sm:items-center">
        <CalorieRing consumed={totals.calories} target={targets.calories} />
        <div className="flex-1">
          <p className="font-display text-lg font-medium text-ink-900 dark:text-ink-50">
            Hey {user?.name?.split(" ")[0]}, you have{" "}
            <span className={remaining < 0 ? "text-brick-500" : "text-moss-600 dark:text-moss-400"}>
              {Math.abs(remaining).toLocaleString()} kcal {remaining < 0 ? "over" : "left"}
            </span>{" "}
            today.
          </p>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <MacroBar type="protein" value={totals.protein} target={targets.protein} />
            <MacroBar type="carbohydrates" value={totals.carbohydrates} target={targets.carbohydrates} />
            <MacroBar type="fat" value={totals.fat} target={targets.fat} />
          </div>
        </div>
      </section>

      {!hasAnyData && (
        <EmptyState
          icon={UtensilsCrossed}
          title="Nothing logged today"
          description="Add your first meal from the Food Diary or Food Database to see your dashboard come alive."
          action={
            <Link to="/diary" className="rounded-full bg-moss-600 px-4 py-2 text-sm font-medium text-white hover:bg-moss-700">
              Log a meal
            </Link>
          }
        />
      )}

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {MEAL_ORDER.map((m) => {
          const cals = meals[m].reduce((s, e) => s + e.calories, 0);
          return (
            <div key={m} className="rounded-2xl border border-ink-100 bg-white p-4 dark:border-ink-700 dark:bg-ink-800">
              <p className="text-xs font-medium text-ink-500 dark:text-ink-400">{MEAL_LABELS[m]}</p>
              <p className="mt-1 font-display text-xl font-semibold text-ink-900 dark:text-ink-50">{Math.round(cals)}</p>
              <p className="text-xs text-ink-400">kcal &middot; {meals[m].length} items</p>
            </div>
          );
        })}
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-ink-100 bg-white p-5 dark:border-ink-700 dark:bg-ink-800 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-ink-900 dark:text-ink-50">7-day calorie trend</h2>
            <TrendingUp size={16} className="text-ink-400" />
          </div>
          <TrendChart data={trend} />
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-ink-100 bg-white p-5 dark:border-ink-700 dark:bg-ink-800">
          <h2 className="mb-3 font-display text-base font-semibold text-ink-900 dark:text-ink-50">Weekly insights</h2>
          <div className={user?.isPro ? "" : "pointer-events-none select-none blur-sm"}>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-amber-500 dark:bg-amber-900/30">
                <Flame size={18} />
              </div>
              <div>
                <p className="text-xs text-ink-400">Daily average</p>
                <p className="font-display text-lg font-semibold text-ink-900 dark:text-ink-50">{weeklyAvg} kcal</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-moss-50 text-moss-600 dark:bg-moss-900/30">
                <TrendingUp size={18} />
              </div>
              <div>
                <p className="text-xs text-ink-400">Highest day</p>
                <p className="font-display text-lg font-semibold text-ink-900 dark:text-ink-50">{bestDay?.calories ?? 0} kcal</p>
              </div>
            </div>
          </div>

          {!user?.isPro && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/70 p-4 text-center dark:bg-ink-800/80">
              <Lock size={20} className="text-ink-400" />
              <p className="text-sm font-medium text-ink-700 dark:text-ink-200">Pro insight</p>
              <Link to="/pricing" className="rounded-full bg-ink-900 px-3 py-1.5 text-xs font-medium text-white dark:bg-moss-700">
                Unlock with Pro
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-ink-100 bg-white p-5 dark:border-ink-700 dark:bg-ink-800">
        <h2 className="mb-3 font-display text-base font-semibold text-ink-900 dark:text-ink-50">Recent entries</h2>
        {recentEntries.length === 0 ? (
          <p className="text-sm text-ink-400">No entries yet today.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-ink-100 dark:divide-ink-700">
            {recentEntries.map((e) => (
              <li key={e.id} className="flex items-center justify-between py-2.5 text-sm">
                <div>
                  <p className="font-medium text-ink-800 dark:text-ink-100">{e.food_name}</p>
                  <p className="text-xs text-ink-400">
                    {MEAL_LABELS[e.meal_type]} &middot; {e.grams}g
                  </p>
                </div>
                <span className="font-medium text-ink-600 dark:text-ink-300">{Math.round(e.calories)} kcal</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
