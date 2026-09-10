import {
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
} from "motion/react";

import { useWebAssets } from "@/hook/webAsset/useWebAssets";

function AdminSidebarBrand({
  collapsed,
  isMobile,
  onToggle,
  onClose,
}) {
  const webAssetsQuery = useWebAssets();

  const logoUrl = webAssetsQuery.data?.homeImageUrl;

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
            initial={{
              opacity: 0,
              x: -8,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            exit={{
              opacity: 0,
              x: -8,
            }}
            transition={{
              duration: 0.15,
            }}
            className="min-w-0 flex-1 overflow-hidden whitespace-nowrap"
          >
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="SpecHub"
                className="h-15 w-auto object-contain object-left"
              />
            ) : (
              <p className="text-xl font-bold leading-none text-neutral-900">
                SPEC
                <span className="text-orange-500">
                  HUB
                </span>
              </p>
            )}

            <p className="mt-1 text-[10px] font-medium tracking-wide text-neutral-400">
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
          className="
            inline-flex size-10 shrink-0 cursor-pointer
            items-center justify-center rounded-xl
            text-neutral-500 transition-colors
            hover:bg-neutral-200 hover:text-neutral-900
            focus:outline-none
            focus-visible:ring-2
            focus-visible:ring-orange-400
          "
        >
          <X size={21} />
        </button>
      ) : (
        <motion.button
          type="button"
          onClick={onToggle}
          aria-label={
            collapsed
              ? "Expand sidebar"
              : "Collapse sidebar"
          }
          aria-expanded={!collapsed}
          title={
            collapsed
              ? "Expand sidebar"
              : "Collapse sidebar"
          }
          whileHover={{
            scale: 1.05,
          }}
          whileTap={{
            scale: 0.94,
          }}
          className="
            inline-flex size-10 shrink-0 cursor-pointer
            items-center justify-center rounded-xl
            border border-orange-300
            text-neutral-500
            transition-colors
            hover:bg-orange-50
            hover:text-orange-600
            focus:outline-none
            focus:ring-2
            focus:ring-orange-400
          "
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