import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { usePaymentStatus } from "@/hook/payment/usePaymentStatus";
import CheckoutStepIndicator from "@/components/cart/CheckoutStepLine";
import { clearPendingCheckoutSession } from "@/utils/auth/pendingCheckoutSession";

function formatPaymentStatus(status) {
  if (!status) return null;
  const map = {
    PAID: "ชำระเงินสำเร็จ",
    SUCCEEDED: "ชำระเงินสำเร็จ",
    COMPLETED: "ชำระเงินสำเร็จ",
    PENDING: "รอดำเนินการ",
    FAILED: "ชำระเงินไม่สำเร็จ",
  };
  return map[status] ?? status;
}

function formatAmount(amount) {
  if (amount === null || amount === undefined) return null;
  return `฿${Number(amount).toLocaleString()}`;
}

function CheckoutStep4({ sessionId }) {
  const navigate = useNavigate();
  const paymentStatusQuery = usePaymentStatus(sessionId);

  useEffect(() => {
    if (paymentStatusQuery.data) {
      console.log("[payment-status] data:", paymentStatusQuery.data);
    }
  }, [paymentStatusQuery.data]);

  useEffect(() => {
    if (paymentStatusQuery.isError) {
      console.error("[payment-status] error:", paymentStatusQuery.error);
    }
  }, [paymentStatusQuery.isError, paymentStatusQuery.error]);

  const orderInfo = paymentStatusQuery.data;
  const orders = orderInfo?.orders ?? [];
  const paymentStatus = formatPaymentStatus(orderInfo?.paymentStatus);
  const amount = formatAmount(
    orderInfo?.pricing?.grandTotal ?? orderInfo?.amount,
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <CheckoutStepIndicator currentStep={3} />

      <div className="mx-auto flex min-h-[70vh] w-full max-w-xl flex-col justify-center">
        <div className="hardware-surface flex flex-col items-center gap-4 p-10 text-center">
          <div className="relative flex h-20 w-20 items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-[#f97316]/15 blur-xl" />
            <span className="matte relative flex h-20 w-20 items-center justify-center rounded-full">
              <CheckCircle2 className="h-10 w-10 text-[#f97316]" />
            </span>
          </div>

          <div className="flex flex-col items-center gap-1.5">
            <span className="hardware-label text-[#f97316]">
              ทำรายการสำเร็จ
            </span>
            <h2 className="text-xl font-bold text-neutral-900">
              สั่งซื้อสำเร็จแล้ว
            </h2>
            <p className="max-w-sm text-sm text-neutral-500">
              ขอบคุณสำหรับคำสั่งซื้อ
              เราจะแจ้งความคืบหน้าการจัดส่งให้ทราบทางอีเมลและในหน้าคำสั่งซื้อของคุณ
            </p>
          </div>

          {(orders.length > 0 || paymentStatus || amount || sessionId) && (
            <>
              <div className="hardware-divider w-full" />
              <div className="flex w-full flex-col gap-2 text-sm">
                {orders.map((order, idx) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between gap-3"
                  >
                    <span className="text-neutral-500">
                      เลขคำสั่งซื้อ{orders.length > 1 ? ` #${idx + 1}` : ""}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        clearPendingCheckoutSession();
                        navigate(`/user/orders/${order.id}`, {
                          replace: true,
                        });
                      }}
                      className="truncate font-mono text-xs font-semibold text-[#f97316] hover:underline"
                    >
                      {order.orderNumber}
                    </button>
                  </div>
                ))}
                {paymentStatus && (
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-neutral-500">สถานะการชำระเงิน</span>
                    <span className="font-medium text-green-600">
                      {paymentStatus}
                    </span>
                  </div>
                )}
                {amount && (
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-neutral-500">ยอดชำระ</span>
                    <span className="font-bold text-neutral-900">{amount}</span>
                  </div>
                )}
                {sessionId && (
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-neutral-500">
                      เลขอ้างอิงการชำระเงิน
                    </span>
                    <span className="truncate font-mono text-xs font-medium text-neutral-900">
                      {sessionId}
                    </span>
                  </div>
                )}
              </div>
            </>
          )}

          <button
            type="button"
            onClick={() => {
              clearPendingCheckoutSession();
              navigate("/", { replace: true });
            }}
            className="btn btn-accent mt-2 w-full gap-2 text-white"
          >
            กลับสู่หน้าแรก
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CheckoutStep4;
