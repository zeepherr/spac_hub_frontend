import { useCategories } from "@/hook/category/useCategory";
import {
  Boxes,
  Cable,
  ChevronRight,
  CircuitBoard,
  Cpu,
  Fan,
  Gamepad2,
  Gpu,
  HardDrive,
  Headphones,
  Keyboard as KeyboardIcon,
  Laptop,
  MemoryStick,
  Menu,
  Monitor,
  Mouse as MouseIcon,
  Network,
  PcCase,
  Plug,
  RefreshCw,
} from "lucide-react";
import { NavLink } from "react-router";

export function getCategoryIcon(name = "") {
  const key = name.toLowerCase();
  if (key.includes("cpu")) return Cpu;
  if (key.includes("keyboard") || key.includes("คีย์บอร์ด"))
    return KeyboardIcon;
  if (
    key.includes("main") ||
    key.includes("motherboard") ||
    key.includes("board")
  )
    return CircuitBoard;
  if (key.includes("graphic") || key.includes("vga") || key.includes("gpu"))
    return Gpu;
  if (key.includes("ram") || key.includes("memory")) return MemoryStick;
  if (key.includes("storage") || key.includes("ssd") || key.includes("hdd"))
    return HardDrive;
  if (key.includes("psu") || key.includes("power")) return Plug;
  if (key.includes("case")) return PcCase;
  if (key.includes("laptop") || key.includes("notebook")) return Laptop;
  if (key.includes("headphone") || key.includes("หูฟัง")) return Headphones;
  if (key.includes("cool") || key.includes("fan")) return Fan;
  if (key.includes("monitor") || key.includes("จอ")) return Monitor;
  if (key.includes("mouse") || key.includes("เมาส์")) return MouseIcon;
  if (key.includes("gaming") || key.includes("gear")) return Gamepad2;
  if (key.includes("network") || key.includes("เน็ต")) return Network;
  if (key.includes("เสริม") || key.includes("accessor")) return Cable;
  if (key.includes("มือสอง") || key.includes("used")) return RefreshCw;
  return Boxes;
}

const GLASS_PANEL =
  "bg-white/50 backdrop-blur-xl border border-neutral-200/70 shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_8px_24px_rgba(0,0,0,0.06)]";
const ITEM_ACTIVE =
  "bg-[#f97316] text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_4px_12px_rgba(249,115,22,0.35)]";
const ITEM_IDLE = "text-neutral-600 hover:bg-white/40 hover:text-[#f97316]";
const CTA_GLASS =
  "bg-[#f97316] text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_4px_12px_rgba(249,115,22,0.3)] hover:bg-orange-600";

export default function CategorySidebar() {
  const {
    data: categories = [],
    isLoading,
    isError,
  } = useCategories({ includeInactive: false });

  return (
    <aside
      className={`flex h-fit flex-col rounded-2xl hardware-surface ${GLASS_PANEL}`}
    >
      <div className="flex items-center justify-between border-b border-neutral-200/60 px-4 py-3.5">
        <h2 className="text-sm font-semibold text-neutral-900">
          Product Categories
        </h2>
        <Menu size={16} className="text-neutral-400" />
      </div>

      <ul className="flex flex-col gap-1 p-2">
        {isLoading &&
          Array.from({ length: 10 }).map((_, i) => (
            <li key={i} className="flex items-center gap-3 px-4 py-3">
              <div className="h-4 w-4 animate-pulse rounded bg-neutral-100" />
              <div className="h-3 w-24 animate-pulse rounded bg-neutral-100" />
            </li>
          ))}

        {isError && (
          <li className="px-4 py-3 text-sm text-[#dc2626]">
            Failed to load categories
          </li>
        )}

        {!isLoading &&
          !isError &&
          categories.map((category) => {
            const Icon = getCategoryIcon(category.name);
            return (
              <li key={category.id}>
                <NavLink
                  to={`/products/categories/${category.id}`}
                  className={({ isActive }) =>
                    `flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium transition-colors duration-150 ${
                      isActive ? ITEM_ACTIVE : ITEM_IDLE
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className="flex items-center gap-3">
                        <Icon
                          size={17}
                          className={
                            isActive ? "text-white" : "text-neutral-400"
                          }
                        />
                        {category.name}
                      </span>
                      <ChevronRight
                        size={15}
                        className={isActive ? "text-white" : "text-neutral-300"}
                      />
                    </>
                  )}
                </NavLink>
              </li>
            );
          })}
      </ul>

      {/* จัดสเปคคอม */}
      <div className="border-t border-neutral-200/60 p-4">
        <p className="mb-2 text-sm font-semibold text-neutral-900">
          Build Your PC
        </p>
        <p className="mb-3 text-xs text-neutral-500">
          Choose components, calculate your budget, and build a PC your way.
        </p>
        <NavLink
          to="/build"
          className={`flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition ${CTA_GLASS}`}
        >
          Start Building
        </NavLink>
      </div>
    </aside>
  );
}
