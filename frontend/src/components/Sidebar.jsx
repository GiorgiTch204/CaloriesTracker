import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Search,
  User,
  Settings,
  ShieldCheck,
  Sparkles,
  X
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/diary", label: "Food Diary", icon: BookOpen },
  { to: "/foods", label: "Food Database", icon: Search },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings }
];

function Brand() {
  return (
    <div className="flex items-center gap-2 px-2">
      <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill="#14201c" />
        <circle cx="16" cy="16" r="9.5" fill="none" stroke="#2d4138" strokeWidth="3" />
        <path d="M16 6.5a9.5 9.5 0 0 1 9.5 9.5" fill="none" stroke="#e8a33d" strokeWidth="3" strokeLinecap="round" />
        <path d="M16 6.5a9.5 9.5 0 0 1 8 4.6" fill="none" stroke="#1f7a5c" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <span className="font-display text-lg font-semibold text-ink-900 dark:text-ink-50">NutriTrack</span>
    </div>
  );
}

function NavItems({ onNavigate }) {
  const { user } = useAuth();

  return (
    <nav className="flex flex-1 flex-col gap-1 px-2">
      {NAV.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-moss-50 text-moss-700 dark:bg-moss-900/40 dark:text-moss-200"
                : "text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800"
            }`
          }
        >
          <item.icon size={18} />
          {item.label}
        </NavLink>
      ))}

      {user?.role === "admin" && (
        <NavLink
          to="/admin"
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-moss-50 text-moss-700 dark:bg-moss-900/40 dark:text-moss-200"
                : "text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800"
            }`
          }
        >
          <ShieldCheck size={18} />
          Admin
        </NavLink>
      )}
    </nav>
  );
}

function UpgradeCard({ onNavigate }) {
  const { user } = useAuth();
  if (user?.isPro) return null;

  return (
    <NavLink
      to="/pricing"
      onClick={onNavigate}
      className="mx-2 flex flex-col gap-1 rounded-xl bg-ink-900 p-3.5 text-white hover:bg-ink-800 dark:bg-moss-900/60 dark:hover:bg-moss-900"
    >
      <span className="flex items-center gap-1.5 text-sm font-medium">
        <Sparkles size={15} className="text-amber-400" /> Go Pro
      </span>
      <span className="text-xs text-ink-300 dark:text-ink-300">Unlock advanced trends &amp; insights</span>
    </NavLink>
  );
}

export function SidebarDesktop() {
  return (
    <aside className="hidden h-screen w-64 shrink-0 flex-col border-r border-ink-100 bg-white py-5 dark:border-ink-800 dark:bg-ink-900 lg:flex">
      <div className="mb-6">
        <Brand />
      </div>
      <NavItems />
      <div className="mt-4">
        <UpgradeCard />
      </div>
    </aside>
  );
}

export function SidebarMobile({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <div className="absolute inset-0 bg-ink-900/40" onClick={onClose} />
      <aside className="animate-rise absolute inset-y-0 left-0 flex w-72 flex-col border-r border-ink-100 bg-white py-5 dark:border-ink-800 dark:bg-ink-900">
        <div className="mb-6 flex items-center justify-between px-2">
          <Brand />
          <button onClick={onClose} aria-label="Close menu" className="rounded-full p-1.5 text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800">
            <X size={20} />
          </button>
        </div>
        <NavItems onNavigate={onClose} />
        <div className="mt-4">
          <UpgradeCard onNavigate={onClose} />
        </div>
      </aside>
    </div>
  );
}
