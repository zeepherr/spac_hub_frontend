import { returnOrderToSeller } from "@/api/order.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { orderKeys } from "./orderKeys";

export const useReturnOrderToSeller = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, payload }) => returnOrderToSeller(orderId, payload),

    onSuccess: (data, { orderId }) => {
      toast.success(data.message || "Order returned to seller successfully", {
        position: "top-right",
      });

      queryClient.invalidateQueries({
        queryKey: orderKeys.admin(),
      });

      queryClient.invalidateQueries({
        queryKey: orderKeys.adminDetail(orderId),
      });
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to return order to seller",
        {
          position: "top-right",
        },
      );
    },
  });
};
