import {
  ClipboardCheck,
  ClipboardList,
  LayoutGrid,
  ListTree,
  MessageSquareText,
  PackageCheck,
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

function AdminSidebar({ isOpen = false, onClose }) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex h-full w-[min(20rem,calc(100vw-3rem))] shrink-0 flex-col bg-[#1F1F1F] px-4 py-5 shadow-2xl transition-transform duration-200 xl:static xl:z-auto xl:w-60 xl:translate-x-0 xl:py-6 xl:shadow-none ${
        isOpen
          ? "visible translate-x-0"
          : "invisible -translate-x-full xl:visible"
      }`}
    >
      {/* LOGO */}
      <div className="mb-8 flex items-start justify-between gap-4 xl:mb-10">
        <div>
          <h1 className="text-xl font-bold text-white">
            SPEC<span className="text-orange-500">HUB</span>
          </h1>

          <p className="text-xs text-gray-500">ADMIN PANEL</p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close admin navigation"
          className="inline-flex size-11 cursor-pointer items-center justify-center rounded-xl text-zinc-400 transition hover:bg-zinc-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-400 xl:hidden"
        >
          <X size={22} />
        </button>
      </div>

      {/* MENU */}
      <nav className="scrollbar-hide min-h-0 flex-1 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-[#D96A26] text-white"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }`
              }
            >
              <Icon size={18} />

              <span>
                {item.name}
              </span>
            </NavLink>
          );
        })}
      </nav>

      {/* ADMIN PROFILE MENU */}
      <div className="shrink-0 pt-4">
        <AdminProfileMenu />
      </div>
    </aside>
  );
}

export default AdminSidebar;
