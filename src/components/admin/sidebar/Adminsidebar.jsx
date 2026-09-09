import {
  ClipboardCheck,
  ClipboardList,
  LayoutGrid,
  ListTree,
  MessageSquareText,
  PackageCheck,
  PanelLeftClose,
  PanelLeftOpen,
  ScanLine,
  X,
} from "lucide-react";
import { NavLink } from "react-router";

import AdminProfileMenu from "@/components/admin/sidebar/AdminProfileMenu";

const menuItems = [
  {
    name: "Dashboard",
    path: "/admin",
    icon: LayoutGrid,
    end: true,
  },
  {
    name: "Categories",
    path: "/admin/categories",
    icon: ListTree,
  },
  {
    name: "Awaiting Receipt",
    path: "/admin/orders/awaiting-receipt",
    icon: ScanLine,
  },
  {
    name: "Inspection",
    path: "/admin/orders/inspection",
    icon: ClipboardCheck,
  },
  {
    name: "Ready to Ship",
    path: "/admin/orders/ready-to-ship",
    icon: PackageCheck,
  },
  {
    name: "Shipping Summary",
    path: "/admin/orders/summary",
    icon: ClipboardList,
  },
  {
    name: "Chat",
    path: "/admin/chats",
    icon: MessageSquareText,
  },
];

function AdminSidebar({
  isOpen = false,
  collapsed = false,
  onClose,
  onToggle,
}) {
  const desktopWidth = collapsed ? "xl:w-[76px] xl:px-3" : "xl:w-60 xl:px-4";

  return (
    <aside
      className={[
        "fixed inset-y-0 left-0 z-50",
        "flex h-full w-[min(20rem,calc(100vw-3rem))] shrink-0 flex-col",
        "bg-[#1F1F1F] px-4 py-5 shadow-2xl",
        "transition-[width,transform,padding] duration-300 ease-out",
        "xl:static xl:z-auto xl:translate-x-0 xl:py-6 xl:shadow-none",
        desktopWidth,
        isOpen
          ? "visible translate-x-0"
          : "invisible -translate-x-full xl:visible",
      ].join(" ")}
    >
      {/* Brand */}
      <div className="mb-8 flex h-12 shrink-0 items-center gap-2 overflow-hidden xl:mb-10">
        <div
          className={[
            "min-w-0 flex-1 overflow-hidden whitespace-nowrap",
            "transition-all duration-200",
            collapsed ? "xl:w-0 xl:flex-none xl:opacity-0" : "xl:opacity-100",
          ].join(" ")}
        >
          <h1 className="text-xl font-bold text-white">
            SPEC<span className="text-orange-500">HUB</span>
          </h1>

          <p className="text-xs text-gray-500">ADMIN PANEL</p>
        </div>

        {/* Mobile close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close admin navigation"
          className="inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-xl text-zinc-400 transition hover:bg-zinc-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-400 xl:hidden"
        >
          <X size={22} />
        </button>

        {/* Desktop collapse button */}
        <button
          type="button"
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="hidden size-10 shrink-0 cursor-pointer items-center justify-center rounded-xl text-zinc-400 transition hover:bg-zinc-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-400 xl:inline-flex"
        >
          {collapsed ? (
            <PanelLeftOpen size={20} />
          ) : (
            <PanelLeftClose size={20} />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="scrollbar-hide min-h-0 flex-1 space-y-2 overflow-y-auto overflow-x-hidden">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={onClose}
              title={collapsed ? item.name : undefined}
              className={({ isActive }) =>
                [
                  "flex h-11 min-w-0 items-center gap-3 rounded-xl px-4",
                  "text-sm font-medium transition-all duration-200",
                  collapsed ? "xl:justify-center xl:gap-0 xl:px-0" : "",
                  isActive
                    ? "bg-[#D96A26] text-white shadow-sm"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white",
                ].join(" ")
              }
            >
              <Icon size={19} className="shrink-0" />

              <span
                className={[
                  "min-w-0 overflow-hidden truncate whitespace-nowrap",
                  "transition-all duration-200",
                  collapsed
                    ? "xl:w-0 xl:-translate-x-2 xl:opacity-0"
                    : "xl:flex-1 xl:translate-x-0 xl:opacity-100",
                ].join(" ")}
              >
                {item.name}
              </span>
            </NavLink>
          );
        })}
      </nav>

      {/* Profile */}
      <div className="shrink-0 pt-4">
        <AdminProfileMenu collapsed={collapsed} />
      </div>
    </aside>
  );
}

export default AdminSidebar;
