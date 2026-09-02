import { addCartItem } from "@/api/cart.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cartKeys } from "./cartKeys";

// Adds an ACTIVE listing to the authenticated user's cart.
// Refreshes the cart after the listing has been added.
export const useAddCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addCartItem,

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
