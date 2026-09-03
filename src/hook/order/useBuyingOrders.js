import { getBuyingOrders } from "@/api/order.api";
import { useQuery } from "@tanstack/react-query";
import { orderKeys } from "./orderKeys";

export const useBuyingOrders = () => {
  return useQuery({
    queryKey: orderKeys.buying(),
    queryFn: getBuyingOrders,

    staleTime: 30 * 1000,

    retry: false,
  });
};
