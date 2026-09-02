import { getMyCart } from "@/api/cart.api";
import { useQuery } from "@tanstack/react-query";
import { cartKeys } from "./cartKeys";

// Fetches all cart items belonging to the authenticated user.
// Used on the cart page and for displaying the current cart contents.
export const useMyCart = () => {
  return useQuery({
    queryKey: cartKeys.mine(),

    queryFn: getMyCart,

    staleTime: 5 * 60 * 1000,

    retry: false,
  });
};
