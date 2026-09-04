import CheckoutStepIndicator from "@/components/cart/CheckoutStepLine";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";

function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/checkoutstep3", { state: { sessionId }, replace: true });
    }, 3000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto flex min-h-[75vh] max-w-6xl flex-col justify-center px-4 py-8">
      <CheckoutStepIndicator currentStep={3} />

      <div className="mx-auto w-full max-w-xl">
        {/* ขนาดการ์ด/ไอคอน/โครงสร้างตรงนี้ต้องเท่ากับของ CheckoutStep4.jsx เป๊ะ (หน้าถัดไปที่จะ navigate ไป) -
            hardware-surface p-10, ไอคอนวงกลม h-20 w-20 มีวงแสงสีส้มเรืองข้างหลัง, ป้าย eyebrow, เส้นคั่น +
            แถวเลขอ้างอิง ไม่งั้นพอ navigate ไป /checkoutstep3 การ์ดจะเปลี่ยนหน้าตาโดด */}
        <div className="hardware-surface flex flex-col items-center gap-4 p-10 text-center">
          <div className="relative flex h-20 w-20 items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-[#f97316]/15 blur-xl" />
            <span className="matte relative flex h-20 w-20 items-center justify-center rounded-full">
              <Loader2 className="h-9 w-9 animate-spin text-[#f97316]" />
            </span>
          </div>

          <div className="flex flex-col items-center gap-1.5">
            <span className="hardware-label text-[#f97316]">
              กำลังดำเนินการ
            </span>
            <h2 className="text-xl font-bold text-neutral-900">
              กำลังยืนยันคำสั่งซื้อ
            </h2>
            <p className="max-w-sm text-sm text-neutral-500">
              จ่ายสำเร็จแล้ว กำลังนำคุณไปยังหน้ายืนยันคำสั่งซื้อ
            </p>
          </div>

          {sessionId && (
            <>
              <div className="hardware-divider w-full" />
              <div className="flex w-full items-center justify-between gap-3 text-sm">
                <span className="text-neutral-500">เลขอ้างอิงการชำระเงิน</span>
                <span className="truncate font-mono text-xs font-medium text-neutral-900">
                  {sessionId}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccessPage;
