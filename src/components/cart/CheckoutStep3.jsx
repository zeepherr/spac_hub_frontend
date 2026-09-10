import { Loader2, ShieldCheck } from "lucide-react";

// เดียวกับ GLASS_PANEL ที่ใช้ทั้งเว็บ
const GLASS_PANEL =
  "border border-neutral-200/70 bg-white/50 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_8px_24px_rgba(0,0,0,0.06)]";

// Step 3: หน้าเปลี่ยนผ่านสั้นๆ (transient) ระหว่างรอสร้าง checkout + payment session แล้วเด้งออกไป Stripe Checkout
// ไม่มีปุ่มย้อนกลับตรงนี้ เพราะส่งคำขอสร้างคำสั่งซื้อไปแล้ว ย้อนกลับตอนนี้อาจทำให้มีข้อมูลค้าง (checkout ถูกสร้างไปแล้วที่ backend)
function CheckoutStep3() {
  return (
    <div
      className={`flex flex-col items-center gap-3 rounded-3xl p-10 text-center ${GLASS_PANEL}`}
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full border border-neutral-200/70 bg-white/60 backdrop-blur-md">
        <Loader2 className="h-7 w-7 animate-spin text-orange-500" />
      </span>
      <h2 className="text-lg font-bold text-neutral-900">
        กำลังนำคุณไปสู่หน้าชำระเงิน
      </h2>
      <p className="max-w-sm text-sm text-neutral-500">
        กรุณารอสักครู่ ระบบกำลังพาคุณไปยังหน้าชำระเงินที่ปลอดภัยของ Stripe
      </p>
      <span className="flex items-center gap-1 text-xs text-neutral-500">
        <ShieldCheck size={14} className="text-green-600" />
        เชื่อมต่อแบบเข้ารหัสปลอดภัย
      </span>
    </div>
  );
}

export default CheckoutStep3;
