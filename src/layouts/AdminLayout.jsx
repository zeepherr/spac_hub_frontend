import { useAdminSupportRealtime } from "@/hook/support/useAdminSupportRealitme";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { Outlet } from "react-router";

import AdminSidebar from "../components/admin/sidebar/Adminsidebar";

const SIDEBAR_STORAGE_KEY = "admin-sidebar-collapsed";

function getInitialCollapsedState() {
  if (typeof window === "undefined") {
    return false;
  }

  return localStorage.getItem(SIDEBAR_STORAGE_KEY) === "true";
}

function AdminLayout() {
  useAdminSupportRealtime();

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
    getInitialCollapsedState,
  );

  function handleOpenMobileSidebar() {
    setIsMobileSidebarOpen(true);
  }

  function handleCloseMobileSidebar() {
    setIsMobileSidebarOpen(false);
  }

  function handleToggleDesktopSidebar() {
    setIsSidebarCollapsed((currentValue) => {
      const nextValue = !currentValue;

      localStorage.setItem(SIDEBAR_STORAGE_KEY, String(nextValue));

      return nextValue;
    });
  }

  useEffect(() => {
    if (!isMobileSidebarOpen) {
      return undefined;
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        handleCloseMobileSidebar();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileSidebarOpen]);

  return (
    <div className="flex h-dvh flex-col overflow-hidden xl:flex-row">
      {/* Mobile header */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-neutral-800 bg-[#1F1F1F] px-4 xl:hidden">
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
          onClick={handleOpenMobileSidebar}
          aria-label="Open admin navigation"
          aria-expanded={isMobileSidebarOpen}
          className="inline-flex size-11 cursor-pointer items-center justify-center rounded-xl text-zinc-300 transition hover:bg-zinc-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          <Menu size={22} />
        </button>
      </header>

      {/* Mobile backdrop */}
      {isMobileSidebarOpen && (
        <button
          type="button"
          onClick={handleCloseMobileSidebar}
          aria-label="Close admin navigation"
          className="fixed inset-0 z-40 cursor-default bg-neutral-950/55 xl:hidden"
        />
      )}

      <AdminSidebar
        isOpen={isMobileSidebarOpen}
        collapsed={isSidebarCollapsed}
        onClose={handleCloseMobileSidebar}
        onToggle={handleToggleDesktopSidebar}
      />

      {/* Independent page scrolling */}
      <main className="scrollbar-hide min-h-0 min-w-0 flex-1 overflow-y-auto bg-[#F5F5F4]">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
