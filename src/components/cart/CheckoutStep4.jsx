import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { usePaymentStatus } from "@/hook/payment/usePaymentStatus";
import CheckoutStepIndicator from "@/components/cart/CheckoutStepLine";
import { clearPendingCheckoutSession } from "@/utils/auth/pendingCheckoutSession";

// เดียวกับ GLASS_PANEL/CTA_GLASS ที่ใช้ทั้งเว็บ
const GLASS_PANEL =
  "border border-neutral-200/70 bg-white/50 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_8px_24px_rgba(0,0,0,0.06)]";
const CTA_GLASS =
  "bg-orange-500 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_4px_12px_rgba(249,115,22,0.3)] hover:bg-orange-600";

function formatPaymentStatus(status) {
  if (!status) return null;
  const map = {
    PAID: "Payment Successful",
    SUCCEEDED: "Payment Successful",
    COMPLETED: "Payment Successful",
    PENDING: "Pending",
    FAILED: "Payment Failed",
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
        <div
          className={`flex flex-col items-center gap-4 rounded-3xl p-10 text-center ${GLASS_PANEL}`}
        >
          <div className="relative flex h-20 w-20 items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-orange-500/15 blur-xl" />
            <span className="relative flex h-20 w-20 items-center justify-center rounded-full border border-neutral-200/70 bg-white/60 backdrop-blur-md">
              <CheckCircle2 className="h-10 w-10 text-orange-500" />
            </span>
          </div>

          <div className="flex flex-col items-center gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wide text-orange-500">
              Transaction Successful
            </span>
            <h2 className="text-xl font-bold text-neutral-900">
              Order Placed Successfully
            </h2>
            <p className="max-w-sm text-sm text-neutral-500">
              Thank you for your order. We’ll keep you updated on the delivery
              status via email and on your order page.
            </p>
          </div>

          {(orders.length > 0 || paymentStatus || amount || sessionId) && (
            <>
              <div className="w-full border-t border-neutral-200/70" />
              <div className="flex w-full flex-col gap-2 text-sm">
                {orders.map((order, idx) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between gap-3"
                  >
                    <span className="text-neutral-500">
                      Order Number{orders.length > 1 ? ` #${idx + 1}` : ""}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        clearPendingCheckoutSession();
                        navigate(`/user/orders/${order.id}`, {
                          replace: true,
                        });
                      }}
                      className="truncate font-mono text-xs font-semibold text-orange-500 hover:underline"
                    >
                      {order.orderNumber}
                    </button>
                  </div>
                ))}
                {paymentStatus && (
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-neutral-500">Payment Status</span>
                    <span className="font-medium text-green-600">
                      {paymentStatus}
                    </span>
                  </div>
                )}
                {amount && (
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-neutral-500">Amount Paid</span>
                    <span className="font-bold text-neutral-900">{amount}</span>
                  </div>
                )}
                {sessionId && (
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-neutral-500">Payment Reference</span>
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
            className={`mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition ${CTA_GLASS}`}
          >
            Back to Home
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CheckoutStep4;
