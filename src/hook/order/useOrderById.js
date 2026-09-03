import { getOrderById } from "@/api/order.api";
import { useQuery } from "@tanstack/react-query";
import { orderKeys } from "./orderKeys";

export const useOrderById = (orderId) => {
  const parsedOrderId = Number(orderId);

  const isValidOrderId = Number.isInteger(parsedOrderId) && parsedOrderId > 0;

  return useQuery({
    queryKey: orderKeys.detail(orderId),

    queryFn: () => getOrderById(parsedOrderId),

    enabled: isValidOrderId,

    staleTime: 30 * 1000,

    retry: false,
  });
};
