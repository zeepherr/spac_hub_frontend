import { useAdminSupportRealtime } from "@/hook/support/useAdminSupportRealitme";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Outlet } from "react-router";
import AdminSidebar from "../components/admin/sidebar/Adminsidebar";

function AdminLayout() {
  useAdminSupportRealtime();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  function handleOpenSidebar() {
    setIsSidebarOpen(true);
  }

  function handleCloseSidebar() {
    setIsSidebarOpen(false);
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden xl:flex-row">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-neutral-200 bg-[#1F1F1F] px-4 xl:hidden">
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
          onClick={handleOpenSidebar}
          aria-label="Open admin navigation"
          aria-expanded={isSidebarOpen}
          className="inline-flex size-11 cursor-pointer items-center justify-center rounded-xl text-zinc-300 transition hover:bg-zinc-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          <Menu size={22} />
        </button>
      </header>

      {isSidebarOpen && (
        <button
          type="button"
          onClick={handleCloseSidebar}
          aria-label="Close admin navigation"
          className="fixed inset-0 z-40 cursor-default bg-neutral-950/55 xl:hidden"
        />
      )}

      <AdminSidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />

      <main className="scrollbar-hide min-w-0 flex-1 overflow-y-auto bg-[#F5F5F4]">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
