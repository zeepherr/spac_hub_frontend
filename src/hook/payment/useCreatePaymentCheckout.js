import { createPaymentCheckout } from "@/api/payment.api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreatePaymentCheckout = () => {
  return useMutation({
    mutationFn: (checkoutId) => createPaymentCheckout(checkoutId),

    onSuccess: (data) => {
      toast.success(data.message, { position: "top-right" });
      window.location.href = data.data.checkoutUrl;
    },

    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to start payment", {
        position: "top-right",
      });
    },
  });
};
