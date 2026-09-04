import { shipOrderToBuyer } from "@/api/order.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { orderKeys } from "./orderKeys";

export const useShipOrderToBuyer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, payload }) => shipOrderToBuyer(orderId, payload),

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
        error.response?.data?.message || "Failed to ship order to Buyer",
      );
    },
  });
};

// uses
// shipMutation.mutate({
//   orderId: order.id,

//   payload: {
//     carrier: "Kerry Express",
//     trackingNumber: "TH987654321",
//   },
// });
