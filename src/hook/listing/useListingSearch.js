import { getActiveListings } from "@/api/listing.api";
import { useQuery } from "@tanstack/react-query";
import { listingKeys } from "./listingKeys";

export const useListingSearch = (search) => {
  const normalizedSearch = search.trim();

  return useQuery({
    queryKey: listingKeys.search(normalizedSearch),

    queryFn: () =>
      getActiveListings(normalizedSearch, {
        globalLoading: false,
      }),

    enabled: normalizedSearch.length >= 2,

    staleTime: 60 * 1000,

    retry: false,
  });
};
