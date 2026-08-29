import { NavLink } from "react-router";
import { LayoutGrid } from "lucide-react";

function AdminSidebar() {
  return (
    <aside className="min-h-screen w-64 bg-[#181818] px-4 py-6">
      {/* Brand */}
      <div className="mb-10 px-3">
        <h1 className="text-xl font-bold tracking-wide text-white">
          SPECHUB
        </h1>

        <p className="mt-1 text-xs tracking-widest text-zinc-500">
          ADMIN PANEL
        </p>
      </div>

      {/* Menu */}
      <nav>
        <NavLink
          to="/admin/categories"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors ${
              isActive
                ? "bg-orange-600 text-white"
                : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
            }`
          }
        >
          <LayoutGrid size={18} />
          <span>Categories</span>
        </NavLink>
      </nav>
    </aside>
  );
}

export default AdminSidebar;