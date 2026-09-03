import useAuthStore from "@/stores/auth.store"; // ปรับ path ให้ตรงกับที่คุณเก็บไฟล์จริง
import { useMyCart } from "@/hook/cart/useMyCart"; // ปรับ path ให้ตรงกับที่คุณเก็บไฟล์จริง
import { ArrowLeft, ArrowRight, Info, Lock, Plus } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import ProductCartCard from "@/components/cart/ProductCartjCard";

// ค่าธรรมเนียมคงที่ต่อออเดอร์ - ปรับให้ตรงกับจริงทีหลัง (อาจต้องดึงจาก backend เหมือนกัน)
const INSPECTION_FEE_PER_ITEM = 50; // คิดชิ้นละ 50
const INSPECTION_FEE_CAP = 250; // แต่ถ้ารวมแล้วเกิน 250 (คือตั้งแต่ 5 ชิ้นขึ้นไป) คิดแค่ 250 อย่างเดียว
const ASSEMBLY_SERVICE_FEE = 400;
const SHIPPING_FEE = 150;

function formatPrice(amount) {
  return `฿${amount.toLocaleString()}`;
}

// คำนวณสรุปคำสั่งซื้อจาก items จริงที่ได้จาก useMyCart()
// ราคาจริงอยู่ที่ item.listing.price (เป็น string ต้อง Number() ก่อน) ไม่มี qty เลยนับเป็น 1 ต่อชิ้น
// includeAssembly = true เมื่อผู้ใช้ติ๊กเลือกบริการประกอบเครื่อง ถึงจะบวกเข้า total
function calculateSummary(items, includeAssembly) {
  const itemCount = items.length;
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.listing.price),
    0,
  );
  const inspectionFee =
    itemCount > 0
      ? Math.min(itemCount * INSPECTION_FEE_PER_ITEM, INSPECTION_FEE_CAP)
      : 0;
  const shipping = itemCount > 0 ? SHIPPING_FEE : 0;
  const assemblyServiceFee = ASSEMBLY_SERVICE_FEE;
  const total =
    subtotal +
    inspectionFee +
    shipping +
    (includeAssembly ? assemblyServiceFee : 0);

  return {
    itemCount,
    subtotal,
    inspectionFee,
    assemblyServiceFee,
    includeAssembly,
    shipping,
    total,
  };
}

function OrderSummary({
  summary,
  onToggleAssembly,
  onCheckout,
  checkoutDisabled,
}) {
  return (
    <div className="hardware-surface p-5">
      <h2 className="mb-4 text-base font-bold text-neutral-900">
        สรุปคำสั่งซื้อ
      </h2>

      <div className="flex flex-col gap-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-neutral-500">
            ยอดรวมสินค้า ({summary.itemCount} ชิ้น)
          </span>
          <span className="font-medium text-neutral-900">
            {formatPrice(summary.subtotal)}
          </span>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-neutral-500">
              ค่าตรวจสอบสินค้า
              <Info size={12} className="text-neutral-300" />
            </span>
            <span className="font-medium text-neutral-900">
              {formatPrice(summary.inspectionFee)}
            </span>
          </div>
          <p className="hardware-label normal-case text-secondary">
            ตรวจสภาพฮาร์ดแวร์โดยทีมงาน
          </p>
        </div>

        <label className="hardware-surface flex cursor-pointer items-start gap-3 !p-3">
          <input
            type="checkbox"
            checked={summary.includeAssembly}
            onChange={onToggleAssembly}
            className="checkbox checkbox-sm mt-0.5"
          />
          <span className="flex-1">
            <span className="flex items-center justify-between">
              <span className="font-semibold text-neutral-900">
                บริการประกอบเครื่อง
              </span>
              <span className="font-medium text-neutral-900">
                +{formatPrice(summary.assemblyServiceFee)}
              </span>
            </span>
            <span className="hardware-label block normal-case text-secondary">
              ประกอบโดยช่างมืออาชีพ + จัดสายไฟให้เรียบร้อย
            </span>
          </span>
        </label>

        <div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-500">ค่าจัดส่ง</span>
            <span className="font-medium text-neutral-900">
              {formatPrice(summary.shipping)}
            </span>
          </div>
          <p className="hardware-label normal-case text-secondary">
            ผู้ขาย → ศูนย์ตรวจสอบ → คุณ
          </p>
        </div>
      </div>

      <div className="hardware-divider my-4" />

      <div className="mb-4 flex items-end justify-between">
        <span className="text-base font-bold text-neutral-900">รวมทั้งหมด</span>
        <span className="text-right">
          <span className="block text-2xl font-bold text-neutral-900">
            {formatPrice(summary.total)}
          </span>
          <span className="hardware-label normal-case text-secondary">
            รวม VAT แล้ว
          </span>
        </span>
      </div>

      <button
        type="button"
        onClick={onCheckout}
        disabled={checkoutDisabled}
        className="btn btn-accent w-full gap-2 text-white disabled:opacity-50"
      >
        ดำเนินการชำระเงิน{summary.itemCount > 0 && ` (${summary.itemCount})`}
        <ArrowRight size={18} />
      </button>

      <p className="mt-3 flex items-center justify-center gap-1 text-xs text-neutral-400">
        <Lock size={12} />
        เข้ารหัสข้อมูลตลอดเส้นทาง
      </p>
    </div>
  );
}

export default function CartPage() {
  const user = useAuthStore((store) => store.user);
  const navigate = useNavigate();

  const { data: fetchedItems = [], isLoading, isError } = useMyCart();
  // ไม่ login = ไม่มีตะกร้าให้ดึงอยู่แล้ว โชว์เป็น empty state เฉยๆ ไม่ใช่ error
  // (useMyCart ยังยิง request อยู่เบื้องหลังแม้เป็น guest เพราะ hook ไม่มี option "enabled"
  //  ให้ปิดได้ - ถ้าอยากเลี่ยง request ที่ไม่จำเป็นนี้ ต้องไปเพิ่ม enabled: !!user ในตัว useMyCart.js เอง)
  const items = user ? fetchedItems : [];
  const isLoadingCart = user ? isLoading : false;
  const isErrorCart = user ? isError : false;

  const [includeAssembly, setIncludeAssembly] = useState(false);

  // เก็บเป็น "id ที่ถูกเอาออกจากตัวเลือก" แทนที่จะเก็บ "id ที่ถูกเลือก"
  // ข้อดีคือของใหม่ที่เพิ่งเพิ่มเข้าตะกร้าจะถูกเลือกไว้ให้อัตโนมัติโดยไม่ต้อง sync state ทุกครั้งที่ items เปลี่ยน
  const [deselectedIds, setDeselectedIds] = useState(() => new Set());

  const isSelected = (id) => !deselectedIds.has(id);

  const toggleSelect = (id) => {
    setDeselectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const allSelected =
    items.length > 0 && items.every((item) => isSelected(item.id));

  const toggleSelectAll = () => {
    setDeselectedIds(
      allSelected ? new Set(items.map((item) => item.id)) : new Set(),
    );
  };

  const selectedItems = items.filter((item) => isSelected(item.id));
  const summary = calculateSummary(selectedItems, includeAssembly);

  const handleCheckout = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    // TODO: ต่อ flow ชำระเงินจริง (ไปหน้า checkout / เรียก API สร้าง order)
  };

  // ยังไม่ login ปุ่มก็ยังกดได้เสมอ (เพื่อพาไปหน้า login) ส่วน login แล้วค่อย disable ตอนไม่ได้เลือกอะไรเลย
  const checkoutDisabled = user ? summary.itemCount === 0 : false;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-start justify-between border-b border-neutral-100 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">ตะกร้าสินค้า</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {items.length} รายการ รอการตรวจสอบ
          </p>
        </div>
        <Link
          to="/products"
          className="hardware-label flex items-center gap-1 normal-case text-secondary hover:text-[#f97316]"
        >
          <ArrowLeft size={14} />
          เลือกซื้อสินค้าต่อ
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-4">
          {isLoadingCart ? (
            <div className="hardware-surface h-40 animate-pulse bg-neutral-100" />
          ) : isErrorCart ? (
            <div className="hardware-surface flex h-40 items-center justify-center">
              <p className="text-sm text-[#dc2626]">
                โหลดตะกร้าสินค้าไม่สำเร็จ
              </p>
            </div>
          ) : items.length === 0 ? (
            <div className="hardware-surface flex h-40 items-center justify-center">
              <p className="text-sm text-neutral-400">ยังไม่มีสินค้าในตะกร้า</p>
            </div>
          ) : (
            <div className="hardware-surface flex flex-col gap-4 p-4">
              <label className="flex items-center gap-2 border-b border-neutral-100 pb-3 text-sm font-medium text-neutral-700">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                  className="checkbox checkbox-sm"
                />
                เลือกทั้งหมด ({selectedItems.length}/{items.length})
              </label>

              {items.map((item) => (
                <ProductCartCard
                  key={item.id}
                  item={item}
                  selected={isSelected(item.id)}
                  onToggleSelect={() => toggleSelect(item.id)}
                />
              ))}
            </div>
          )}

          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-box border border-dashed border-neutral-200 py-5 text-sm font-medium text-neutral-500 hover:border-[#f97316] hover:text-[#f97316]"
          >
            <Plus size={18} />
            เพิ่มสินค้าจากตลาด
          </button>
        </div>

        <div>
          <OrderSummary
            summary={summary}
            onToggleAssembly={() => setIncludeAssembly((prev) => !prev)}
            onCheckout={handleCheckout}
            checkoutDisabled={checkoutDisabled}
          />
        </div>
      </div>
    </div>
  );
}
