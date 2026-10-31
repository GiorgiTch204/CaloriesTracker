import { useCallback, useEffect, useState } from "react";
import { Users, Sparkles, Apple, BookOpen, ShieldCheck, Trash2 } from "lucide-react";
import api, { apiErrorMessage } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Avatar from "../components/Avatar";
import ConfirmDialog from "../components/ConfirmDialog";
import Loader from "../components/Loader";

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-4 dark:border-ink-700 dark:bg-ink-800">
      <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-moss-50 text-moss-600 dark:bg-moss-900/30 dark:text-moss-300">
        <Icon size={16} />
      </div>
      <p className="font-display text-2xl font-semibold text-ink-900 dark:text-ink-50">{value}</p>
      <p className="text-xs text-ink-500 dark:text-ink-400">{label}</p>
    </div>
  );
}

export default function Admin() {
  const { user: me } = useAuth();
  const { notify } = useToast();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const load = useCallback(() => {
    api.get("/admin/stats").then(({ data }) => setStats(data.stats));
    api.get("/admin/users").then(({ data }) => setUsers(data.users));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleRole(user) {
    const role = user.role === "admin" ? "user" : "admin";
    try {
      await api.put(`/admin/users/${user.id}/role`, { role });
      notify(`${user.name} is now ${role === "admin" ? "an admin" : "a regular user"}`, "success");
      load();
    } catch (err) {
      notify(apiErrorMessage(err), "error");
    }
  }

  async function handleDelete(user) {
    try {
      await api.delete(`/admin/users/${user.id}`);
      notify(`Deleted ${user.name}`, "success");
      load();
    } catch (err) {
      notify(apiErrorMessage(err), "error");
    }
  }

  if (!stats || !users) return <Loader full label="Loading admin data" />;

  return (
    <div className="flex flex-col gap-6">
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard icon={Users} label="Total users" value={stats.totalUsers} />
        <StatCard icon={Sparkles} label="Pro members" value={stats.proUsers} />
        <StatCard icon={Apple} label="Foods in DB" value={stats.totalFoods.toLocaleString()} />
        <StatCard icon={BookOpen} label="Diary entries" value={stats.totalDiaryEntries} />
        <StatCard icon={BookOpen} label="Logged today" value={stats.entriesToday} />
        <StatCard icon={ShieldCheck} label="Est. MRR" value={`$${stats.monthlyRecurringRevenue}`} />
      </section>

      <section className="overflow-hidden rounded-2xl border border-ink-100 bg-white dark:border-ink-700 dark:bg-ink-800">
        <div className="border-b border-ink-100 p-5 dark:border-ink-700">
          <h2 className="font-display text-base font-semibold text-ink-900 dark:text-ink-50">All users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink-100 text-xs text-ink-400 dark:border-ink-700">
                <th className="px-5 py-2.5 font-medium">User</th>
                <th className="px-5 py-2.5 font-medium">Plan</th>
                <th className="px-5 py-2.5 font-medium">Role</th>
                <th className="px-5 py-2.5 font-medium">Entries</th>
                <th className="px-5 py-2.5 font-medium">Joined</th>
                <th className="px-5 py-2.5 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100 dark:divide-ink-700">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="flex items-center gap-2.5 whitespace-nowrap px-5 py-3">
                    <Avatar user={u} size={28} />
                    <div>
                      <p className="font-medium text-ink-800 dark:text-ink-100">{u.name}</p>
                      <p className="text-xs text-ink-400">{u.email}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    {u.isPro ? (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                        Pro
                      </span>
                    ) : (
                      <span className="rounded-full bg-ink-100 px-2 py-0.5 text-xs font-medium text-ink-500 dark:bg-ink-700 dark:text-ink-300">
                        Free
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => toggleRole(u)}
                      disabled={u.id === me.id}
                      className={`rounded-full px-2 py-0.5 text-xs font-medium disabled:opacity-50 ${
                        u.role === "admin"
                          ? "bg-moss-100 text-moss-700 dark:bg-moss-900/40 dark:text-moss-300"
                          : "bg-ink-100 text-ink-500 hover:bg-ink-200 dark:bg-ink-700 dark:text-ink-300"
                      }`}
                    >
                      {u.role}
                    </button>
                  </td>
                  <td className="px-5 py-3 text-ink-600 dark:text-ink-300">{u.entryCount}</td>
                  <td className="whitespace-nowrap px-5 py-3 text-ink-500 dark:text-ink-400">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => setToDelete(u)}
                      disabled={u.id === me.id}
                      aria-label={`Delete ${u.name}`}
                      className="rounded-full p-1.5 text-ink-400 hover:bg-red-50 hover:text-brick-500 disabled:opacity-30 dark:hover:bg-red-950/30"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => handleDelete(toDelete)}
        title="Delete this user?"
        description={toDelete ? `This permanently deletes "${toDelete.name}" and their diary entries.` : ""}
        confirmLabel="Delete"
        danger
      />
    </div>
  );
}
