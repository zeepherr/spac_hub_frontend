import { shipOrderToAdmin } from "@/api/order.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { orderKeys } from "./orderKeys";

export const useShipOrderToAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, payload }) => shipOrderToAdmin(orderId, payload),

    onSuccess: (data, variables) => {
      toast.success(data.message, {
        position: "top-right",
      });

      queryClient.invalidateQueries({
        queryKey: orderKeys.selling(),
      });

      queryClient.invalidateQueries({
        queryKey: orderKeys.detail(variables.orderId),
      });
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "Failed to submit shipping information.",
        {
          position: "top-right",
        },
      );
    },
  });
};

// import { useShipOrderToAdmin } from "@/features/orders/useShipOrderToAdmin";

// function ShipToAdminButton({ order }) {
//   const shipMutation = useShipOrderToAdmin();

//   const handleSubmit = () => {
//     shipMutation.mutate({
//       orderId: order.id,
//       payload: {
//         carrier: "Thailand Post",
//         trackingNumber: "TH123456789",
//       },
//     });
//   };

//   const canShip = order.status === "PAID";

//   return (
//     <button
//       type="button"
//       onClick={handleSubmit}
//       disabled={!canShip || shipMutation.isPending}
//     >
//       {shipMutation.isPending
//         ? "Submitting..."
//         : "Ship to Admin"}
//     </button>
//   );
// }

// export default ShipToAdminButton;
