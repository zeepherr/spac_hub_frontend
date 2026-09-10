import { logout } from "@/api/auth/auth.api";
import { useUserProfile } from "@/hook/user/useUserProfile";
import { clearClientSession } from "@/lib/clear.client.session";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import SidebarContent from "./AdminSidebarContent";
import {
  desktopSidebarTransition,
  mobileDrawerTransition,
} from "./adminSidebar.constants";

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
    if (isLoggingOut) return;

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
        className="
          relative z-30 hidden h-dvh shrink-0 flex-col
          border-r border-neutral-200
          bg-[#F5F5F4] shadow-sm
          xl:flex
        "
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
            className="
              fixed bottom-0 left-0 top-14 z-50
              flex w-[min(20rem,calc(100vw-3rem))]
              flex-col border-r border-neutral-200
              bg-[#F5F5F4] shadow-2xl
              xl:hidden
            "
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

export default AdminSidebar;