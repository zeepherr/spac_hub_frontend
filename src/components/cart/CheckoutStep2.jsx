const ASSEMBLY_SERVICE_FEE = 400; // เหมือนใน CheckoutPage.jsx - ไว้โชว์ราคาในการ์ดนี้เฉยๆ ตัวคำนวณยอดจริงอยู่ที่ parent

function formatPrice(amount) {
  return `฿${amount.toLocaleString()}`;
}

// Step 2: บริการเสริม (escrow ล็อกไว้เสมอ เลือกไม่ได้ + ติ๊กเลือกบริการประกอบเครื่องเพิ่มได้)
// ปุ่มย้อนกลับย้ายไปอยู่ตรงกลางบน StepIndicator แล้ว (ใน CheckoutPage.jsx) ไม่ได้อยู่ในการ์ดนี้อีกต่อไป
function CheckoutStep2({ includeAssembly, onToggleAssembly }) {
  return (
    <div className="hardware-surface p-6">
      <div className="mb-5 flex items-center gap-2">
        <h2 className="flex items-center gap-2 text-base font-bold text-neutral-900">
          บริการเสริมและการคุ้มครอง
        </h2>
      </div>

      <div className="flex flex-col gap-3">
        <label className="hardware-shadow flex items-start gap-3 rounded-box border-2 border-[#f97316] p-4">
          <input
            type="radio"
            checked
            readOnly
            className="radio radio-accent radio-sm mt-0.5"
          />
          <span className="flex-1">
            <span className="flex items-center justify-between">
              <span className="font-semibold text-neutral-900">
                SpecHub Escrow
              </span>
              <span className="hardware-label rounded-field bg-green-50 px-2 py-0.5 normal-case text-green-700">
                รวมอยู่แล้ว
              </span>
            </span>
            <span className="mt-1 block text-sm text-neutral-500">
              เงินของคุณถูกพักไว้อย่างปลอดภัยจนกว่าจะได้รับและตรวจสอบสินค้าเรียบร้อย
              รวมค่าตรวจสอบมาตรฐานแล้ว
            </span>
          </span>
        </label>

        <label className="flex cursor-pointer items-start gap-3 rounded-box border border-neutral-200 p-4">
          <input
            type="checkbox"
            checked={includeAssembly}
            onChange={onToggleAssembly}
            className="checkbox checkbox-sm mt-0.5"
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
