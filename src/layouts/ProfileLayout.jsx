import { LogoutButton } from "@/components/auth/LogoutButton";
import { hasUnreadSupportMessage } from "@/components/support/support.constants";
import { useMySupportCases } from "@/hook/support/useMySupportCases";
import useAuthStore from "@/stores/auth.store";
import {
  Heart,
  LayoutDashboard,
  MessageSquareText,
  Store,
  Tag,
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
  {
    id: "profile",
    label: "Profile",
    to: "/user/profile",
    icon: Tag,
  },
  {
    id: "favorites",
    label: "Favorites",
    to: "/user/favorites",
    icon: Heart,
  },
];

function ProfileLayout() {
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
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-base-100 text-base-content md:flex-row">
      {/* Sidebar - ปรับเป็น md:w-80 เพื่อให้สมส่วนและเต็มกรอบ */}
      <aside className="flex h-auto w-full shrink-0 flex-col border-b border-base-300 bg-base-200/50 md:h-full md:w-80 md:border-b-0 md:border-r">
        {/* ส่วนโปรไฟล์ - จัดกึ่งกลาง (flex flex-col items-center text-center) */}
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
            {/* LED Status Indicator (Hardware Theme) */}
            <span className="hardware-indicator absolute bottom-1 right-1" />
          </div>

          <h2 className="text-xl font-bold tracking-tight text-base-content">
            {displayName}
          </h2>

          <p className="mt-1 text-xs font-bold uppercase tracking-wider text-neutral/70">
            SPECHUB Account
          </p>
        </div>

        {/* เมนูการใช้งาน */}
        <nav aria-label="เมนูบัญชี" className="p-2 md:p-4">
          <p className="mb-3 hidden px-4 text-m font-bold uppercase tracking-wider text-neutral/70 md:block">
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
                      `flex min-h-11 w-auto items-center gap-2.5 rounded-field px-3 py-2.5 text-left text-sm font-bold transition-all md:min-h-12 md:w-full md:gap-3 md:px-4 md:py-3 ${
                        isActive
                          ? "bg-[#f97316] text-white shadow-md border border-[#ea580c]"
                          : "border border-transparent text-base-content hover:bg-base-300/60 hover:text-base-content"
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

                    {menu.id === "support-inbox" && unreadSupportCount > 0 && (
                      <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-white px-1.5 py-0.5 text-[10px] font-black text-orange-600">
                        {unreadSupportCount > 99 ? "99+" : unreadSupportCount}
                      </span>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="hidden flex-1 md:block" />

        {/* Logout Button at bottom of Sidebar */}
        <div className="mt-auto hidden border-t border-base-300 p-4 md:block">
          <LogoutButton />
        </div>
      </aside>

      {/* เนื้อหาด้านขวา */}
      <main
        aria-label="เนื้อหาบัญชี"
        className="scrollbar-hide min-w-0 flex-1 overflow-y-auto bg-base-100 "
      >
        <Outlet />
      </main>
    </div>
  );
}

export default ProfileLayout;
