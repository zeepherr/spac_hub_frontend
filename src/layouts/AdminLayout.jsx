import { useAdminSupportRealtime } from "@/hook/support/useAdminSupportRealitme";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router";

import AdminSidebar from "@/components/admin/sidebar/Adminsidebar";

const SIDEBAR_STORAGE_KEY = "admin-sidebar-collapsed";

function readCollapsedPreference() {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    return localStorage.getItem(SIDEBAR_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function AdminLayout() {
  useAdminSupportRealtime();

  const location = useLocation();

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
    readCollapsedPreference,
  );

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, String(isSidebarCollapsed));
    } catch {
      // The sidebar still works when browser storage is unavailable.
    }
  }, [isSidebarCollapsed]);

  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isMobileSidebarOpen) {
      return undefined;
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsMobileSidebarOpen(false);
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isMobileSidebarOpen]);

  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden bg-[#F5F5F4] xl:flex-row">
      {/* Mobile header */}
      <header className="relative z-60 flex h-14 shrink-0 items-center justify-between border-b border-neutral-800 bg-[#1F1F1F] px-4 xl:hidden">
        <div>
          <p className="text-lg font-bold leading-none text-white">
            SPEC<span className="text-orange-500">HUB</span>
          </p>

          <p className="mt-1 text-[10px] font-medium tracking-wide text-zinc-500">
            ADMIN PANEL
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setIsMobileSidebarOpen((currentValue) => !currentValue)
          }
          aria-label="Open admin navigation"
          aria-expanded={isMobileSidebarOpen}
          className="ml-auto inline-flex size-11 cursor-pointer items-center justify-center rounded-xl text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          {isMobileSidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* Mobile backdrop */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.button
            type="button"
            aria-label="Close admin navigation"
            onClick={() => setIsMobileSidebarOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 bottom-0 top-14 z-40 cursor-default bg-neutral-950/60 backdrop-blur-[1px] xl:hidden"
          />
        )}
      </AnimatePresence>

      <AdminSidebar
        isMobileOpen={isMobileSidebarOpen}
        collapsed={isSidebarCollapsed}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
        onToggleCollapsed={() =>
          setIsSidebarCollapsed((currentValue) => !currentValue)
        }
      />

      {/* Only the page content scrolls */}
      <main className="scrollbar-hide min-h-0 min-w-0 flex-1 overflow-y-auto bg-[#F5F5F4]">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
