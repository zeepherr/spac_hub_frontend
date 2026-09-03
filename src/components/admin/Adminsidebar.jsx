import {
  ClipboardCheck,
  LayoutGrid,
  ListTree,
  MessageSquareText,
  PackageCheck,
  ScanLine,
  TriangleAlert,
} from "lucide-react";
import { NavLink } from "react-router";

import { LogoutButton } from "@/components/auth/LogoutButton";

const menuItems = [
  {
    name: "หน้าหลัก",
    path: "/admin",
    icon: LayoutGrid,
  },
  {
    name: "พัสดุรอสแกนรับ",
    path: "/admin/orders/awaiting-receipt",
    icon: ScanLine,
  },
  {
    name: "รอตรวจสภาพ",
    path: "/admin/orders/inspection",
    icon: ClipboardCheck,
  },
  {
    name: "พร้อมจัดส่ง",
    path: "/admin/orders/ready-to-ship",
    icon: PackageCheck,
  },
  {
    name: "ต้องดำเนินการ",
    path: "/admin/orders/action-required",
    icon: TriangleAlert,
  },
  {
    name: "แชท",
    path: "/admin/chats",
    icon: MessageSquareText,
  },
  {
    name: "หมวดหมู่",
    path: "/admin/categories",
    icon: ListTree,
  },
];

function AdminSidebar() {
  return (
    <aside className="flex h-full w-60 shrink-0 flex-col bg-[#1F1F1F] px-4 py-6">
      <div className="mb-10">
        <h1 className="text-xl font-bold text-white">
          SPEC<span className="text-orange-500">HUB</span>
        </h1>

        <p className="text-xs text-gray-500">ADMIN PANEL</p>
      </div>

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
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="shrink-0 pt-4">
        <LogoutButton />
      </div>
    </aside>
  );
}

export default AdminSidebar;
