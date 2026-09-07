import { getCheckoutQuote } from "@/api/checkout.api";
import { useQuery } from "@tanstack/react-query";
import { checkoutKeys } from "./checkoutKeys";

export const useCheckoutQuote = (
  listingIds = [],
  setupServiceRequested = false,
) => {
  const normalizedListingIds = Array.isArray(listingIds)
    ? [...listingIds].sort()
    : [];

  return useQuery({
    queryKey: checkoutKeys.quote(normalizedListingIds, setupServiceRequested),

    queryFn: () =>
      getCheckoutQuote(normalizedListingIds, setupServiceRequested),

    enabled: normalizedListingIds.length > 0,

    staleTime: 10 * 1000,
    retry: false,
  });
};
