import { createCheckout } from "@/api/checkout.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cartKeys } from "../cart/cartKeys";

export const useCreateCheckout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCheckout,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: cartKeys.mine(),
      });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to create checkout",
        {
          position: "top-right",
        },
      );
    },
  });
};

// const handleCheckout = (formData) => {
//   createCheckoutMutation.mutate({
//     listingIds,

//     shippingAddress: {
//       recipientName: formData.recipientName,
//       phone: formData.phone,
//       address: formData.address,
//     },
//   });
// };
