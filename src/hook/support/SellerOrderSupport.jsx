import { AlertCircle, RefreshCcw } from "lucide-react";
import { useMemo, useState } from "react";

import SupportCaseForm from "@/components/support/SupportCaseForm";
import SupportChatPanel from "@/components/support/SupportChatPanel";

import { useMySupportCaseById } from "@/hook/support/useMySupportCaseById";
import { useMySupportCases } from "@/hook/support/useMySupportCases";

export default function SellerOrderSupport({ order }) {
  const [createdSupportCase, setCreatedSupportCase] = useState(null);
  const [pendingDraft, setPendingDraft] = useState("");

  const {
    data: supportCases = [],
    isLoading: isListLoading,
    isError: isListError,
    refetch: refetchList,
  } = useMySupportCases();

  const listedSupportCase = useMemo(() => {
    if (!order?.id) return null;

    return (
      supportCases.find(
        (supportCase) => String(supportCase.orderId) === String(order.id),
      ) || null
    );
  }, [supportCases, order?.id]);

  const supportCase = createdSupportCase || listedSupportCase || null;

  const supportCaseId = supportCase?.id || null;

  const {
    data: supportCaseDetail,
    isLoading: isDetailLoading,
    isError: isDetailError,
    refetch: refetchDetail,
  } = useMySupportCaseById(supportCaseId);

  const activeSupportCase = supportCaseDetail || supportCase;

  const handleCreated = (newSupportCase, meta) => {
    setCreatedSupportCase(newSupportCase);

    // Backend returns an existing case without saving the submitted
    // create-form message. Preserve it as the chat draft.
    setPendingDraft(meta?.pendingMessage || "");
  };

  if (isListLoading && !activeSupportCase) {
    return (
      <div className="flex min-h-105 items-center justify-center">
        <span className="loading loading-spinner loading-md text-primary" />
      </div>
    );
  }

  if (isListError && !activeSupportCase) {
    return (
      <div className="flex min-h-105] flex-col items-center justify-center gap-3 p-6 text-center">
        <AlertCircle className="h-9 w-9 text-error" />

        <div>
          <p className="font-bold text-base-content">
            Unable to load support information
          </p>
          <p className="mt-1 text-sm text-base-content/60">
            Please check your connection and try again.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetchList()}
          className="btn btn-outline btn-sm rounded-xl"
        >
          <RefreshCcw className="h-4 w-4" />
          Try Again
        </button>
      </div>
    );
  }

  if (!activeSupportCase) {
    return (
      <SupportCaseForm
        orderId={order.id}
        role="SELLER"
        onCreated={handleCreated}
      />
    );
  }

  if (isDetailLoading && !supportCaseDetail) {
    return (
      <div className="flex min-h-105 items-center justify-center">
        <span className="loading loading-spinner loading-md text-primary" />
      </div>
    );
  }

  if (isDetailError && !supportCaseDetail) {
    return (
      <div className="flex min-h-105 flex-col items-center justify-center gap-3 p-6 text-center">
        <AlertCircle className="h-9 w-9 text-error" />

        <p className="font-bold text-base-content">
          Unable to open this conversation
        </p>

        <button
          type="button"
          onClick={() => refetchDetail()}
          className="btn btn-outline btn-sm rounded-xl"
        >
          <RefreshCcw className="h-4 w-4" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <SupportChatPanel
      supportCase={activeSupportCase}
      initialDraft={pendingDraft}
    />
  );
}
