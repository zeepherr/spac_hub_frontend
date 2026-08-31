import { NavLink } from "react-router";
import { LayoutGrid, ShoppingCart, Users, ClipboardCheck } from "lucide-react";

const menuItems = [
  {
    name: "Categories",
    path: "/admin/categories",
    icon: LayoutGrid,
  },
  
];

function AdminSidebar() {
  return (
    <aside className="min-h-screen w-60 bg-[#1F1F1F] px-4 py-6">
      <div className="mb-10">
        <h1 className="text-xl font-bold text-white">
          SPEC<span className="text-orange-500">HUB</span>
        </h1>

        <p className="text-xs text-gray-500">ADMIN PANEL</p>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-[#D96A26] text-white"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }`
              }
            >
              <Icon size={18} />

              {item.name}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

export default AdminSidebar;
