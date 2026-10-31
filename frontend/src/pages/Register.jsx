import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import api, { apiErrorMessage } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import GoogleButton, { useGoogleSignIn } from "../components/GoogleButton";
import AuthShell from "../components/AuthShell";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { applySession } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();

  function onSuccess(data) {
    applySession(data.token, data.user);
    notify(`Welcome to NutriTrack, ${data.user.name.split(" ")[0]}!`, "success");
    navigate("/");
  }

  const handleGoogle = useGoogleSignIn(onSuccess);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await api.post("/auth/register", { name, email, password });
      onSuccess(data);
    } catch (err) {
      notify(apiErrorMessage(err, "Could not create your account"), "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      heading="Create your account"
      sub="Free to start — upgrade any time."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-moss-600 hover:underline dark:text-moss-400">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200">
            Full name
          </label>
          <input
            id="name"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 outline-none focus:border-moss-400 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-50"
            placeholder="Alex Morgan"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 outline-none focus:border-moss-400 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-50"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 outline-none focus:border-moss-400 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-50"
            placeholder="At least 6 characters"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-1 flex items-center justify-center gap-2 rounded-full bg-moss-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-moss-700 disabled:opacity-60"
        >
          {submitting && <Loader2 size={16} className="animate-spin" />}
          Create account
        </button>

        <div className="relative my-1 text-center text-xs text-ink-400">
          <span className="relative bg-white px-2 dark:bg-ink-800">or</span>
          <div className="absolute inset-x-0 top-1/2 -z-10 border-t border-ink-100 dark:border-ink-700" />
        </div>

        <GoogleButton onCredential={handleGoogle} />
      </form>
    </AuthShell>
  );
}
