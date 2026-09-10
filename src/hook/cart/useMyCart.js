import { getMyCart } from "@/api/cart.api";
import useAuthStore from "@/stores/auth.store";
import { useQuery } from "@tanstack/react-query";
import { cartKeys } from "./cartKeys";

// Fetches all cart items belonging to the authenticated user.
// Used on the cart page and for displaying the current cart contents.
export const useMyCart = () => {
  const status = useAuthStore((state) => state.status);
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: cartKeys.mine(),

    queryFn: getMyCart,

    enabled: status === "authenticated" && user?.role === "USER",

    staleTime: 5 * 60 * 1000,

    retry: false,
  });
};
