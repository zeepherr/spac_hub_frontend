import { AlertCircle, LoaderCircle } from "lucide-react";
import { useMemo, useState } from "react";

import { useMySupportCaseById } from "@/hook/support/useMySupportCaseById";
import { useMySupportCases } from "@/hook/support/useMySupportCases";

import OrderProgress from "./OrderProgress";
import SupportCaseForm from "./SupportCaseForm";
import SupportChatPanel from "./SupportChatPanel";

// เดียวกับ GLASS_PANEL ที่ใช้ทั้งเว็บ
const GLASS_PANEL =
  "border border-neutral-200/70 bg-white/50 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_8px_24px_rgba(0,0,0,0.06)]";

function BuyerOrderSupport({ order }) {
  const [localSupportCase, setLocalSupportCase] = useState(null);

  const [pendingDraft, setPendingDraft] = useState("");

  const {
    data: supportCases = [],
    isPending,
    isError,
    error,
    refetch,
  } = useMySupportCases();

  const existingSupportCase = useMemo(() => {
    return supportCases.find(
      (supportCase) => Number(supportCase.orderId) === Number(order.id),
    );
  }, [supportCases, order.id]);

  const selectedSupportCase = localSupportCase || existingSupportCase;

  const { data: supportCaseDetail } = useMySupportCaseById(
    selectedSupportCase?.id,
  );

  const supportCase = supportCaseDetail || selectedSupportCase;

  function handleCaseCreated(createdCase, creationResult) {
    setLocalSupportCase(createdCase);

    setPendingDraft(creationResult.pendingMessage || "");
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="shrink-0">
        <OrderProgress status={order.status} />
      </div>

      {supportCase ? (
        <SupportChatPanel
          key={supportCase.id}
          supportCase={supportCase}
          isAdmin={false}
          initialDraft={pendingDraft}
          fillAvailableHeight
        />
      ) : isPending ? (
        <SupportLoading />
      ) : isError ? (
        <SupportError
          message={
            error?.response?.data?.message || "Unable to load Support Cases."
          }
          onRetry={refetch}
        />
      ) : (
        <SupportCaseForm
          orderId={order.id}
          role="BUYER"
          onCreated={handleCaseCreated}
        />
      )}
    </div>
  );
}

function SupportLoading() {
  return (
    <div
      className={`flex min-h-64 items-center justify-center gap-3 rounded-2xl ${GLASS_PANEL}`}
    >
      <LoaderCircle size={25} className="animate-spin text-orange-500" />
      <span className="text-sm text-neutral-500">Loading Order Support...</span>
    </div>
  );
}

function SupportError({ message, onRetry }) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-red-100 bg-white/60 backdrop-blur-sm p-6 text-center shadow-sm">
      <span className="flex size-12 items-center justify-center rounded-full bg-red-50 text-red-500">
        <AlertCircle size={23} />
      </span>

      <p className="mt-4 font-semibold text-red-600">
        Unable to load Order Support
      </p>

      <p className="mt-1 text-sm text-neutral-500">{message}</p>

      <button
        type="button"
        onClick={() => onRetry()}
        className="mt-5 cursor-pointer rounded-xl border border-orange-500 px-4 py-2 text-sm font-semibold text-orange-500 transition hover:bg-orange-50"
      >
        Try Again
      </button>
    </div>
  );
}

export default BuyerOrderSupport;
