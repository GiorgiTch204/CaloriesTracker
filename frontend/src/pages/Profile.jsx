import { useRef, useState } from "react";
import { Camera, Loader2, Sparkles, ShieldCheck } from "lucide-react";
import api, { apiErrorMessage } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Avatar from "../components/Avatar";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const { notify } = useToast();
  const [name, setName] = useState(user?.name || "");
  const [savingName, setSavingName] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  async function handleSaveName(e) {
    e.preventDefault();
    setSavingName(true);
    try {
      const { data } = await api.put("/users/me", { name });
      updateUser(data.user);
      notify("Profile updated", "success");
    } catch (err) {
      notify(apiErrorMessage(err), "error");
    } finally {
      setSavingName(false);
    }
  }

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const form = new FormData();
    form.append("avatar", file);
    setUploading(true);
    try {
      const { data } = await api.post("/users/me/avatar", form, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      updateUser(data.user);
      notify("Profile picture updated", "success");
    } catch (err) {
      notify(apiErrorMessage(err, "Could not upload image"), "error");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col items-center gap-4 rounded-2xl border border-ink-100 bg-white p-6 text-center dark:border-ink-700 dark:bg-ink-800 sm:flex-row sm:text-left">
        <div className="relative shrink-0">
          <Avatar user={user} size={88} />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            aria-label="Change profile picture"
            className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-moss-600 text-white hover:bg-moss-700 dark:border-ink-800"
          >
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        </div>
        <div>
          <p className="font-display text-xl font-semibold text-ink-900 dark:text-ink-50">{user?.name}</p>
          <p className="text-sm text-ink-500 dark:text-ink-400">{user?.email}</p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            {user?.isPro && (
              <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                <Sparkles size={12} /> Pro member
              </span>
            )}
            {user?.role === "admin" && (
              <span className="flex items-center gap-1 rounded-full bg-moss-100 px-2.5 py-1 text-xs font-medium text-moss-700 dark:bg-moss-900/40 dark:text-moss-300">
                <ShieldCheck size={12} /> Admin
              </span>
            )}
            <span className="rounded-full bg-ink-100 px-2.5 py-1 text-xs font-medium text-ink-600 dark:bg-ink-700 dark:text-ink-300">
              via {user?.provider === "google" ? "Google" : "Email"}
            </span>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-ink-100 bg-white p-6 dark:border-ink-700 dark:bg-ink-800">
        <h2 className="mb-4 font-display text-base font-semibold text-ink-900 dark:text-ink-50">Personal information</h2>
        <form onSubmit={handleSaveName} className="flex flex-col gap-4 sm:max-w-sm">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200">
              Full name
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 outline-none focus:border-moss-400 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-50"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200">Email</label>
            <input
              disabled
              value={user?.email || ""}
              className="w-full rounded-xl border border-ink-200 bg-ink-50 px-3.5 py-2.5 text-sm text-ink-400 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-500"
            />
          </div>
          <button
            type="submit"
            disabled={savingName}
            className="flex w-fit items-center gap-2 rounded-full bg-moss-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-moss-700 disabled:opacity-60"
          >
            {savingName && <Loader2 size={16} className="animate-spin" />}
            Save changes
          </button>
        </form>
      </section>
    </div>
  );
}
