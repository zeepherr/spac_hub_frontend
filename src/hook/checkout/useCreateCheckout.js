import { createCheckout } from "@/api/checkout.api";
import { useMutation } from "@tanstack/react-query";

export const useCreateCheckout = () => {
  return useMutation({
    mutationFn: (listingIds) => createCheckout(listingIds),
  });
};
