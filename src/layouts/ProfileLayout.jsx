import { NavLink, Outlet } from "react-router";
import { LogoutButton } from "@/components/auth/LogoutButton";
import {
  LayoutDashboard,
  Store,
  Tag,
  Heart,
  UserRound,
} from "lucide-react";

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
    id: "my-orders",
    label: "MyOrder",
    to: "/user/details",
    icon: Tag,
  },
  {
    id: "favorites",
    label: "Favorite",
    to: "/user/favorites",
    icon: Heart,
  },
];
function ProfileLayout() {


  return (
    <div className="flex min-h-full flex-col bg-white md:flex-row">
      {/* Sidebar */}
      <aside className="flex w-full cursor-pointer shrink-0 flex-col border-b border-neutral-200 bg-neutral-100 md:w-72 md:border-b-0 md:border-r">
        {/* โปรไฟล์ */}
        <div className="border-b border-neutral-200 px-6 py-8">
          <div className="mb-4 flex size-24 items-center justify-center rounded-full border border-neutral-200 bg-white shadow-sm">
            <UserRound
              size={42}
              strokeWidth={1.5}
              className="text-neutral-600"
              aria-hidden="true"
            />
          </div>

          <h2 className="text-xl font-semibold text-neutral-900">
            ชื่อผู้ใช้งาน
          </h2>

          <p className="mt-1 text-sm text-neutral-600">
            บัญชี SPECHUB
          </p>
        </div>

        {/* เมนูทั้ง 4 */}
        <nav
          aria-label="เมนูบัญชี"
          className="px-4 py-6"
        >
          <ul className="space-y-3">
            <ul className="space-y-3">
              {menus.map((menu) => {
                const Icon = menu.icon;

                return (
                  <li key={menu.id}>
                    <NavLink
                      to={menu.to}
                      end={menu.end}
                      className={({ isActive }) =>
                        `flex min-h-14 w-full cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-left text-base font-semibold transition-colors ${isActive
                          ? "border-orange-500 bg-orange-500 text-white shadow-sm hover:bg-orange-600"
                          : "border-neutral-200 bg-white text-neutral-800 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700"
                        }`
                      }
                    >
                      <Icon
                        size={22}
                        strokeWidth={1.8}
                        className="shrink-0"
                        aria-hidden="true"
                      />

                      <span>{menu.label}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </ul>
        </nav>

         {/* ปุ่ม Logout ด้านล่าง Sidebar */}
        <div className="mt-auto border-t border-neutral-200 p-4 ">
          <LogoutButton />
        </div>

      </aside>

      {/* เนื้อหาด้านขวา */}
      <main
        aria-label="เนื้อหาบัญชี"
        className="min-w-0 flex-1 bg-white"
      >
        <Outlet />
      </main>
    </div>
  );
}

export default ProfileLayout;