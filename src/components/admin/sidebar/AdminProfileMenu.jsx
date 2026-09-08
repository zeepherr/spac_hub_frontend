import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ChevronUp,
  LoaderCircle,
  LogOut,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";

import { logout } from "@/api/auth/auth.api";
import { useUserProfile } from "@/hook/user/useUserProfile";
import { clearClientSession } from "@/lib/clear.client.session";

function AdminProfileMenu() {
  const navigate = useNavigate();

  const [isLoggingOut, setIsLoggingOut] =
    useState(false);

  const profileQuery = useUserProfile();

  const user = profileQuery.data?.user;

  const fullName =
    [user?.firstName, user?.lastName]
      .filter(Boolean)
      .join(" ") || "Admin";

  async function handleLogout() {
    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);

      const data = await logout();

      toast.success(
        data?.message || "Logged out successfully",
        {
          position: "top-center",
        },
      );
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

      navigate("/login", {
        replace: true,
      });

      setIsLoggingOut(false);
    }
  }

  return (
    <div className="group relative">
      {/* DROPDOWN */}
      <div
        className="
          invisible absolute bottom-full left-0 mb-2
          w-full translate-y-2 rounded-xl
          border border-neutral-700 bg-[#292929]
          p-1.5 opacity-0 shadow-xl
          transition-all duration-200
          group-hover:visible
          group-hover:translate-y-0
          group-hover:opacity-100
        "
      >
        {/* ADMIN PROFILE */}
        <button
          type="button"
          onClick={() =>
            navigate("/admin/profile")
          }
          disabled={isLoggingOut}
          className="
            flex w-full items-center gap-3
            rounded-lg px-3 py-2.5
            text-left text-sm text-neutral-200
            transition
            hover:bg-neutral-700
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <UserRound
            size={17}
            className="shrink-0"
          />

          <span>Admin Profile</span>
        </button>

        <div className="my-1 border-t border-neutral-700" />

        {/* LOGOUT */}
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="
            flex w-full items-center gap-3
            rounded-lg px-3 py-2.5
            text-left text-sm text-red-400
            transition
            hover:bg-red-500/10
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {isLoggingOut ? (
            <LoaderCircle
              size={17}
              className="shrink-0 animate-spin"
            />
          ) : (
            <LogOut
              size={17}
              className="shrink-0"
            />
          )}

          <span>
            {isLoggingOut
              ? "Logging out..."
              : "Logout"}
          </span>
        </button>
      </div>

      {/* PROFILE BUTTON */}
      <button
        type="button"
        className="
          flex w-full items-center gap-3
          rounded-xl border border-neutral-700
          bg-[#292929] p-3
          text-left
          transition
          hover:bg-[#333333]
        "
      >
        {/* AVATAR */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-orange-500">
          {user?.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt={fullName}
              className="h-full w-full object-cover"
            />
          ) : (
            <UserRound
              size={19}
              className="text-white"
            />
          )}
        </div>

        {/* USER INFO */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-white">
            {profileQuery.isPending
              ? "Loading..."
              : fullName}
          </p>

          <p className="truncate text-[11px] text-neutral-400">
            {user?.email || "Administrator"}
          </p>
        </div>

        <ChevronUp
          size={16}
          className="
            shrink-0 text-neutral-500
            transition-transform duration-200
            group-hover:rotate-180
          "
        />
      </button>
    </div>
  );
}

export default AdminProfileMenu;