import {
  Boxes,
  Cpu,
  HardDrive,
  Layers,
  MemoryStick,
  Pencil,
  Snowflake,
  X,
} from "lucide-react";
import { Link } from "react-router";

// TODO: เป็น mock ทั้งหมดก่อน (ยังไม่ต่อ store/hook จริงที่เก็บ selected parts ของการจัดสเปค)
// รอโค้ด store/hook ที่มีอยู่แล้วจากคุณ แล้วจะเปลี่ยนมาดึงจากตรงนั้นแทน mock พวกนี้
const MOCK_SELECTED_PARTS = [
  {
    id: 1,
    category: "CPU",
    title:
      "AMD RYZEN 7 9800X3D - 8C 16T 4.7-5.2GHz (AMD SOCKET AM5) (ระบบระบายความร้อนไม่รวมอยู่ในสินค้า / CPU COOLER NOT INCLUDED)",
    price: 17990,
    qty: 1,
    imageUrl: null,
  },
  {
    id: 2,
    category: "Mainboard",
    title: "ASUS PRIME B650M-A II - AMD SOCKET AM5 DDR5 MICRO-ATX",
    price: 3250,
    qty: 1,
    imageUrl: null,
  },
];

// แต่ละหมวดหมู่มี icon + สีวงกลมพื้นหลังของตัวเอง (mock ไว้ก่อน ถ้ามี categories API จริงแล้ว (เห็น
// CategorySidebar.jsx ใช้ useCategories อยู่) ค่อยเปลี่ยนมา map จาก category.id ที่ backend ส่งมาแทน slug
// ตรงๆ แบบนี้)
const CATEGORIES = [
  {
    slug: "vga",
    label: "VGA Card",
    icon: Layers,
    iconBg: "bg-rose-100 text-rose-500",
  },
  {
    slug: "memory",
    label: "Memory",
    icon: MemoryStick,
    iconBg: "bg-amber-100 text-amber-500",
  },
  {
    slug: "harddisk",
    label: "Harddisk",
    icon: HardDrive,
    iconBg: "bg-green-100 text-green-500",
  },
  {
    slug: "ssd",
    label: "Solid State Drive",
    icon: HardDrive,
    iconBg: "bg-teal-100 text-teal-500",
  },
  { slug: "m2", label: "M.2", icon: Cpu, iconBg: "bg-sky-100 text-sky-500" },
  {
    slug: "case",
    label: "Case",
    icon: Boxes,
    iconBg: "bg-blue-100 text-blue-500",
  },
  {
    slug: "cooling",
    label: "Cooling",
    icon: Snowflake,
    iconBg: "bg-cyan-100 text-cyan-500",
  },
];

function formatPrice(amount) {
  return `${amount.toLocaleString()}.-`;
}

function SelectedPartRow({ part }) {
  return (
    <li className="relative flex gap-3 border-l-4 border-[#f97316] bg-white p-3 hardware-shadow">
      <button
        type="button"
        aria-label="นำออก"
        // TODO: ยังไม่ผูก remove จริง รอ store/hook
        className="absolute right-2 top-2 text-neutral-400 hover:text-[#dc2626]"
      >
        <X size={16} />
      </button>

      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-box bg-neutral-50">
        {part.imageUrl ? (
          <img
            src={part.imageUrl}
            alt={part.title}
            className="h-full w-full object-contain"
          />
        ) : (
          <Cpu className="h-6 w-6 text-neutral-300" strokeWidth={1} />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1 pr-4">
        <p className="line-clamp-3 text-xs font-medium text-neutral-700">
          {part.title}
        </p>
        <p className="text-sm font-bold text-[#f97316]">
          {formatPrice(part.price)}
        </p>
        <div className="flex items-center justify-between">
          <Link
            to="#"
            className="hardware-label normal-case text-secondary hover:text-[#f97316]"
          >
            รายละเอียด
          </Link>
          <button
            type="button"
            // TODO: ยังไม่ผูกแก้จำนวนจริง รอ store/hook
            className="flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-700"
          >
            จำนวน x {part.qty}
            <Pencil size={12} />
          </button>
        </div>
      </div>
    </li>
  );
}

function BuildSidebar({ activeCategory, onSelectCategory }) {
  const total = MOCK_SELECTED_PARTS.reduce(
    (sum, part) => sum + part.price * part.qty,
    0,
  );

  return (
    <aside className="flex h-fit flex-col gap-4">
      <div className="hardware-surface flex items-center justify-between px-4 py-3">
        <span className="text-sm font-bold text-neutral-900">รวมทั้งหมด</span>
        <span className="text-xl font-bold text-[#f97316]">
          {formatPrice(total)}
        </span>
      </div>

      {MOCK_SELECTED_PARTS.length > 0 && (
        <ul className="flex flex-col gap-2">
          {MOCK_SELECTED_PARTS.map((part) => (
            <SelectedPartRow key={part.id} part={part} />
          ))}
        </ul>
      )}

      <nav className="hardware-surface flex flex-col overflow-hidden">
        {CATEGORIES.map((category) => {
          const Icon = category.icon;
          const isActive = category.slug === activeCategory;

          return (
            <button
              key={category.slug}
              type="button"
              onClick={() => onSelectCategory(category.slug)}
              className={`flex items-center gap-3 border-b border-neutral-100 px-4 py-3 text-left text-sm font-medium last:border-b-0 ${
                isActive
                  ? "bg-neutral-100 text-neutral-900"
                  : "text-neutral-700 hover:bg-neutral-50"
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${category.iconBg}`}
              >
                <Icon size={16} />
              </span>
              {category.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

export default BuildSidebar;
export { CATEGORIES };
