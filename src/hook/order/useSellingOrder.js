import { getSellingOrders } from "@/api/order.api";
import { useQuery } from "@tanstack/react-query";

import { orderKeys } from "./orderKeys";

export const useSellingOrders = () => {
  return useQuery({
    queryKey: orderKeys.selling(),
    queryFn: getSellingOrders,

    staleTime: 30 * 1000,

    // Seller status tracking every 30 seconds
    refetchInterval: 30 * 1000,

    retry: false,
  });
};
