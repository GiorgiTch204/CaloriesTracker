import { useState } from "react";
import { Check, Loader2, Sparkles, CreditCard } from "lucide-react";
import api, { apiErrorMessage } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Modal from "../components/Modal";

const FREE_FEATURES = ["Unlimited food diary entries", "14,000+ food database with search", "Daily calorie & macro tracking"];

const PRO_FEATURES = [
  "Everything in Free",
  "Weekly insights: averages & best days",
  "Priority nutrition data accuracy",
  "Early access to new features"
];

export default function Pricing() {
  const { user, updateUser } = useAuth();
  const { notify } = useToast();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "" });

  async function handleCheckout(e) {
    e.preventDefault();
    setSubmitting(true);
    // Simulated checkout — no real payment processor is involved.
    setTimeout(async () => {
      try {
        const { data } = await api.post("/users/me/upgrade");
        updateUser(data.user);
        notify("Welcome to NutriTrack Pro!", "success");
        setCheckoutOpen(false);
      } catch (err) {
        notify(apiErrorMessage(err), "error");
      } finally {
        setSubmitting(false);
      }
    }, 900);
  }

  async function handleDowngrade() {
    try {
      const { data } = await api.post("/users/me/downgrade");
      updateUser(data.user);
      notify("You've switched back to the Free plan", "info");
    } catch (err) {
      notify(apiErrorMessage(err), "error");
    }
  }

  return (
    <div className="flex flex-col items-center gap-8 py-4">
      <div className="text-center">
        <h1 className="font-display text-2xl font-semibold text-ink-900 dark:text-ink-50">Simple, honest pricing</h1>
        <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">Upgrade any time, cancel whenever.</p>
      </div>

      <div className="grid w-full max-w-2xl grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col rounded-2xl border border-ink-100 bg-white p-6 dark:border-ink-700 dark:bg-ink-800">
          <h2 className="font-display text-lg font-semibold text-ink-900 dark:text-ink-50">Free</h2>
          <p className="mb-4 mt-1 text-sm text-ink-500 dark:text-ink-400">For everyday tracking</p>
          <p className="mb-5 font-display text-3xl font-semibold text-ink-900 dark:text-ink-50">$0</p>
          <ul className="flex flex-1 flex-col gap-2.5 text-sm text-ink-600 dark:text-ink-300">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2">
                <Check size={16} className="mt-0.5 shrink-0 text-moss-500" /> {f}
              </li>
            ))}
          </ul>
          {!user?.isPro && (
            <span className="mt-5 rounded-full bg-ink-100 px-3 py-1.5 text-center text-sm font-medium text-ink-500 dark:bg-ink-700 dark:text-ink-300">
              Current plan
            </span>
          )}
        </div>

        <div className="relative flex flex-col rounded-2xl border-2 border-moss-500 bg-white p-6 dark:bg-ink-800">
          <span className="absolute -top-3 left-6 rounded-full bg-moss-600 px-3 py-1 text-xs font-medium text-white">
            Most popular
          </span>
          <h2 className="flex items-center gap-1.5 font-display text-lg font-semibold text-ink-900 dark:text-ink-50">
            <Sparkles size={16} className="text-amber-500" /> Pro
          </h2>
          <p className="mb-4 mt-1 text-sm text-ink-500 dark:text-ink-400">For people who like data</p>
          <p className="mb-5 font-display text-3xl font-semibold text-ink-900 dark:text-ink-50">
            $9.99<span className="text-base font-normal text-ink-400">/mo</span>
          </p>
          <ul className="flex flex-1 flex-col gap-2.5 text-sm text-ink-600 dark:text-ink-300">
            {PRO_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2">
                <Check size={16} className="mt-0.5 shrink-0 text-moss-500" /> {f}
              </li>
            ))}
          </ul>

          {user?.isPro ? (
            <button
              onClick={handleDowngrade}
              className="mt-5 rounded-full border border-ink-200 px-4 py-2.5 text-sm font-medium text-ink-600 hover:bg-ink-50 dark:border-ink-600 dark:text-ink-200 dark:hover:bg-ink-700"
            >
              Switch to Free
            </button>
          ) : (
            <button
              onClick={() => setCheckoutOpen(true)}
              className="mt-5 rounded-full bg-moss-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-moss-700"
            >
              Upgrade to Pro
            </button>
          )}
        </div>
      </div>

      <p className="max-w-md text-center text-xs text-ink-400">
        This is a demo checkout for a portfolio project — no real payment is processed and no card details are stored.
      </p>

      <Modal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} title="Upgrade to Pro" maxWidth="max-w-sm">
        <form onSubmit={handleCheckout} className="flex flex-col gap-4">
          <div className="flex items-center justify-between rounded-xl bg-ink-50 px-4 py-3 text-sm dark:bg-ink-900">
            <span className="text-ink-600 dark:text-ink-300">NutriTrack Pro, billed monthly</span>
            <span className="font-display font-semibold text-ink-900 dark:text-ink-50">$9.99</span>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200">Card number</label>
            <div className="relative">
              <CreditCard size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                required
                placeholder="4242 4242 4242 4242"
                value={card.number}
                onChange={(e) => setCard((c) => ({ ...c, number: e.target.value }))}
                className="w-full rounded-xl border border-ink-200 bg-white py-2.5 pl-9 pr-3 text-sm text-ink-900 outline-none focus:border-moss-400 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200">Expiry</label>
              <input
                required
                placeholder="MM/YY"
                value={card.expiry}
                onChange={(e) => setCard((c) => ({ ...c, expiry: e.target.value }))}
                className="w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 outline-none focus:border-moss-400 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-50"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200">CVC</label>
              <input
                required
                placeholder="123"
                value={card.cvc}
                onChange={(e) => setCard((c) => ({ ...c, cvc: e.target.value }))}
                className="w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 outline-none focus:border-moss-400 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center gap-2 rounded-full bg-moss-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-moss-700 disabled:opacity-60"
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            {submitting ? "Processing..." : "Pay $9.99 / mo"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
