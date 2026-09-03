import { getAdminOrderById } from "@/api/order.api";
import { useQuery } from "@tanstack/react-query";
import { orderKeys } from "./orderKeys";

export const useAdminOrderById = (orderId) => {
  const numericOrderId = Number(orderId);

  return useQuery({
    queryKey: orderKeys.adminDetail(numericOrderId),

    queryFn: () => getAdminOrderById(numericOrderId),

    enabled: Number.isInteger(numericOrderId) && numericOrderId > 0,

    staleTime: 15 * 1000,
    retry: false,
  });
};
