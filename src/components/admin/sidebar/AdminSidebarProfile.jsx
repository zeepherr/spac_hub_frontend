import { ChevronUp, LoaderCircle, LogOut, UserRound } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

function AdminSidebarProfile({
  collapsed,
  user,
  fullName,
  isProfileLoading,
  isProfileMenuOpen,
  isLoggingOut,
  onProfile,
  onToggleProfileMenu,
  onLogout,
}) {
  return (
    <div className="relative shrink-0 pt-4">
      <AnimatePresence>
        {isProfileMenuOpen && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.96,
              y: 8,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.96,
              y: 8,
            }}
            transition={{
              duration: 0.15,
              ease: "easeOut",
            }}
            className={[
              "absolute z-[70] rounded-xl border border-neutral-700",
              "bg-[#292929] p-1.5 shadow-2xl",
              collapsed
                ? "bottom-0 left-[calc(100%+12px)] w-56"
                : "bottom-[calc(100%+8px)] left-0 right-0",
            ].join(" ")}
          >
            <button
              type="button"
              onClick={onProfile}
              disabled={isLoggingOut}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-neutral-200 transition-colors hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <UserRound size={17} className="shrink-0" />
              <span>Admin Profile</span>
            </button>

            <div className="my-1 border-t border-neutral-700" />

            <button
              type="button"
              onClick={onLogout}
              disabled={isLoggingOut}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-red-400 transition-colors hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoggingOut ? (
                <LoaderCircle size={17} className="shrink-0 animate-spin" />
              ) : (
                <LogOut size={17} className="shrink-0" />
              )}

              <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={onToggleProfileMenu}
        aria-haspopup="menu"
        aria-expanded={isProfileMenuOpen}
        title={collapsed ? fullName : undefined}
        whileTap={{ scale: 0.97 }}
        className={[
          "flex h-14 w-full min-w-0 items-center rounded-xl",
          "border border-neutral-700 bg-[#292929] text-left",
          "transition-colors hover:bg-[#333333]",
          "focus:outline-none focus:ring-2 focus:ring-orange-400",
          collapsed ? "justify-center px-0" : "gap-3 px-2.5",
        ].join(" ")}
      >
        <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-orange-500">
          {user?.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt={fullName}
              className="size-full object-cover"
            />
          ) : (
            <UserRound size={19} className="text-white" />
          )}
        </div>

        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              key="profile-information"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.13 }}
              className="min-w-0 flex-1 overflow-hidden whitespace-nowrap"
            >
              <p className="truncate text-sm font-medium text-white">
                {isProfileLoading ? "Loading..." : fullName}
              </p>

              <p className="truncate text-[11px] text-neutral-400">
                {user?.email || "Administrator"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {!collapsed && (
          <ChevronUp
            size={16}
            className={[
              "shrink-0 text-neutral-500 transition-transform duration-200",
              isProfileMenuOpen ? "rotate-180" : "",
            ].join(" ")}
          />
        )}
      </motion.button>
    </div>
  );
}

export default AdminSidebarProfile;
