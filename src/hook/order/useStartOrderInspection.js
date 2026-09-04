import { startOrderInspection } from "@/api/order.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { orderKeys } from "./orderKeys";

export const useStartOrderInspection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId }) => startOrderInspection(orderId),

    onSuccess: (data, { orderId }) => {
      toast.success(data.message);

      queryClient.invalidateQueries({
        queryKey: orderKeys.admin(),
      });

      queryClient.invalidateQueries({
        queryKey: orderKeys.adminDetail(orderId),
      });
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to start inspection",
      );
    },
  });
};
