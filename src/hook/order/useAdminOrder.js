import { getAdminOrders } from "@/api/order.api";
import { useQuery } from "@tanstack/react-query";
import { orderKeys } from "./orderKeys";

export const useAdminOrders = ({ statuses = [] } = {}) => {
  const normalizedStatuses = Array.isArray(statuses)
    ? [...statuses].sort()
    : [statuses];

  return useQuery({
    queryKey: orderKeys.adminList(normalizedStatuses),

    queryFn: () => getAdminOrders(normalizedStatuses),

    staleTime: 15 * 1000,

    // Operational Admin queues update regularly.
    refetchInterval: 30 * 1000,

    retry: false,
  });
};

// const awaitingReceiptQuery = useAdminOrders({
//   statuses: ["SELLER_SHIPPING"],
// });
// const inspectionQuery = useAdminOrders({
//   statuses: [
//     "INSPECTION_PENDING",
//     "INSPECTING",
//   ],
// });
// const readyToShipQuery = useAdminOrders({
//   statuses: ["VERIFIED"],
// });
// const actionRequiredQuery = useAdminOrders({
//   statuses: ["NEEDS_REVIEW", "REJECTED"],
// });
