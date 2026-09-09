import ProductCard from "./ProductCard"; // ปรับ path ให้ตรงกับที่คุณเก็บไฟล์จริง
import { useListings } from "@/hook/listing/useListingForHomePage";
import { useMemo } from "react";

// สลับลำดับสินค้าทั้งหมดแบบสุ่ม (ไม่แก้ array เดิม) - แพทเทิร์นเดียวกับ pickRandomProducts
// ใน HomeStore.jsx แต่ตรงนี้สุ่มสลับทั้งลิสต์แทนการสุ่มหยิบมาแค่บางส่วน เพราะหน้านี้คือ "All Products"
function shuffleProducts(list) {
  return [...list].sort(() => Math.random() - 0.5);
}

function AllProduct() {
  const { data: listings = [], isLoading, isError } = useListings();

  // ใช้ useMemo ผูกกับ listings เพื่อไม่ให้สุ่มสลับใหม่ทุกครั้งที่ re-render
  // (สุ่มใหม่เฉพาะตอนข้อมูล listings เปลี่ยนจริงๆ เช่น fetch เสร็จ/refetch)
  const shuffledListings = useMemo(() => shuffleProducts(listings), [listings]);

  return (
    <div>
      <h1 className="mb-4 text-lg font-bold text-neutral-900">All Products</h1>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="hardware-surface aspect-[3/4] animate-pulse bg-neutral-100"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="hardware-surface flex h-40 items-center justify-center">
          <p className="text-sm text-[#dc2626]">Failed to load products</p>
        </div>
      ) : shuffledListings.length === 0 ? (
        <div className="hardware-surface flex h-40 items-center justify-center">
          <p className="text-sm text-neutral-400">
            No product information available
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {shuffledListings.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default AllProduct;
