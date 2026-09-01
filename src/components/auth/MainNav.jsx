import { ChevronDown } from "lucide-react";
import { NavLink } from "react-router";

const TOP_NAV = [
  { label: "หน้าหลัก", to: "/" },
  { label: "คอมประกอบ", to: "/build", hasDropdown: true },
  { label: "โปรโมชั่น", to: "/promotions" },
  { label: "สินค้า", to: "/products" },
  { label: "สินค้ามือสอง", to: "/used" },
  { label: "รีวิว", to: "/reviews" },
  { label: "บริการ", to: "/services" },
  { label: "ติดต่อเรา", to: "/contact" },
];

function MainNav() {
  return (
    <nav className="border-t border-neutral-100 bg-white">
      <div className="mx-auto flex max-w-8xl items-center gap-1 px-4">
        {TOP_NAV.map(({ label, to, hasDropdown }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-1 px-4 py-3 text-sm font-semibold transition ${
                isActive
                  ? "bg-[#f97316] text-white"
                  : "text-neutral-700 hover:text-[#f97316]"
              }`
            }
          >
            {label}
            {hasDropdown && <ChevronDown size={14} />}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default MainNav;
