import { completeOrderInspection } from "@/api/order.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { orderKeys } from "./orderKeys";

export const useCompleteOrderInspection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, payload }) =>
      completeOrderInspection(orderId, payload),

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
        error.response?.data?.message || "Failed to complete inspection",
      );
    },
  });
};

// uses
// completeInspectionMutation.mutate({
//   orderId: order.id,

//   payload: {
//     result: "PASSED",
//     verifiedCondition: "LIKE_NEW",
//     verifiedScore: 92,
//     notes: "Product matches the listing.",
//   },
// });
