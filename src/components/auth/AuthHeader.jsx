import React from "react";
import { Link, NavLink } from "react-router";

const NAV_LINKS = [
  { label: "หน้าหลัก", to: "/" },
  { label: "เกี่ยวกับเรา", to: "/about" },
];

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <div className="matte flex h-9 w-9 items-center justify-center rounded-lg">
        {/* <span className="text-lg font-black text-accent">S</span> */}
      </div>
      <span className="text-lg font-black tracking-tight">SPECHUB</span>
    </Link>
  );
}

function Header() {
  return (
    <header className="sticky top-0 w-full  shadow-sm  bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-3 items-center px-4 py-3">
        <Logo />
        <nav className="flex items-center justify-center gap-10">
          {NAV_LINKS.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `btn btn-ghost btn-sm rounded-field font-semibold normal-case ${
                  isActive ? "text-accent" : "text-neutral"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div />
      </div>
    </header>
  );
}

export default Header;
