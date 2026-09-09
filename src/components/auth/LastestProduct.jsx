import ProductCard from "./ProductCard"; // ปรับ path ให้ตรงกับที่คุณเก็บไฟล์จริง
// ใช้ hook เดียวกับ HomeStore.jsx (useListings) แทนที่จะเดา hook ใหม่ - backend เรียง createdAt
// desc มาให้อยู่แล้ว (คอมเมนต์เดิมใน HomeStore.jsx ก็ยืนยันแบบนี้) เลยไม่ต้อง sort/slice เพิ่มเอง
// แค่โชว์ listings ทั้งหมดตามลำดับที่ backend ส่งมาตรงๆ (หน้านี้คือหน้า "ดูทั้งหมด" ของ Latest Products
// เลยไม่ต้อง .slice(0, 5) เหมือนตอนอยู่ใน section บนหน้า HomeStore)
import { useListings } from "@/hook/listing/useListingForHomePage";

function LatestProduct() {
  const { data: listings = [], isLoading, isError } = useListings();

  return (
    <div>
      <h1 className="mb-4 text-lg font-bold text-neutral-900">
        Latest Products
      </h1>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
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
      ) : listings.length === 0 ? (
        <div className="hardware-surface flex h-40 items-center justify-center">
          <p className="text-sm text-neutral-400">
            No product information available
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
          {listings.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default LatestProduct;
