import { NavLink, Outlet } from "react-router";
import { LogoutButton } from "@/components/auth/LogoutButton";
import {
  LayoutDashboard,
  Store,
  Tag,
  Heart,
  UserRound,
} from "lucide-react";
import useAuthStore from "@/stores/auth.store";

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
  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.email ||
    "User";

  return (
    <div className="flex min-h-full flex-col bg-base-100 text-base-content md:flex-row">
      {/* Sidebar - set to md:w-80 for proportional layout */}
      <aside className="flex w-full shrink-0 flex-col border-b border-base-300 bg-base-200/50 md:w-80 md:border-b-0 md:border-r">
        
        {/* Profile Section - Centered */}
        <div className="flex flex-col items-center justify-center border-b border-base-300 px-6 py-8 text-center">
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

        {/* Navigation Menu */}
        <nav aria-label="Account Menu" className="p-4">
          <p className="mb-3 px-4 text-m font-bold uppercase tracking-wider text-neutral/70">
            My Account
          </p>

          <ul className="space-y-2">
            {menus.map((menu) => {
              const Icon = menu.icon;

              return (
                <li key={menu.id}>
                  <NavLink
                    to={menu.to}
                    end={menu.end}
                    className={({ isActive }) =>
                      `flex min-h-12 w-full items-center gap-3 rounded-field px-4 py-3 text-left text-sm font-bold transition-all ${
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
                    <span>{menu.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="flex-1" />

        {/* Logout Button at bottom of Sidebar */}
        <div className="mt-auto border-t border-base-300 p-4">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content Area */}
      <main aria-label="Account Content" className="min-w-0 flex-1 bg-base-100 ">
        <Outlet />
      </main>
    </div>
  );
}

export default ProfileLayout;