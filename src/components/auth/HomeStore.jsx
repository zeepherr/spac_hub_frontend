import { getAllCategoriesForUser } from "@/api/category.api";

import { useQuery } from "@tanstack/react-query";
import {
  Boxes,
  Cable,
  ChevronRight,
  CircuitBoard,
  Cpu,
  Fan,
  Gamepad2,
  Headset,
  Heart,
  HardDrive,
  Layers,
  Menu,
  Monitor,
  MemoryStick,
  Network,
  Percent,
  Plug,
  RefreshCw,
  Search,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
  User,
  Wrench,
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

const TRUST_ITEMS = [
  {
    icon: ShieldCheck,
    title: "ของแท้ 100%",
    subtitle: "รับประกันศูนย์ไทยทุกชิ้น",
  },
  { icon: Truck, title: "จัดส่งทั่วประเทศ", subtitle: "รวดเร็วทันใจ" },
  { icon: Wrench, title: "ประกันหลังการขาย", subtitle: "มั่นใจทุกการใช้งาน" },
  { icon: Percent, title: "ผ่อนชำระ 0%", subtitle: "สูงสุด 10 เดือน" },
  { icon: Headset, title: "บริการหลังการขาย", subtitle: "ดูแลตลอดการใช้งาน" },
];

function TopBar() {
  return (
    <div className="mx-auto flex max-w-8xl items-center gap-6 px-4 py-4">
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

      <div className="ml-auto flex shrink-0 items-center gap-6 text-sm font-semibold text-neutral-700">
        <button className="flex items-center gap-1.5 hover:text-[#f97316]">
          <RefreshCw size={18} />
          เปรียบเทียบ
        </button>
        <button className="flex items-center gap-1.5 hover:text-[#f97316]">
          <Heart size={18} />
          รายการโปรด
        </button>
        <button className="flex items-center gap-1.5 hover:text-[#f97316]">
          <span className="relative">
            <ShoppingCart size={18} />
            <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#f97316] text-[10px] text-white">
              0
            </span>
          </span>
          ตะกร้าสินค้า
        </button>
        <Link
          to="/login"
          className="flex items-center gap-1.5 hover:text-[#f97316]"
        >
          <User size={18} />
          เข้าสู่ระบบ / สมัครสมาชิก
        </Link>
      </div>
    </div>
  );
}

function CategorySidebar() {
  const {
    data: categories = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategoriesForUser,
  });

  return (
    <aside className="hardware-surface flex h-fit flex-col">
      <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
        <h2 className="text-base font-bold text-neutral-900">หมวดหมู่สินค้า</h2>
        <Menu size={18} className="text-neutral-400" />
      </div>

      <ul className="flex flex-col">
        {isLoading &&
          Array.from({ length: 6 }).map((_, i) => (
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

function HeroBanner() {
  // TODO: fetch แบนเนอร์จาก backend แล้ว .map() แทน placeholder นี้
  const slides = [];

  return (
    <div className="hardware-surface flex h-72 items-center justify-center overflow-hidden">
      {slides.length === 0 ? (
        <p className="text-sm text-neutral-400">ยังไม่มีข้อมูลแบนเนอร์</p>
      ) : (
        slides.map((slide) => (
          <div key={slide.id}>{/* render banner slide */}</div>
        ))
      )}
    </div>
  );
}

function PromoCards() {
  // TODO: fetch โปรโมชัน/ทางลัดจาก backend แล้ว .map() แทน placeholder นี้
  const cards = [];

  return (
    <div className="flex flex-col gap-4">
      {cards.length === 0 ? (
        <div className="hardware-surface flex h-72 items-center justify-center">
          <p className="text-sm text-neutral-400">ยังไม่มีข้อมูลโปรโมชัน</p>
        </div>
      ) : (
        cards.map((card) => (
          <div key={card.id} className="hardware-surface p-5">
            {/* render promo card */}
          </div>
        ))
      )}
    </div>
  );
}

function TrustBar() {
  return (
    <div className="hardware-surface grid grid-cols-2 divide-x divide-base-300 sm:grid-cols-5">
      {TRUST_ITEMS.map(({ icon: Icon, title, subtitle }) => (
        <div
          key={title}
          className="flex items-center gap-3 px-4 py-5 first:pl-6"
        >
          <Icon
            className="h-8 w-8 shrink-0 text-[#f97316]"
            strokeWidth={1.75}
          />
          <div className="leading-tight">
            <p className="text-sm font-bold text-neutral-900">{title}</p>
            <p className="hardware-label normal-case text-secondary">
              {subtitle}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProductCard({ product }) {
  return (
    <div className="hardware-surface flex flex-col p-4">
      <span className="hardware-label mb-2 w-fit rounded-field bg-neutral-100 px-2 py-1 normal-case text-secondary">
        {product.brand}
      </span>

      <div className="mb-3 flex aspect-square items-center justify-center overflow-hidden rounded-box bg-neutral-50">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.title}
            className="h-full w-full object-contain"
          />
        ) : (
          <Cpu className="h-12 w-12 text-neutral-300" strokeWidth={1} />
        )}
      </div>

      <p className="mb-1 line-clamp-2 text-sm font-semibold text-neutral-900">
        {product.title}
      </p>
      <p className="mb-2 text-lg font-bold text-[#f97316]">
        {product.price?.toLocaleString()}.-
      </p>

      <div className="mt-auto flex items-center justify-between">
        <span className="flex items-center gap-1 text-xs text-neutral-500">
          <Star size={14} className="fill-[#f97316] text-[#f97316]" />
          {product.rating} ({product.reviewCount})
        </span>
        <button
          aria-label="เพิ่มลงตะกร้า"
          className="flex h-8 w-8 items-center justify-center rounded-field bg-[#f97316] text-white hover:bg-orange-600"
        >
          <ShoppingCart size={16} />
        </button>
      </div>
    </div>
  );
}

function ProductSection({ title }) {
  // TODO: fetch สินค้าจริงจาก backend (เช่น useQuery(["listings", ...])) แล้วแทนที่ [] นี้
  const products = [];

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="hardware-label flex items-center gap-2 text-base normal-case text-neutral-900">
          <span className="h-4 w-1 rounded-full bg-[#f97316]" />
          {title}
        </h2>
        <Link
          to="/products"
          className="text-sm font-medium text-[#f97316] hover:text-orange-600"
        >
          ดูสินค้าทั้งหมด &gt;
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="hardware-surface flex h-40 items-center justify-center">
          <p className="text-sm text-neutral-400">ยังไม่มีข้อมูลสินค้า</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

function ArticleSection() {
  // TODO: fetch บทความ/รีวิวจาก backend แล้ว .map() แทน placeholder นี้
  const articles = [];

  return (
    <div className="hardware-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold text-neutral-900">บทความ / รีวิว</h2>
        <Link
          to="/articles"
          className="text-xs font-medium text-[#f97316] hover:text-orange-600"
        >
          ดูทั้งหมด &gt;
        </Link>
      </div>

      {articles.length === 0 ? (
        <p className="py-6 text-center text-sm text-neutral-400">
          ยังไม่มีบทความ
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {articles.map((article) => (
            <li key={article.id} className="flex gap-3">
              {/* render article row */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#ffffff]">
      <header className="sticky top-0 z-40 bg-white shadow-sm"></header>

      <main className="mx-auto max-w-8xl px-4 py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr_320px]">
          <CategorySidebar />

          <div className="flex flex-col gap-6">
            <HeroBanner />
            <TrustBar />
            <ProductSection title="สินค้าแนะนำ" />
            <ProductSection title="สินค้าใหม่ล่าสุด" />
          </div>

          <div className="flex flex-col gap-6">
            <PromoCards />
            <ArticleSection />
          </div>
        </div>
      </main>
    </div>
  );
}
