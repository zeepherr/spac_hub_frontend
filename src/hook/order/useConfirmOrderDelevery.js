import { confirmOrderDelivery } from "@/api/order.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { orderKeys } from "./orderKeys";

export const useConfirmOrderDelivery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId }) => confirmOrderDelivery(orderId),

    onSuccess: (data, { orderId }) => {
      toast.success(data.message, {
        position: "top-right",
      });

      queryClient.invalidateQueries({
        queryKey: orderKeys.buying(),
      });

      queryClient.invalidateQueries({
        queryKey: orderKeys.detail(orderId),
      });
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to confirm delivery",
        {
          position: "top-right",
        },
      );
    },
  });
};
