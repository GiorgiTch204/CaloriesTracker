import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import api, { apiErrorMessage } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import GoogleButton, { useGoogleSignIn } from "../components/GoogleButton";
import AuthShell from "../components/AuthShell";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { applySession } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();

  function onSuccess(data) {
    applySession(data.token, data.user);
    notify(`Welcome back, ${data.user.name.split(" ")[0]}!`, "success");
    navigate("/");
  }

  const handleGoogle = useGoogleSignIn(onSuccess);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      onSuccess(data);
    } catch (err) {
      notify(apiErrorMessage(err, "Could not sign you in"), "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      heading="Welcome back"
      sub="Sign in to keep your streak going."
      footer={
        <>
          New to NutriTrack?{" "}
          <Link to="/register" className="font-medium text-moss-600 hover:underline dark:text-moss-400">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 outline-none focus:border-moss-400 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-50"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-3 flex items-center text-ink-400 hover:text-ink-600"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-1 flex items-center justify-center gap-2 rounded-full bg-moss-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-moss-700 disabled:opacity-60"
        >
          {submitting && <Loader2 size={16} className="animate-spin" />}
          Sign in
        </button>

        <div className="relative my-1 text-center text-xs text-ink-400">
          <span className="relative bg-white px-2 dark:bg-ink-800">or</span>
          <div className="absolute inset-x-0 top-1/2 -z-10 border-t border-ink-100 dark:border-ink-700" />
        </div>

        <GoogleButton onCredential={handleGoogle} />

        <p className="mt-2 rounded-lg bg-ink-50 px-3 py-2 text-xs text-ink-500 dark:bg-ink-900 dark:text-ink-400">
          Demo account: <span className="font-medium">demo@nutritrack.app</span> / demo1234
        </p>
      </form>
    </AuthShell>
  );
}
