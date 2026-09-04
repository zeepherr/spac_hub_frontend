import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router";

// Step 4: หน้ายืนยัน - อยู่ท้ายสุดของ wizard เลยไม่มีปุ่มย้อนกลับ (ตอนนี้เพิ่งจ่ายเงินผ่าน Stripe เสร็จ
// ย้อนไปแก้ที่อยู่/บริการเสริมไม่ได้แล้ว)
//
// TODO: ตอนนี้ยังเป็นแค่ placeholder เฉยๆ ยังไม่ผูกกับข้อมูลจริงที่ควรได้กลับมาหลัง Stripe redirect กลับเข้าแอป
// ต้องรู้ก่อนว่า success_url ของ Stripe Checkout Session ตั้งไว้เป็น route ไหน แล้วดึง checkoutId/session_id
// จาก query param มา fetch สถานะคำสั่งซื้อจริงมาโชว์แทน placeholder นี้
function CheckoutStep4() {
  const navigate = useNavigate();

  return (
    <div className="hardware-surface flex flex-col items-center gap-3 p-10 text-center">
      <span className="matte flex h-14 w-14 items-center justify-center rounded-full">
        <CheckCircle2 className="h-7 w-7 text-[#f97316]" />
      </span>
      <h2 className="text-lg font-bold text-neutral-900">สั่งซื้อสำเร็จแล้ว</h2>
      <p className="max-w-sm text-sm text-neutral-500">
        ขอบคุณสำหรับคำสั่งซื้อ
        เราจะแจ้งความคืบหน้าการจัดส่งให้ทราบทางอีเมลและในหน้าคำสั่งซื้อของคุณ
      </p>
      <button
        type="button"
        onClick={() => navigate("/")}
        className="btn btn-accent mt-2 text-white"
      >
        กลับสู่หน้าแรก
      </button>
    </div>
  );
}

export default CheckoutStep4;
