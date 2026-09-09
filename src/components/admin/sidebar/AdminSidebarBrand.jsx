import { PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

function AdminSidebarBrand({ collapsed, isMobile, onToggle, onClose }) {
  if (isMobile) {
    return null;
  }

  return (
    <div
      className={[
        "flex h-12 shrink-0 items-center gap-3",
        collapsed ? "justify-center" : "",
      ].join(" ")}
    >
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            key="sidebar-brand"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.15 }}
            className="min-w-0 flex-1 overflow-hidden whitespace-nowrap"
          >
            <p className="text-xl font-bold leading-none text-white">
              SPEC<span className="text-orange-500">HUB</span>
            </p>

            <p className="mt-1 text-[10px] font-medium tracking-wide text-zinc-500">
              ADMIN PANEL
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {isMobile ? (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close admin navigation"
          className="inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-xl text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
        >
          <X size={21} />
        </button>
      ) : (
        <motion.button
          type="button"
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.94 }}
          className="inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-orange-700 text-zinc-400 transition-colors hover:bg-orange-500/10 hover:text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          {collapsed ? (
            <PanelLeftOpen size={19} />
          ) : (
            <PanelLeftClose size={19} />
          )}
        </motion.button>
      )}
    </div>
  );
}

export default AdminSidebarBrand;
