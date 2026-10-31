import { useState } from "react";
import { Loader2, Moon, Sun } from "lucide-react";
import api, { apiErrorMessage } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../context/ToastContext";

export default function Settings() {
  const { user, updateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { notify } = useToast();

  const [targets, setTargets] = useState({
    calorieTarget: user?.calorieTarget ?? 2000,
    proteinTarget: user?.proteinTarget ?? 150,
    carbsTarget: user?.carbsTarget ?? 250,
    fatTarget: user?.fatTarget ?? 65
  });
  const [savingTargets, setSavingTargets] = useState(false);

  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });
  const [savingPassword, setSavingPassword] = useState(false);

  async function handleSaveTargets(e) {
    e.preventDefault();
    setSavingTargets(true);
    try {
      const { data } = await api.put("/users/me/settings", targets);
      updateUser(data.user);
      notify("Targets updated", "success");
    } catch (err) {
      notify(apiErrorMessage(err), "error");
    } finally {
      setSavingTargets(false);
    }
  }

  async function handleSavePassword(e) {
    e.preventDefault();
    setSavingPassword(true);
    try {
      await api.put("/users/me/password", passwords);
      notify("Password updated", "success");
      setPasswords({ currentPassword: "", newPassword: "" });
    } catch (err) {
      notify(apiErrorMessage(err, "Could not update password"), "error");
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="flex items-center justify-between rounded-2xl border border-ink-100 bg-white p-6 dark:border-ink-700 dark:bg-ink-800">
        <div>
          <h2 className="font-display text-base font-semibold text-ink-900 dark:text-ink-50">Appearance</h2>
          <p className="text-sm text-ink-500 dark:text-ink-400">Switch between light and dark mode.</p>
        </div>
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 rounded-full border border-ink-200 px-4 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50 dark:border-ink-600 dark:text-ink-200 dark:hover:bg-ink-700"
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </button>
      </section>

      <section className="rounded-2xl border border-ink-100 bg-white p-6 dark:border-ink-700 dark:bg-ink-800">
        <h2 className="mb-1 font-display text-base font-semibold text-ink-900 dark:text-ink-50">Daily targets</h2>
        <p className="mb-4 text-sm text-ink-500 dark:text-ink-400">These power your dashboard progress rings and bars.</p>
        <form onSubmit={handleSaveTargets} className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:max-w-md">
          {[
            ["calorieTarget", "Calories (kcal)"],
            ["proteinTarget", "Protein (g)"],
            ["carbsTarget", "Carbs (g)"],
            ["fatTarget", "Fat (g)"]
          ].map(([key, label]) => (
            <div key={key}>
              <label className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200">{label}</label>
              <input
                type="number"
                min={0}
                value={targets[key]}
                onChange={(e) => setTargets((t) => ({ ...t, [key]: Number(e.target.value) }))}
                className="w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 outline-none focus:border-moss-400 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-50"
              />
            </div>
          ))}
          <button
            type="submit"
            disabled={savingTargets}
            className="col-span-full flex w-fit items-center gap-2 rounded-full bg-moss-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-moss-700 disabled:opacity-60"
          >
            {savingTargets && <Loader2 size={16} className="animate-spin" />}
            Save targets
          </button>
        </form>
      </section>

      {user?.provider !== "google" && (
        <section className="rounded-2xl border border-ink-100 bg-white p-6 dark:border-ink-700 dark:bg-ink-800">
          <h2 className="mb-1 font-display text-base font-semibold text-ink-900 dark:text-ink-50">Password</h2>
          <p className="mb-4 text-sm text-ink-500 dark:text-ink-400">Update the password you use to sign in.</p>
          <form onSubmit={handleSavePassword} className="flex flex-col gap-4 sm:max-w-sm">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200">Current password</label>
              <input
                type="password"
                value={passwords.currentPassword}
                onChange={(e) => setPasswords((p) => ({ ...p, currentPassword: e.target.value }))}
                className="w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 outline-none focus:border-moss-400 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-50"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200">New password</label>
              <input
                type="password"
                minLength={6}
                value={passwords.newPassword}
                onChange={(e) => setPasswords((p) => ({ ...p, newPassword: e.target.value }))}
                className="w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 outline-none focus:border-moss-400 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-50"
              />
            </div>
            <button
              type="submit"
              disabled={savingPassword}
              className="flex w-fit items-center gap-2 rounded-full bg-moss-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-moss-700 disabled:opacity-60"
            >
              {savingPassword && <Loader2 size={16} className="animate-spin" />}
              Update password
            </button>
          </form>
        </section>
      )}
    </div>
  );
}
