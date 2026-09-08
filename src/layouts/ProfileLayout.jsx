import { useState } from "react";

import { LogoutButton } from "@/components/auth/LogoutButton";
import { hasUnreadSupportMessage } from "@/components/support/support.constants";
import { useMySupportCases } from "@/hook/support/useMySupportCases";
import useAuthStore from "@/stores/auth.store";

import {
  ChevronUp,
  LayoutDashboard,
  MessageSquareText,
  Settings,
  Store,
  UserRound,
} from "lucide-react";

import { NavLink, Outlet } from "react-router";

const menus = [
  {
    id: "user-dashboard",
    label: "User Dashboard",
    to: "/user",
    end: true,
    icon: LayoutDashboard,
  },
  {
    id: "seller-dashboard",
    label: "Seller Dashboard",
    to: "/user/sell",
    icon: Store,
  },
  {
    id: "support-inbox",
    label: "Support Inbox",
    to: "/user/chats",
    icon: MessageSquareText,
  },
];

function ProfileLayout() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const user = useAuthStore((state) => state.user);

  const { data: supportCases = [] } = useMySupportCases();

  const unreadSupportCount = supportCases.filter((supportCase) =>
    hasUnreadSupportMessage(supportCase, user?.id),
  ).length;

  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.email ||
    "User";

  return (
    <div className="flex h-full overflow-hidden bg-base-100 text-base-content md:flex-row">
      {/* Sidebar */}
      <aside className="flex h-auto w-full shrink-0 flex-col border-b border-base-300 bg-base-200/50 md:h-full md:w-80 md:border-b-0 md:border-r">
        {/* User profile */}
        <div className="hidden flex-col items-center justify-center border-b border-base-300 px-6 py-8 text-center md:flex">
          <div className="relative mb-4 flex size-24 items-center justify-center rounded-full border border-base-300 bg-base-100 shadow-sm">
            {user?.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt={`Profile image of ${displayName}`}
                className="size-full rounded-full object-cover"
              />
            ) : (
              <UserRound
                size={44}
                strokeWidth={1.5}
                className="text-neutral"
                aria-hidden="true"
              />
            )}

            <span className="hardware-indicator absolute bottom-1 right-1" />
          </div>

          <h2 className="text-xl font-bold tracking-tight text-base-content">
            {displayName}
          </h2>

          <p className="mt-1 text-xs font-bold uppercase tracking-wider text-neutral/70">
            SPECHUB Account
          </p>
        </div>

        {/* Main navigation */}
        <nav aria-label="เมนูบัญชี" className="p-2 md:p-4">
          <p className="mb-3 hidden px-4 text-base font-bold uppercase tracking-wider text-neutral/70 md:block">
            My Profile
          </p>

          <ul className="chat-scrollbar flex gap-2 overflow-x-auto md:block md:space-y-2">
            {menus.map((menu) => {
              const Icon = menu.icon;

              return (
                <li key={menu.id} className="shrink-0 md:w-full">
                  <NavLink
                    to={menu.to}
                    end={menu.end}
                    className={({ isActive }) =>
                      `flex min-h-11 w-auto items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left text-sm font-bold transition-all md:min-h-12 md:w-full md:gap-3 md:px-4 md:py-3 ${
                        isActive
                          ? "border-orange-600 bg-orange-500 text-white shadow-md shadow-orange-200/60"
                          : "border-transparent text-base-content hover:bg-orange-50 hover:text-orange-600"
                      }`
                    }
                  >
                    <Icon
                      size={20}
                      strokeWidth={2}
                      className="shrink-0"
                      aria-hidden="true"
                    />

                    <span className="min-w-0 flex-1 truncate">
                      {menu.label}
                    </span>

                    {menu.id === "support-inbox" &&
                      unreadSupportCount > 0 && (
                        <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-white px-1.5 py-0.5 text-[10px] font-black text-orange-600">
                          {unreadSupportCount > 99
                            ? "99+"
                            : unreadSupportCount}
                        </span>
                      )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ดัน Settings ลงด้านล่าง */}
        <div className="hidden flex-1 md:block" />

        {/* Settings area */}
        <div className="relative mt-auto hidden border-t border-base-300 p-4 md:block">
          {/* Popup menu */}
          {isSettingsOpen && (
            <div className="absolute bottom-[82px] left-4 right-4 z-50 overflow-hidden rounded-2xl border border-neutral-200 bg-white p-2 shadow-[0_18px_45px_rgba(0,0,0,0.16)]">
              <NavLink
                to="/user/profile"
                onClick={() => setIsSettingsOpen(false)}
                className={({ isActive }) =>
                  `flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-bold transition ${
                    isActive
                      ? "bg-orange-50 text-orange-600"
                      : "text-neutral-700 hover:bg-orange-50 hover:text-orange-600"
                  }`
                }
              >
                <span className="flex size-9 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
                  <UserRound size={20} />
                </span>

                <span>Profile</span>
              </NavLink>

              <div className="mx-3 my-1 border-t border-neutral-200" />

              <div className="[&>button]:w-full [&>button]:border-0 [&>button]:bg-transparent [&>button]:shadow-none">
                <LogoutButton />
              </div>
            </div>
          )}

          {/* Settings button */}
          <button
            type="button"
            onClick={() =>
              setIsSettingsOpen((currentValue) => !currentValue)
            }
            aria-expanded={isSettingsOpen}
            aria-controls="settings-menu"
            className={`flex min-h-14 w-full cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-left font-bold shadow-sm transition-all ${
              isSettingsOpen
                ? "border-orange-300 bg-orange-50 text-orange-600"
                : "border-neutral-200 bg-white text-neutral-800 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
            }`}
          >
            <span
              className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${
                isSettingsOpen
                  ? "bg-orange-500 text-white"
                  : "bg-neutral-100 text-neutral-700"
              }`}
            >
              <Settings size={21} />
            </span>

            <span className="flex-1">Settings</span>

            <ChevronUp
              size={19}
              className={`shrink-0 transition-transform duration-200 ${
                isSettingsOpen ? "rotate-0" : "rotate-180"
              }`}
            />
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main
        aria-label="เนื้อหาบัญชี"
        className="scrollbar-hide min-w-0 flex-1 overflow-y-auto bg-base-100"
      >
        <Outlet />
      </main>
    </div>
  );
}

export default ProfileLayout;