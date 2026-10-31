import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { SidebarDesktop, SidebarMobile } from "./Sidebar";
import Topbar from "./Topbar";

const TITLES = {
  "/": "Dashboard",
  "/diary": "Food Diary",
  "/foods": "Food Database",
  "/profile": "Profile",
  "/settings": "Settings",
  "/pricing": "NutriTrack Pro",
  "/admin": "Admin"
};

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const title = TITLES[pathname] || "NutriTrack";

  return (
    <div className="flex min-h-screen bg-ink-50 dark:bg-ink-950">
      <SidebarDesktop />
      <SidebarMobile open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar title={title} onMenu={() => setMobileOpen(true)} />
        <main className="scroll-thin flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
