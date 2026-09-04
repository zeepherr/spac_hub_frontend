import { receiveOrderFromSeller } from "@/api/order.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { orderKeys } from "./orderKeys";

export const useReceiveOrderFromSeller = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId }) => receiveOrderFromSeller(orderId),

    onSuccess: (data, { orderId }) => {
      toast.success(data.message, {
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
      toast.error(error.response?.data?.message || "Failed to receive parcel", {
        position: "top-right",
      });
    },
  });
};
