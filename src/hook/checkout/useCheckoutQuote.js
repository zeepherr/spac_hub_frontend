import { getCheckoutQuote } from "@/api/checkout.api";
import { useQuery } from "@tanstack/react-query";
import { checkoutKeys } from "./checkoutKeys";

export const useCheckoutQuote = (listingIds = []) => {
  const normalizedListingIds = Array.isArray(listingIds)
    ? [...listingIds].sort()
    : [];

  return useQuery({
    queryKey: checkoutKeys.quote(normalizedListingIds),

    queryFn: () => getCheckoutQuote(normalizedListingIds),

    enabled: normalizedListingIds.length > 0,

    staleTime: 10 * 1000,
    retry: false,
  });
};
