import { AdminOrderDetailsModal } from "@/components/admin/support/AdminOrderContext";
import AdminChatsHeader from "@/components/admin/support/admin-chats/AdminChatsHeader";
import AdminSupportCaseQueue from "@/components/admin/support/admin-chats/AdminSupportCaseQueue";
import AdminSupportConversation from "@/components/admin/support/admin-chats/AdminSupportConversation";
import { hasUnreadSupportMessage } from "@/components/support/support.constants";
import { useAdminOrderById } from "@/hook/order/useAdminOrderById";
import { useAdminSupportCaseById } from "@/hook/support/useAdminSupportCaseById";
import { useAdminSupportCases } from "@/hook/support/useAdminSupportCases";
import useAuthStore from "@/stores/auth.store";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";

function AdminChats() {
  const [searchParams, setSearchParams] = useSearchParams();

  const caseFromUrl = searchParams.get("case");

  const currentUser = useAuthStore((state) => state.user);
  const [selectedSupportCaseId, setSelectedSupportCaseId] = useState(
    caseFromUrl,
    null,
  );
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const {
    data: supportCases = [],
    isPending: isCasesPending,
    isError: isCasesError,
    refetch: refetchCases,
  } = useAdminSupportCases();

  const unreadCount = useMemo(() => {
    return supportCases.filter((supportCase) =>
      hasUnreadSupportMessage(supportCase, currentUser?.id),
    ).length;
  }, [supportCases, currentUser?.id]);

  const filteredSupportCases = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    return supportCases
      .filter((supportCase) => {
        if (statusFilter === "ALL") {
          return true;
        }
        return supportCase.status === statusFilter;
      })
      .filter((supportCase) => {
        if (!normalizedSearch) {
          return true;
        }

        const participantName = [
          supportCase.participantUser?.firstName,
          supportCase.participantUser?.lastName,
        ]
          .filter(Boolean)
          .join(" ");

        const searchableText = [
          supportCase.id,
          supportCase.orderId,
          supportCase.order?.orderNumber,
          supportCase.order?.listing?.title,
          supportCase.issueType,
          supportCase.status,
          participantName,
          supportCase.participantRole,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(normalizedSearch);
      })
      .sort((firstCase, secondCase) => {
        const firstUnread = hasUnreadSupportMessage(firstCase, currentUser?.id);
        const secondUnread = hasUnreadSupportMessage(
          secondCase,
          currentUser?.id,
        );

        // Unread cases appear first.
        if (firstUnread !== secondUnread) {
          return firstUnread ? -1 : 1;
        }

        return (
          new Date(secondCase.updatedAt).getTime() -
          new Date(firstCase.updatedAt).getTime()
        );
      });
  }, [supportCases, statusFilter, searchText, currentUser?.id]);
  useEffect(() => {
    const nextCaseId = searchParams.get("case");

    if (nextCaseId) {
      setSelectedSupportCaseId(nextCaseId);
    }
  }, [searchParams]);
  /* Close the active conversation if filtering removes it from the queue. */
  useEffect(() => {
    if (!selectedSupportCaseId) {
      return;
    }

    const selectedCaseStillVisible = filteredSupportCases.some(
      (supportCase) => Number(supportCase.id) === Number(selectedSupportCaseId),
    );

    if (!selectedCaseStillVisible) {
      setSelectedSupportCaseId(null);
      setIsOrderDetailOpen(false);
    }
  }, [filteredSupportCases, selectedSupportCaseId]);

  const {
    data: supportCaseDetail,
    isPending: isDetailPending,
    isError: isDetailError,
    error: detailError,
    refetch: refetchDetail,
  } = useAdminSupportCaseById(selectedSupportCaseId);

  const {
    data: adminOrder,
    isPending: isOrderPending,
    isError: isOrderError,
    refetch: refetchOrder,
  } = useAdminOrderById(
    supportCaseDetail?.order?.id || supportCaseDetail?.orderId,
  );

  const orderPreview = adminOrder || supportCaseDetail?.order;

  function handleSelectSupportCase(supportCaseId) {
    setSelectedSupportCaseId(supportCaseId);

    setSearchParams({
      case: String(supportCaseId),
    });

    setIsOrderDetailOpen(false);
  }

  function handleCloseOrderDetails() {
    setIsOrderDetailOpen(false);
  }

  return (
    <section className="min-h-full bg-[#F5F5F4] px-3 py-3 sm:px-4 sm:py-4 lg:px-6 xl:h-full xl:min-h-0 xl:overflow-hidden">
      <div className="mx-auto flex min-h-full w-full max-w-375 flex-col xl:h-full xl:min-h-0">
        <div className="shrink-0">
          <AdminChatsHeader
            totalCases={supportCases.length}
            unreadCount={unreadCount}
            onRefresh={refetchCases}
          />
        </div>

        <div className="mt-3 grid flex-1 grid-rows-[minmax(240px,38dvh)_auto] gap-3 sm:mt-4 sm:grid-rows-[minmax(280px,38dvh)_auto] sm:gap-4 xl:min-h-0 xl:grid-cols-[minmax(300px,360px)_minmax(0,1fr)] xl:grid-rows-1">
          {/* Left: Support queue */}
          <AdminSupportCaseQueue
            searchText={searchText}
            setSearchText={setSearchText}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            isCasesPending={isCasesPending}
            isCasesError={isCasesError}
            refetchCases={refetchCases}
            filteredSupportCases={filteredSupportCases}
            currentUserId={currentUser?.id}
            selectedSupportCaseId={selectedSupportCaseId}
            handleSelectSupportCase={handleSelectSupportCase}
          />

          {/* Right: Selected conversation */}
          <AdminSupportConversation
            selectedSupportCaseId={selectedSupportCaseId}
            isDetailPending={isDetailPending}
            supportCaseDetail={supportCaseDetail}
            isDetailError={isDetailError}
            detailError={detailError}
            refetchDetail={refetchDetail}
            orderPreview={orderPreview}
            isOrderPending={isOrderPending}
            isOrderError={isOrderError}
            adminOrder={adminOrder}
            refetchOrder={refetchOrder}
            setIsOrderDetailOpen={setIsOrderDetailOpen}
          />
        </div>
      </div>

      <AdminOrderDetailsModal
        isOpen={isOrderDetailOpen}
        order={adminOrder}
        onClose={handleCloseOrderDetails}
      />
    </section>
  );
}

export default AdminChats;
