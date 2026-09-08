import {
  ClipboardCheck,
  ClipboardList,
  LayoutGrid,
  ListTree,
  MessageSquareText,
  PackageCheck,
  ScanLine,
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

function AdminSidebar() {
  return (
    <aside className="flex h-full w-60 shrink-0 flex-col bg-[#1F1F1F] px-4 py-6">
      {/* LOGO */}
      <div className="mb-10">
        <h1 className="text-xl font-bold text-white">
          SPEC
          <span className="text-orange-500">
            HUB
          </span>
        </h1>

        <p className="text-xs text-gray-500">
          ADMIN PANEL
        </p>
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