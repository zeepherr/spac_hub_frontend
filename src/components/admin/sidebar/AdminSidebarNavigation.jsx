import { AnimatePresence, motion } from "motion/react";
import { NavLink } from "react-router";

import { menuItems } from "./adminSidebar.constants";

function AdminSidebarNavigation({ collapsed, onNavigate }) {
  return (
    <nav className="scrollbar-hide mt-7 min-h-0 flex-1 space-y-1.5 overflow-y-auto overflow-x-hidden">
      {menuItems.map((item, index) => {
        const Icon = item.icon;

        return (
          <motion.div
            key={item.path}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.2,
              delay: index * 0.035,
            }}
            whileTap={{ scale: 0.98 }}
          >
            <NavLink
              to={item.path}
              end={item.end}
              onClick={onNavigate}
              title={collapsed ? item.name : undefined}
              className={({ isActive }) =>
                [
                  "flex h-11 min-w-0 items-center rounded-xl",
                  "text-sm font-medium transition-colors duration-150",
                  collapsed ? "justify-center px-0" : "gap-3 px-4",

                  isActive
                    ? "bg-[#D96A26] text-white shadow-sm"
                    : "text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900",
                ].join(" ")
              }
            >
              <Icon size={19} className="shrink-0" />

              <AnimatePresence initial={false}>
                {!collapsed && (
                  <motion.span
                    key="navigation-label"
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.13 }}
                    className="min-w-0 flex-1 truncate whitespace-nowrap"
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          </motion.div>
        );
      })}
    </nav>
  );
}

export default AdminSidebarNavigation;