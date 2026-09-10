import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import CheckoutStepIndicator from "@/components/cart/CheckoutStepLine";
import { savePendingCheckoutSession } from "@/utils/auth/pendingCheckoutSession";

// bg หลักมาตรฐานของทั้งเว็บ (เดียวกับที่ตั้งไว้ใน PublicLayout.jsx) - ใช้กับพื้นหลังหลักของหน้าเท่านั้น
const PAGE_BG =
  "bg-[linear-gradient(180deg,rgba(59,130,246,0.12)_0%,transparent_35%),linear-gradient(0deg,rgba(59,130,246,0.12)_0%,transparent_35%),linear-gradient(180deg,#fafafa_0%,#f0f0f0_100%)]";
// เดียวกับ GLASS_PANEL ที่ใช้ทั้งเว็บ
const GLASS_PANEL =
  "border border-neutral-200/70 bg-white/50 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_8px_24px_rgba(0,0,0,0.06)]";

function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const navigate = useNavigate();

  useEffect(() => {
    savePendingCheckoutSession(sessionId);
  }, [sessionId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/checkoutstep3", { state: { sessionId }, replace: true });
    }, 3000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`min-h-full px-4 py-8 ${PAGE_BG}`}>
      <div className="mx-auto max-w-6xl">
        <CheckoutStepIndicator currentStep={3} />

        <div className="mx-auto flex min-h-[70vh] w-full max-w-xl flex-col justify-center">
          <div
            className={`flex flex-col items-center gap-4 rounded-2xl p-10 text-center ${GLASS_PANEL}`}
          >
            <div className="relative flex h-20 w-20 items-center justify-center">
              <span className="absolute inset-0 rounded-full bg-[#f97316]/15 blur-xl" />
              <span className="relative flex h-20 w-20 items-center justify-center rounded-full border border-neutral-200/70 bg-white/60 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_2px_8px_rgba(0,0,0,0.06)]">
                <Loader2 className="h-9 w-9 animate-spin text-[#f97316]" />
              </span>
            </div>

            <div className="flex flex-col items-center gap-1.5">
              <span className="text-sm font-semibold uppercase tracking-wider text-[#f97316]">
                Processing
              </span>
              <h2 className="text-xl font-bold text-neutral-900">
                Confirming Your Order
              </h2>
              <p className="max-w-sm text-sm text-neutral-500">
                Payment successful. Redirecting you to the confirmation page.
              </p>
            </div>

            {sessionId && (
              <>
                <div className="w-full border-t border-neutral-200/70" />
                <div className="flex w-full items-center justify-between gap-3 text-sm">
                  <span className="text-neutral-500">Payment Reference</span>
                  <span className="truncate font-mono text-xs font-medium text-neutral-900">
                    {sessionId}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccessPage;
