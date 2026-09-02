import { useCategories } from "@/hook/category/useCategory";
import {
  Boxes,
  Cable,
  ChevronRight,
  CircuitBoard,
  Cpu,
  Fan,
  Gamepad2,
  HardDrive,
  Layers,
  MemoryStick,
  Menu,
  Monitor,
  Network,
  Plug,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router";

/**
 * หา icon ที่เหมาะกับชื่อหมวดหมู่ (จับคู่แบบคร่าวๆ จากชื่อที่ backend ส่งมา)
 * ถ้าไม่ match อะไรเลยจะ fallback เป็น Boxes
 */
function getCategoryIcon(name = "") {
  const key = name.toLowerCase();
  if (key.includes("cpu")) return Cpu;
  if (key.includes("main") || key.includes("board")) return CircuitBoard;
  if (key.includes("ram") || key.includes("memory")) return MemoryStick;
  if (key.includes("vga") || key.includes("gpu")) return Layers;
  if (key.includes("ssd") || key.includes("hdd")) return HardDrive;
  if (key.includes("psu") || key.includes("power")) return Plug;
  if (key.includes("case")) return Boxes;
  if (key.includes("cool") || key.includes("fan")) return Fan;
  if (key.includes("monitor") || key.includes("จอ")) return Monitor;
  if (key.includes("gaming") || key.includes("gear")) return Gamepad2;
  if (key.includes("network") || key.includes("เน็ต")) return Network;
  if (key.includes("เสริม") || key.includes("accessor")) return Cable;
  if (key.includes("มือสอง") || key.includes("used")) return RefreshCw;
  return Boxes;
}

export default function CategorySidebar() {
  const {
    data: categories = [],
    isLoading,
    isError,
  } = useCategories({ includeInactive: false });

  return (
    <aside className="hardware-surface flex h-fit flex-col">
      <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
        <h2 className="text-base font-bold text-neutral-900">หมวดหมู่สินค้า</h2>
        <Menu size={18} className="text-neutral-400" />
      </div>

      <ul className="flex flex-col">
        {isLoading &&
          Array.from({ length: categories?.length }).map((_, i) => (
            <li key={i} className="flex items-center gap-3 px-4 py-3">
              <div className="h-4 w-4 animate-pulse rounded bg-neutral-200" />
              <div className="h-3 w-24 animate-pulse rounded bg-neutral-200" />
            </li>
          ))}

        {isError && (
          <li className="px-4 py-3 text-sm text-[#dc2626]">
            โหลดหมวดหมู่ไม่สำเร็จ
          </li>
        )}

        {!isLoading &&
          !isError &&
          categories.map((category) => {
            const Icon = getCategoryIcon(category.name);
            return (
              <li key={category.id}>
                <Link
                  to={`/categories/${category.id}`}
                  className="flex items-center justify-between px-4 py-3 text-sm font-medium text-neutral-800 transition hover:bg-neutral-50 hover:text-[#f97316]"
                >
                  <span className="flex items-center gap-3">
                    <Icon size={18} className="text-neutral-500" />
                    {category.name}
                  </span>
                  <ChevronRight size={16} className="text-neutral-300" />
                </Link>
              </li>
            );
          })}
      </ul>

      <div className="hardware-divider" />

      {/* จัดสเปคคอม */}
      <div className="p-4">
        <p className="mb-3 text-sm font-bold text-neutral-900">จัดสเปคคอม</p>
        <p className="mb-3 text-xs text-neutral-500">
          เลือกชิ้นส่วน คำนวณงบ ประกอบคอมในแบบคุณ
        </p>
        <button className="btn btn-accent w-full">เริ่มจัดสเปคเลย</button>
      </div>
    </aside>
  );
}
