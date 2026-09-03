import { getPaymentStatus } from "@/api/payment.api";
import { useQuery } from "@tanstack/react-query";
import { paymentKeys } from "./paymentKeys";

export const usePaymentStatus = (sessionId) => {
  return useQuery({
    queryKey: paymentKeys.status(sessionId),

    queryFn: () => getPaymentStatus(sessionId),

    enabled: !!sessionId,

    retry: false,
  });
};
