import {
  Cpu,
  Heart,
  RefreshCw,
  Search,
  ShoppingCart,
  User,
} from "lucide-react";
import { Link, NavLink, useLocation } from "react-router";

function Logo() {
  return (
    <Link to="/" className="flex shrink-0 flex-col items-start">
      <span className="flex items-center text-2xl font-black tracking-tight">
        <span className="matte mr-2 flex h-8 w-8 items-center justify-center rounded-lg">
          <Cpu className="h-5 w-5 text-[#f97316]" strokeWidth={2} />
        </span>
        SPEC<span className="text-[#f97316]">HUB</span>
      </span>
      <span className="hardware-label ml-10 -mt-1 text-[10px] normal-case text-secondary">
        Used Tech. Trusted Performance.
      </span>
    </Link>
  );
}

function SearchForm() {
  return (
    <form className="flex w-full max-w-2xl overflow-hidden rounded-full border border-neutral-200 bg-neutral-50">
      <input
        type="text"
        placeholder="ค้นหาสินค้า, แบรนด์, รุ่น..."
        className="w-full bg-transparent px-5 py-3 text-sm text-neutral-800 outline-none placeholder:text-neutral-400"
      />
      <button
        type="submit"
        aria-label="ค้นหา"
        className="flex w-14 shrink-0 items-center justify-center bg-[#f97316] text-white transition hover:bg-orange-600"
      >
        <Search size={20} />
      </button>
    </form>
  );
}

const navLinkClass = ({ isActive }) =>
  `hover:text-[#f97316] ${isActive ? "text-[#f97316]" : "text-neutral-700"}`;

const iconLinkClass = ({ isActive }) =>
  `flex items-center gap-1.5 hover:text-[#f97316] ${
    isActive ? "text-[#f97316]" : "text-neutral-700"
  }`;

function MainNav() {
  return (
    <nav className="flex shrink-0 items-center gap-6 whitespace-nowrap text-sm font-semibold">
      <NavLink to="/" end className={iconLinkClass}>
        <RefreshCw size={18} />
        เปรียบเทียบ
      </NavLink>

      <NavLink to="/about" className={iconLinkClass}>
        <Heart size={18} />
        รายการโปรด
      </NavLink>

      <NavLink to="/store" className={iconLinkClass}>
        <span className="relative">
          <ShoppingCart size={18} />
          <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#f97316] text-[10px] text-white">
            0
          </span>
        </span>
        ตะกร้าสินค้า
      </NavLink>

      <div className="flex items-center gap-1.5 text-neutral-700">
        <User size={18} />
        <NavLink to="/login" className={navLinkClass}>
          เข้าสู่ระบบ
        </NavLink>
        <span> / </span>
        <NavLink to="/register" className={navLinkClass}>
          สมัตรสมาชิก
        </NavLink>
      </div>
    </nav>
  );
}

function Header() {
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <header>
      <div className="sticky top-0 z-40 w-screen shadow-sm bg-white">
        <div className="mx-auto grid max-w-8xl grid-cols-[auto_1fr_auto] items-center gap-6 px-4 py-3">
          <Logo />

          <div className="flex justify-center">
            {isAuthPage ? <MainNav /> : <SearchForm />}
          </div>

          <div className="justify-self-end">{!isAuthPage && <MainNav />}</div>
        </div>
      </div>
    </header>
  );
}

export default Header;
