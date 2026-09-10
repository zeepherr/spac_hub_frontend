import { getActiveListings } from "@/api/listing.api";
import useAuthStore from "@/stores/auth.store";
import { isListingOwnedBy } from "@/utils/listing/listingOwnership";
import { useQuery } from "@tanstack/react-query";
import { listingKeys } from "./listingKeys";

export const useListingSearch = (search) => {
  const normalizedSearch = search.trim();
  const userId = useAuthStore((state) => state.user?.id);

  return useQuery({
    queryKey: listingKeys.search(normalizedSearch),

    queryFn: () =>
      getActiveListings(normalizedSearch, {
        globalLoading: false,
      }),

    select: (listings) =>
      userId
        ? listings.filter((listing) => !isListingOwnedBy(listing, userId))
        : listings,

    enabled: normalizedSearch.length >= 2,

    staleTime: 60 * 1000,

    retry: false,
  });
};
