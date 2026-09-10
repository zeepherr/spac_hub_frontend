// เดียวกับ GLASS_PANEL ที่ใช้ทั้งเว็บ
const GLASS_PANEL =
  "border border-neutral-200/70 bg-white/50 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_8px_24px_rgba(0,0,0,0.06)]";

const ASSEMBLY_SERVICE_FEE = 400; // เหมือนใน CheckoutPage.jsx - ไว้โชว์ราคาในการ์ดนี้เฉยๆ ตัวคำนวณยอดจริงอยู่ที่ parent

function formatPrice(amount) {
  return `฿${amount.toLocaleString()}`;
}

// Step 2: บริการเสริม (escrow ล็อกไว้เสมอ เลือกไม่ได้ + ติ๊กเลือกบริการประกอบเครื่องเพิ่มได้)
// ปุ่มย้อนกลับย้ายไปอยู่ตรงกลางบน StepIndicator แล้ว (ใน CheckoutPage.jsx) ไม่ได้อยู่ในการ์ดนี้อีกต่อไป
function CheckoutStep2({ includeAssembly, onToggleAssembly }) {
  return (
    <div className={`rounded-3xl p-6 ${GLASS_PANEL}`}>
      <div className="mb-5 flex items-center gap-2">
        <h2 className="flex items-center gap-2 text-base font-bold text-neutral-900">
          บริการเสริมและการคุ้มครอง
        </h2>
      </div>

      <div className="flex flex-col gap-3">
        <label className="flex items-start gap-3 rounded-2xl border-2 border-orange-500 bg-orange-50/40 backdrop-blur-sm p-4">
          <input
            type="radio"
            checked
            readOnly
            className="radio radio-sm accent-orange-500 mt-0.5"
          />
          <span className="flex-1">
            <span className="flex items-center justify-between">
              <span className="font-semibold text-neutral-900">
                SpecHub Escrow
              </span>
              <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs normal-case text-green-700">
                รวมอยู่แล้ว
              </span>
            </span>
            <span className="mt-1 block text-sm text-neutral-500">
              เงินของคุณถูกพักไว้อย่างปลอดภัยจนกว่าจะได้รับและตรวจสอบสินค้าเรียบร้อย
              รวมค่าตรวจสอบมาตรฐานแล้ว
            </span>
          </span>
        </label>

        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-neutral-200/70 bg-white/40 backdrop-blur-sm p-4">
          <input
            type="checkbox"
            checked={includeAssembly}
            onChange={onToggleAssembly}
            className="checkbox checkbox-sm accent-orange-500 mt-0.5"
          />
          <span className="flex-1">
            <span className="flex items-center justify-between">
              <span className="font-semibold text-neutral-900">
                บริการประกอบเครื่อง
              </span>
              <span className="font-medium text-neutral-900">
                +{formatPrice(ASSEMBLY_SERVICE_FEE)}
              </span>
            </span>
            <span className="mt-1 block text-sm text-neutral-500">
              ประกอบโดยช่างมืออาชีพ + จัดสายไฟให้เรียบร้อย
            </span>
          </span>
        </label>
      </div>
    </div>
  );
}

export default CheckoutStep2;
