import { Loader2, ShieldCheck } from "lucide-react";

// Step 3: หน้าเปลี่ยนผ่านสั้นๆ (transient) ระหว่างรอสร้าง checkout + payment session แล้วเด้งออกไป Stripe Checkout
// ไม่มีปุ่มย้อนกลับตรงนี้ เพราะส่งคำขอสร้างคำสั่งซื้อไปแล้ว ย้อนกลับตอนนี้อาจทำให้มีข้อมูลค้าง (checkout ถูกสร้างไปแล้วที่ backend)
function CheckoutStep3() {
  return (
    <div className="hardware-surface flex flex-col items-center gap-3 p-10 text-center">
      <span className="matte flex h-14 w-14 items-center justify-center rounded-full">
        <Loader2 className="h-7 w-7 animate-spin text-[#f97316]" />
      </span>
      <h2 className="text-lg font-bold text-neutral-900">
        กำลังนำคุณไปสู่หน้าชำระเงิน
      </h2>
      <p className="max-w-sm text-sm text-neutral-500">
        กรุณารอสักครู่ ระบบกำลังพาคุณไปยังหน้าชำระเงินที่ปลอดภัยของ Stripe
      </p>
      <span className="flex items-center gap-1 text-xs text-secondary">
        <ShieldCheck size={14} className="text-green-600" />
        เชื่อมต่อแบบเข้ารหัสปลอดภัย
      </span>
    </div>
  );
}

export default CheckoutStep3;
