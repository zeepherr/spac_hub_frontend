import { AlertTriangle, ArrowLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useCreateCheckout } from "@/hook/checkout/useCreateCheckout"; // ปรับ path ให้ตรงกับที่คุณเก็บไฟล์จริง
import { useCreatePaymentCheckout } from "@/hook/payment/useCreatePaymentCheckout"; // ปรับ path ให้ตรงกับที่คุณเก็บไฟล์จริง
import CheckoutStep3 from "@/components/cart/CheckoutStep3";
import CheckoutStepIndicator from "@/components/cart/CheckoutStepLine";

// เดิมไฟล์นี้ชื่อ CheckoutStep3Page.jsx อยู่ที่ path "/checkoutstep3" - เปลี่ยนชื่อไฟล์/route เป็น
// CheckoutStep2Page.jsx / "/checkoutstep2" แทน เพราะเลข step ชนกับ CheckoutStepIndicator (หน้านี้โชว์
// currentStep={2} "ชำระเงิน" ไม่ใช่ step 3 "ยืนยัน") แล้ว "/checkoutstep3" เอาไปให้หน้าการ์ด "สั่งซื้อสำเร็จแล้ว"
// (CheckoutStep3Page.jsx ตัวใหม่ - คนละไฟล์กับไฟล์นี้) แทน ให้เลข route ตรงกับ indicator step ที่เห็นจริงๆ
// ตอนนั้น - flow เต็มๆ ตอนนี้คือ /checkoutstep1 -> /checkoutstep2 (ไฟล์นี้) -> Stripe -> /payment/success
// (loading สั้นๆ) -> /checkoutstep3 (การ์ดสำเร็จ)
//
// หน้านี้เป็นคนยิง POST /api/checkouts แล้วตามด้วย POST /api/payments/checkout เอง โดยใช้
// items/includeAssembly/shippingAddress ที่ CheckoutStep1Page.jsx ส่งมาทาง location.state
//
// ถ้าเข้าหน้านี้ตรงๆ โดยไม่มี state ครบ (พิมพ์ URL เอง / refresh แล้ว state หาย) ก็ยิง mutation ต่อไม่ได้
// (ไม่มี shippingAddress) เลยเด้งกลับไป /checkoutstep1 (ถ้ามี items อยู่) หรือ /cart (ถ้าไม่มี items เลย)
//
// useRef guard (hasStartedRef) กันไม่ให้ useEffect ยิง mutation ซ้ำสองรอบตอน React StrictMode (dev mode)
// เรียก effect ซ้ำ - ถ้าไม่กันไว้จะได้ POST /api/checkouts ซ้ำ 2 ครั้งจากคลิกเดียว
function CheckoutStep2Page() {
  const location = useLocation();
  const navigate = useNavigate();
  const createCheckoutMutation = useCreateCheckout();
  const createPaymentMutation = useCreatePaymentCheckout();
  const [hasFailed, setHasFailed] = useState(false);
  const hasStartedRef = useRef(false);

  const items = location.state?.items ?? [];
  const includeAssembly = location.state?.includeAssembly ?? false;
  const shippingAddress = location.state?.shippingAddress ?? null;

  useEffect(() => {
    if (items.length === 0) {
      navigate("/cart");
      return;
    }
    if (!shippingAddress) {
      navigate("/checkoutstep1", { state: { items, includeAssembly } });
      return;
    }

    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    // POST /api/checkouts ต้องการ body { listingIds: [...], shippingAddress: { recipientName, phone, address } }
    // useCreateCheckout mutationFn ชี้ตรงไปที่ createCheckout (ไม่ได้ห่อ payload ให้ในตัว hook) เลยห่อ object เอง
    // TODO: includeAssembly ยังไม่ได้ส่งไปกับ createCheckoutMutation เพราะยังไม่รู้ว่า endpoint นี้รับ field นี้ไหม
    //
    // POST /api/payments/checkout - ตาม spec ที่ได้มา useCreatePaymentCheckout เอง "redirects the browser to
    // data.data.checkoutUrl in its onSuccess handler" อยู่แล้ว เลยไม่ต้องเช็ค/ยิง window.location.href เองซ้ำ
    // useCreateCheckout มี onError/toast ในตัวเองแล้ว (เหมือน useUpdateUserProfile) เลยไม่ต้อง toast ซ้ำในนี้
    // TODO: ยังไม่เห็นว่า useCreatePaymentCheckout มี onError ในตัวรึเปล่า ถ้ายังไม่มี error ตอนสร้าง payment
    // จะโดนจับที่ catch ด้านล่างเฉยๆ (โชว์การ์ด error ในหน้านี้แทน แต่ไม่มี toast ของตัวเอง)
    const run = async () => {
      try {
        const listingIds = items.map((item) => item.listingId);
        const checkout = await createCheckoutMutation.mutateAsync({
          listingIds,
          shippingAddress,
        });
        const checkoutId = checkout.data.id;

        // ไม่ต้องอ่านค่า return มาทำอะไรต่อ เพราะ hook นี้ redirect ให้เองแล้วตอน onSuccess
        await createPaymentMutation.mutateAsync(checkoutId);
      } catch (error) {
        console.error("checkout failed:", error);
        setHasFailed(true);
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (items.length === 0 || !shippingAddress) return null;

  return (
    <div className="mx-auto flex min-h-[75vh] max-w-6xl flex-col justify-center px-4 py-8">
      <CheckoutStepIndicator currentStep={2} />

      <div className="mx-auto w-full max-w-xl">
        {hasFailed ? (
          // สร้าง checkout/payment ไม่สำเร็จ - ให้ย้อนกลับไปหน้า /checkoutstep1 ได้ (ส่ง items/includeAssembly
          // กลับไปด้วยกันต้องเลือกสินค้าใหม่ ฟอร์มที่อยู่จะ prefill จากโปรไฟล์ให้เหมือนเดิม)
          <div className="hardware-surface flex flex-col items-center gap-3 p-10 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <AlertTriangle className="h-7 w-7 text-red-500" />
            </span>
            <h2 className="text-lg font-bold text-neutral-900">
              ดำเนินการชำระเงินไม่สำเร็จ
            </h2>
            <p className="max-w-sm text-sm text-neutral-500">
              เกิดข้อผิดพลาดระหว่างสร้างคำสั่งซื้อ กรุณาลองใหม่อีกครั้ง
            </p>
            <button
              type="button"
              onClick={() =>
                navigate("/checkoutstep1", {
                  state: { items, includeAssembly },
                })
              }
              className="btn btn-accent mt-2 gap-2 text-white"
            >
              <ArrowLeft size={16} />
              ย้อนกลับไปแก้ไขที่อยู่จัดส่ง
            </button>
          </div>
        ) : (
          <CheckoutStep3 />
        )}
      </div>
    </div>
  );
}

export default CheckoutStep2Page;
