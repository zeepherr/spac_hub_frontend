import { removeCartItem } from "@/api/cart.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cartKeys } from "./cartKeys";

// Removes a listing from the authenticated user's cart.
// Refreshes the cart after the listing has been removed.
export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeCartItem,

    onSuccess: (data) => {
      toast.success(data.message, {
        position: "top-right",
      });

      queryClient.invalidateQueries({
        queryKey: cartKeys.mine(),
      });
    },
  });
};
