import { logout } from "@/api/auth/auth.api";
import { useUserProfile } from "@/hook/user/useUserProfile";
import { clearClientSession } from "@/lib/clear.client.session";
import {
  ChevronUp,
  ClipboardCheck,
  ClipboardList,
  LayoutGrid,
  ListTree,
  LoaderCircle,
  LogOut,
  MessageSquareText,
  PackageCheck,
  PanelLeftClose,
  PanelLeftOpen,
  ScanLine,
  UserRound,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { toast } from "sonner";

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

const desktopSidebarTransition = {
  type: "spring",
  stiffness: 320,
  damping: 34,
  mass: 0.7,
};

const mobileDrawerTransition = {
  type: "spring",
  stiffness: 380,
  damping: 38,
  mass: 0.8,
};

function AdminSidebar({
  isMobileOpen = false,
  collapsed = false,
  onMobileClose,
  onToggleCollapsed,
}) {
  const navigate = useNavigate();
  const sidebarRootRef = useRef(null);

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const profileQuery = useUserProfile();
  const user = profileQuery.data?.user;

  const fullName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    "System Admin";

  useEffect(() => {
    if (!isProfileMenuOpen) {
      return undefined;
    }

    function handlePointerDown(event) {
      if (!sidebarRootRef.current?.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsProfileMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isProfileMenuOpen]);

  function closeMobileSidebar() {
    setIsProfileMenuOpen(false);
    onMobileClose?.();
  }

  function toggleDesktopSidebar() {
    setIsProfileMenuOpen(false);
    onToggleCollapsed?.();
  }

  function handleProfileNavigation(isMobile) {
    setIsProfileMenuOpen(false);

    if (isMobile) {
      onMobileClose?.();
    }

    navigate("/admin/profile");
  }

  async function handleLogout() {
    if (isLoggingOut) {
      return;
    }

    setIsProfileMenuOpen(false);

    try {
      setIsLoggingOut(true);

      const data = await logout();

      toast.success(data?.message || "Logged out successfully", {
        position: "top-center",
      });
    } catch (error) {
      console.error("Logout error:", error);

      toast.warning(
        "Unable to connect to the server, but you have been logged out on this device.",
        {
          position: "top-center",
        },
      );
    } finally {
      await clearClientSession({
        explicit: true,
      });

      onMobileClose?.();

      navigate("/login", {
        replace: true,
      });

      setIsLoggingOut(false);
    }
  }

  const sharedProfileProps = {
    user,
    fullName,
    isProfileLoading: profileQuery.isPending,
    isProfileMenuOpen,
    isLoggingOut,
    onToggleProfileMenu: () =>
      setIsProfileMenuOpen((currentValue) => !currentValue),
    onLogout: handleLogout,
  };

  return (
    <div ref={sidebarRootRef} className="contents">
      {/* Desktop sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: collapsed ? 72 : 240,
        }}
        transition={desktopSidebarTransition}
        className="relative z-30 hidden h-dvh shrink-0 flex-col bg-[#1F1F1F] shadow-sm xl:flex"
      >
        <SidebarContent
          collapsed={collapsed}
          isMobile={false}
          onToggle={toggleDesktopSidebar}
          onNavigate={() => setIsProfileMenuOpen(false)}
          onProfile={() => handleProfileNavigation(false)}
          {...sharedProfileProps}
        />
      </motion.aside>

      {/* Mobile drawer */}
      <AnimatePresence initial={false}>
        {isMobileOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={mobileDrawerTransition}
            className="fixed bottom-0 left-0 top-14 z-50 flex w-[min(20rem,calc(100vw-3rem))] flex-col bg-[#1F1F1F] shadow-2xl xl:hidden"
          >
            <SidebarContent
              collapsed={false}
              isMobile
              onClose={closeMobileSidebar}
              onNavigate={closeMobileSidebar}
              onProfile={() => handleProfileNavigation(true)}
              {...sharedProfileProps}
            />
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}

function SidebarContent({
  collapsed,
  isMobile,
  user,
  fullName,
  isProfileLoading,
  isProfileMenuOpen,
  isLoggingOut,
  onToggle,
  onClose,
  onNavigate,
  onProfile,
  onToggleProfileMenu,
  onLogout,
}) {
  return (
    <div className="flex h-full min-h-0 flex-col px-3 py-5">
      {/* Brand */}
      {!isMobile && (
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
      )}

      {/* Navigation */}
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
                      : "text-zinc-400 hover:bg-zinc-800 hover:text-white",
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

      {/* Profile area */}
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
    </div>
  );
}

export default AdminSidebar;
