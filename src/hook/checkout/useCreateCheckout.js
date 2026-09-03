import { createCheckout } from "@/api/checkout.api";
import { useMutation } from "@tanstack/react-query";

export const useCreateCheckout = () => {
  return useMutation({
    mutationFn: createCheckout,

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
