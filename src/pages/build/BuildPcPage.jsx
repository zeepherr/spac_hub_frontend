import { ChevronRight, Search, SlidersHorizontal, Trophy } from "lucide-react";
import { Link, useSearchParams } from "react-router";
import BuildSidebar, { CATEGORIES } from "@/components/build/BuildSidebar";
import PartPickerCard from "@/components/build/PartPickerCard";

// UI ล้วนๆ ก่อนตามที่ตกลงกัน - mock ข้อมูลสินค้า/หมวดหมู่ทั้งหมด ยังไม่ต่อ useListingsByCategory หรือ store การจัด
// สเปคจริง (รอโค้ด store/hook ที่มีอยู่แล้วจากคุณก่อน) โครง route: หน้าเดียว เปลี่ยนหมวดหมู่ด้วย query param
// ?category=vga (ตามที่เลือกไว้) - คลิกเมนูซ้ายแค่เปลี่ยน query param ไม่ reload ทั้งหน้า
const MOCK_PRODUCTS = [
  {
    id: 1,
    brand: "Asus",
    title:
      "ASUS TUF GAMING GEFORCE RTX 5070 TI 16GB GDDR7 OC EDITION (TUF-RTX5070TI-O16G-GAMING)",
    price: 44900,
    imageUrl: null,
  },
  {
    id: 2,
    brand: "Asus",
    title:
      "ASUS PRIME GEFORCE RTX 5070 TI 16GB GDDR7 OC EDITION (PRIME-RTX5070TI-O16G)",
    price: 42900,
    imageUrl: null,
  },
  {
    id: 3,
    brand: "Asus",
    title:
      "ASUS TUF GAMING GEFORCE RTX 5080 16GB GDDR7 OC EDITION (TUF-RTX5080-O16G-GAMING)",
    price: 55900,
    imageUrl: null,
  },
  {
    id: 4,
    brand: "Galax",
    title: "GALAX GEFORCE RTX 5080 1-CLICK OC - 16GB GDDR7",
    price: 52900,
    imageUrl: null,
  },
  {
    id: 5,
    brand: "Gigabyte",
    title: "GIGABYTE GEFORCE RTX 5070 TI GAMING OC 16G - 16GB GDDR7",
    price: 43900,
    imageUrl: null,
  },
  {
    id: 6,
    brand: "Asus",
    title: "ASUS ROG ASTRAL GEFORCE RTX 5080 16GB GDDR7 OC EDITION",
    price: 68900,
    imageUrl: null,
  },
  {
    id: 7,
    brand: "Gigabyte",
    title:
      "GIGABYTE GEFORCE RTX 5080 AERO OC SFF 16G - 16GB GDDR7 (GV-N5080AERO OC-16GD)",
    price: 56900,
    imageUrl: null,
  },
  {
    id: 8,
    brand: "Gigabyte",
    title:
      "GIGABYTE GEFORCE RTX 5080 GAMING OC 16G - 16GB GDDR7 (GV-N5080GAMING OC-16GD)",
    price: 57900,
    imageUrl: null,
  },
];

export default function BuildPcPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategorySlug = searchParams.get("category") ?? "vga";
  const activeCategory = CATEGORIES.find((c) => c.slug === activeCategorySlug);

  const handleSelectCategory = (slug) => {
    setSearchParams({ category: slug });
  };

  // TODO: ยังไม่ผูก "จัดชุดสเปค" จริง (เพิ่มเข้ารายการที่เลือกไว้ฝั่งซ้าย) รอ store/hook เดิมของคุณ
  const handleAddToBuild = (product) => {
    console.log("[build] add to build:", product);
  };

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6">
      <div className="mb-4 flex items-center gap-1.5 text-xs text-neutral-400">
        <Link to="/" className="hover:text-[#f97316]">
          หน้าแรก
        </Link>
        <ChevronRight size={12} />
        <span className="font-medium text-neutral-700">จัดสเปค</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <BuildSidebar
          activeCategory={activeCategorySlug}
          onSelectCategory={handleSelectCategory}
        />

        <div className="flex flex-col gap-4">
          <div className="hardware-surface flex flex-col gap-3 p-4">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="btn btn-accent gap-2 text-sm text-white"
              >
                <Trophy size={16} />
                จัดอันดับสเปคคอม
              </button>

              <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-field border border-neutral-200 px-3 py-2">
                <Search size={16} className="text-neutral-400" />
                <input
                  type="text"
                  placeholder={`ค้นหา ${activeCategory?.label ?? ""}`}
                  className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
                />
              </div>
              <button
                type="button"
                className="rounded-field border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:border-[#f97316] hover:text-[#f97316]"
              >
                ค้นหา
              </button>

              <div className="ml-auto flex items-center gap-3">
                <button
                  type="button"
                  className="flex items-center gap-1.5 text-sm font-medium text-neutral-600 hover:text-[#f97316]"
                >
                  <SlidersHorizontal size={16} />
                  filter
                </button>
                <select className="select select-bordered select-sm">
                  <option>จัดเรียงโดย</option>
                  <option>ราคาต่ำ-สูง</option>
                  <option>ราคาสูง-ต่ำ</option>
                  <option>ใหม่ล่าสุด</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-neutral-700">
                  Brand
                </label>
                <select className="select select-bordered select-sm w-full">
                  <option>กรุณาเลือก</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-neutral-700">
                  Series
                </label>
                <select className="select select-bordered select-sm w-full">
                  <option>กรุณาเลือก</option>
                </select>
              </div>
            </div>
          </div>

          <p className="text-xs text-neutral-400">
            ทั้งหมด '{activeCategory?.label ?? ""}' : {MOCK_PRODUCTS.length}{" "}
            รายการ | จำนวน 1 / 3 หน้า | หน้าละ 80 รายการ
          </p>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
            {MOCK_PRODUCTS.map((product) => (
              <PartPickerCard
                key={product.id}
                product={product}
                onAddToBuild={handleAddToBuild}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
