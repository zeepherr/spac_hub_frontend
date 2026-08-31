import React from "react";
import { Link, NavLink, useLocation } from "react-router";
import { Search } from "lucide-react";

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <div className="matte flex h-9 w-9 items-center justify-center rounded-lg">
        {/* <span className="text-lg font-black text-accent">S</span> */}
      </div>
      <div>
<<<<<<< HEAD
        <span className="text-lg font-black tracking-tight">SPEC</span>
        <span className="text-lg font-black text-[#f97361] tracking-tight">
=======
        <span className="text-5xl font-black tracking-tight">SPEC</span>
        <span className="text-5xl font-black text-[#f97316] tracking-tight">
>>>>>>> dev
          HUB
        </span>
      </div>
    </Link>
  );
}

const navLinkClass = ({ isActive }) =>
  `text-sm hover:text-[#f97316] font-semibold normal-case ${
    isActive ? "text-[#f97316]" : "text-[#171717]"
  }`;

function MainNav() {
  return (
    <nav className="flex items-center justify-center whitespace-nowrap gap-10">
      <NavLink to="/" className={navLinkClass}>
        เปรียบเทียบ
      </NavLink>

      <NavLink to="/about" className={navLinkClass}>
        รายการโปรด
      </NavLink>

      <NavLink to="/store" className={navLinkClass}>
        ตะกร้าสินค้า
      </NavLink>

      <div className="flex gap-2 px-5">
        <NavLink to="/login" className={navLinkClass}>
          เข้าสู่ระบบ
        </NavLink>
        <p className="text-[#171717]"> / </p>
        <NavLink to="/register" className={navLinkClass}>
          สมัตรสมาชิก
        </NavLink>
      </div>
    </nav>
  );
}

function SearchForm() {
  return (
    <form className="overflow-hidden border flex w-screen max-w-sm rounded-lg bg-transparent text-sm border-black">
      <input
        type="text"
        placeholder="ค้นหาสินค้า, แบรนด์, รุ่น..."
        className="w-full px-5 py-2"
      />
      <button
        type="submit"
        aria-label="ค้นหา"
        className="px-5 py-2 flex items-center shrink-0 text-white bg-[#f97316] hover:bg-[#ea580c] hover:inset-shadow-sm/30 "
      >
        <Search size={20} />
      </button>
    </form>
  );
}

function Header() {
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <header>
      <div className="sticky top-0 w-screen  shadow-sm  bg-[#fffff]">
        <div className="mx-auto grid max-w-8xl grid-cols-[auto_1fr_auto] items-center px-2 py-3">
          <div className="justify-self-start px-30">
            <Logo />
          </div>

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
