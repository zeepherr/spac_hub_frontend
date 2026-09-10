import { ChevronDown } from "lucide-react";
import { NavLink } from "react-router";

const TOP_NAV = [
  { label: "Home", to: "/" },
  { label: "Build PC", to: "/build", hasDropdown: true },
  { label: "Promotions", to: "/promotions" },
  { label: "Products", to: "/products" },
  { label: "Reviews", to: "/reviews" },
  { label: "Services", to: "/services" },
  { label: "Contact", to: "/contact" },
];

const GLASS_TRACK =
  "bg-white/50 backdrop-blur-xl border border-neutral-200/70 shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_8px_24px_rgba(0,0,0,0.06)]";
const ITEM_IDLE = "text-neutral-600 hover:text-[#f97316]";
const ITEM_ACTIVE =
  "bg-[#f97316] text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_4px_12px_rgba(249,115,22,0.35)]";

function MainNav() {
  return (
    <nav className="py-4">
      <div className="mx-auto max-w-8xl px-4">
        <div
          className={`inline-flex items-center gap-1 rounded-2xl p-1.5 ${GLASS_TRACK}`}
        >
          {TOP_NAV.map(({ label, to, hasDropdown }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-1 rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-150 ${
                  isActive ? ITEM_ACTIVE : ITEM_IDLE
                }`
              }
            >
              {label}
              {hasDropdown && <ChevronDown size={14} />}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default MainNav;
