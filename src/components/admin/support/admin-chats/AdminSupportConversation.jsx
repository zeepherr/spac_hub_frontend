import { AdminOrderPreview } from "@/components/admin/support/AdminOrderContext";
import SupportChatPanel from "@/components/support/SupportChatPanel";

import {
  ConversationError,
  ConversationSkeleton,
  NoSelectedCase,
} from "./AdminChatsStates";
import SupportCaseStatusControl from "./SupportCaseStatusControl";

function AdminSupportConversation({
  selectedSupportCaseId,
  isDetailPending,
  supportCaseDetail,
  isDetailError,
  detailError,
  refetchDetail,
  orderPreview,
  isOrderPending,
  isOrderError,
  adminOrder,
  refetchOrder,
  setIsOrderDetailOpen,
}) {
  return (
    <main
      className={`min-w-0 overflow-hidden xl:min-h-0 ${
        selectedSupportCaseId
          ? "h-[900px] min-h-[900px] sm:h-[760px] sm:min-h-[760px] xl:h-auto xl:min-h-0"
          : "h-[360px] min-h-[360px] xl:h-auto xl:min-h-0"
      }`}
    >
      {!selectedSupportCaseId ? (
        <NoSelectedCase />
      ) : isDetailPending && !supportCaseDetail ? (
        <ConversationSkeleton />
      ) : isDetailError ? (
        <ConversationError error={detailError} onRetry={refetchDetail} />
      ) : supportCaseDetail ? (
        <div className="flex h-full min-h-0 flex-col gap-3">
          <AdminOrderPreview
            order={orderPreview}
            fallbackOrderNumber={
              supportCaseDetail.order?.orderNumber ||
              `Order #${supportCaseDetail.orderId}`
            }
            supportCaseId={supportCaseDetail.id}
            issueType={supportCaseDetail.issueType}
            isPending={isOrderPending}
            isError={isOrderError}
            hasFullDetails={Boolean(adminOrder)}
            onRetry={refetchOrder}
            onViewDetails={() => setIsOrderDetailOpen(true)}
          />

          <SupportCaseStatusControl supportCase={supportCaseDetail} />

          <SupportChatPanel
            key={supportCaseDetail.id}
            supportCase={supportCaseDetail}
            isAdmin
            fillAvailableHeight
            showOrderContext={false}
          />
        </div>
      ) : (
        <NoSelectedCase />
      )}
    </main>
  );
}

export default AdminSupportConversation;
