import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Moon, Sun, LogOut, Settings, User as UserIcon, Sparkles, ChevronDown } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Avatar from "./Avatar";

export default function Topbar({ title, onMenu }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function onClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-ink-100 bg-ink-50/90 px-4 py-3 backdrop-blur dark:border-ink-800 dark:bg-ink-950/90 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenu}
          aria-label="Open menu"
          className="rounded-lg p-2 text-ink-600 hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-ink-800 lg:hidden"
        >
          <Menu size={20} />
        </button>
        <h1 className="font-display text-xl font-semibold text-ink-900 dark:text-ink-50">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        {!user?.isPro && (
          <button
            onClick={() => navigate("/pricing")}
            className="hidden items-center gap-1.5 rounded-full bg-amber-400 px-3 py-1.5 text-sm font-medium text-ink-900 hover:bg-amber-300 sm:flex"
          >
            <Sparkles size={15} /> Upgrade
          </button>
        )}

        <button
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          className="rounded-full p-2 text-ink-500 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2 rounded-full border border-ink-100 bg-white px-1.5 py-1 hover:border-ink-200 dark:border-ink-700 dark:bg-ink-800"
            aria-haspopup="menu"
            aria-expanded={open}
          >
            <Avatar user={user} size={28} />
            <ChevronDown size={14} className="mr-1 text-ink-400" />
          </button>

          {open && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-ink-100 bg-white py-1 shadow-raised dark:border-ink-700 dark:bg-ink-800"
            >
              <div className="border-b border-ink-100 px-3 py-2.5 dark:border-ink-700">
                <p className="truncate text-sm font-medium text-ink-800 dark:text-ink-100">{user?.name}</p>
                <p className="truncate text-xs text-ink-400 dark:text-ink-500">{user?.email}</p>
              </div>
              <button
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  navigate("/profile");
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-ink-600 hover:bg-ink-50 dark:text-ink-200 dark:hover:bg-ink-700"
              >
                <UserIcon size={15} /> Profile
              </button>
              <button
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  navigate("/settings");
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-ink-600 hover:bg-ink-50 dark:text-ink-200 dark:hover:bg-ink-700"
              >
                <Settings size={15} /> Settings
              </button>
              <button
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  logout();
                  navigate("/login");
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-brick-500 hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                <LogOut size={15} /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
