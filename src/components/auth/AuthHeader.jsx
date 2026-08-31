import React from "react";
import { Link, NavLink } from "react-router";
import { Search } from "lucide-react";

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <div className="matte flex h-9 w-9 items-center justify-center rounded-lg">
        {/* <span className="text-lg font-black text-accent">S</span> */}
      </div>
      <div>
        <span className="text-5xl font-black tracking-tight">SPEC</span>
        <span className="text-5xl font-black text-[#f97316] tracking-tight">
          HUB
        </span>
      </div>
    </Link>
  );
}

function Header() {
  return (
    <header>
      <div className="sticky top-0 w-full  shadow-sm  bg-[#fffff]">
        <div className="mx-auto flex max-w-8xl justify-between items-center px-2 py-3 ">
          <div className="px-30">
            <Logo />
          </div>

          <form className="overflow-hidden border flex w-full max-w-lg rounded-lg bg-transparent text-sm border-black">
            <input
              type="text"
              placeholder="ค้นหาสินค้า, แบรนด์, รุ่น..."
              className="w-full px-5 py-2 rounded-sm outline-none"
            />
            <button
              type="submit"
              aria-label="ค้นหา"
              className="px-5 py-2 flex items-center shrink-0 text-white bg-[#f97316] "
            >
              <Search size={20} />
            </button>
          </form>

          <nav className="flex items-center justify-center max-w-full gap-10">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-sm hover:text-[#f97316]  font-semibold normal-case ${
                  isActive ? "text-[#f97316]" : "text-[#171717]"
                }`
              }
            >
              เปรียบเทียบ
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `text-sm hover:text-[#f97316]  font-semibold normal-case ${
                  isActive ? "text-[#f97316]" : "text-[#171717]"
                }`
              }
            >
              รายการโปรด
            </NavLink>

            <NavLink
              to="/store"
              className={({ isActive }) =>
                `text-sm hover:text-[#f97316]  font-semibold normal-case ${
                  isActive
                    ? "text-[#f97316] shadow-[#ea580c]"
                    : "text-[#171717]"
                }`
              }
            >
              ตะกร้าสินค้า
            </NavLink>

            <NavLink
              to="/login"
              className={({ isActive }) =>
                `text-sm hover:text-[#f97316]  font-semibold normal-case ${
                  isActive
                    ? "text-[#f97316] text-shadow-[#ea580c] text-shadow-3"
                    : "text-[#171717]"
                }`
              }
            >
              เข้าสู่ระบบ / สมัตรสมาชิก
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
