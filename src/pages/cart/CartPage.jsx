import { ArrowLeft, ArrowRight, Info, Lock, Plus } from "lucide-react";
import { Link } from "react-router";
import ProductCartCard from "./ProductCartCard"; // ปรับ path ให้ตรงกับที่คุณเก็บไฟล์จริง

// TODO: ดึงข้อมูลตะกร้าจริงจาก backend (context/store/API) มาแทน
// รอ endpoint จริงอยู่ ตอนนี้ปล่อยว่างไว้ก่อนตามโครงสร้างที่จะใช้จริง
const CART_ITEMS = [];

// ค่าธรรมเนียมคงที่ต่อออเดอร์ - ปรับให้ตรงกับจริงทีหลัง (อาจต้องดึงจาก backend เหมือนกัน)
const INSPECTION_FEE = 500;
const ASSEMBLY_SERVICE_FEE = 1500;
const SHIPPING_FEE = 350;

function formatPrice(amount) {
  return `฿${amount.toLocaleString()}`;
}

// คำนวณสรุปคำสั่งซื้อจาก items ตรงๆ - ตอนนี้ items ว่าง เลยได้ 0 ทุกช่อง
// พอมี item จริงจาก backend เข้ามาใน CART_ITEMS ตัวเลขจะบวกเพิ่มให้เองอัตโนมัติ
function calculateSummary(items) {
  const itemCount = items.length;
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const inspectionFee = itemCount > 0 ? INSPECTION_FEE : 0;
  const shipping = itemCount > 0 ? SHIPPING_FEE : 0;
  const total = subtotal + inspectionFee + shipping;

  return {
    itemCount,
    subtotal,
    inspectionFee,
    assemblyServiceFee: ASSEMBLY_SERVICE_FEE,
    shipping,
    total,
  };
}

function OrderSummary({ summary }) {
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
          <input type="checkbox" className="checkbox checkbox-sm mt-0.5" />
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

      <button type="button" className="btn btn-accent w-full gap-2 text-white">
        ดำเนินการชำระเงิน
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
  const items = CART_ITEMS;
  const summary = calculateSummary(items);

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
          {items.length === 0 ? (
            <div className="hardware-surface flex h-40 items-center justify-center">
              <p className="text-sm text-neutral-400">ยังไม่มีสินค้าในตะกร้า</p>
            </div>
          ) : (
            <div className="hardware-surface flex flex-col gap-4 p-4">
              {items.map((item) => (
                <ProductCartCard key={item.id} item={item} />
              ))}
            </div>
          )}

          {/* <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-box border border-dashed border-neutral-200 py-5 text-sm font-medium text-neutral-500 hover:border-[#f97316] hover:text-[#f97316]"
          >
            <Plus size={18} />
            เพิ่มสินค้าจากตลาด
          </button> */}
        </div>

        <div>
          <OrderSummary summary={summary} />
        </div>
      </div>
    </div>
  );
}
