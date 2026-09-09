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

function MainNav() {
  return (
    <nav className=" bg-white shadow-lg">
      <div className="mx-auto flex max-w-8xl items-center gap-1 px-4">
        {TOP_NAV.map(({ label, to, hasDropdown }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-1  px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "border-[#f97316] text-[#ffffff] bg-[#f97316] inset-shadow-sm/55"
                  : "border-transparent text-neutral-500 hover:text-[#f97316]"
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
