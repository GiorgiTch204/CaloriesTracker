import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-ink-50 px-6 text-center dark:bg-ink-950">
      <p className="font-display text-5xl font-semibold text-ink-900 dark:text-ink-50">404</p>
      <p className="text-ink-500 dark:text-ink-400">This page doesn't exist.</p>
      <Link to="/" className="mt-3 rounded-full bg-moss-600 px-4 py-2 text-sm font-medium text-white hover:bg-moss-700">
        Back to dashboard
      </Link>
    </div>
  );
}
