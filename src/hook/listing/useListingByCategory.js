import { getListingsByCategory } from "@/api/listing.api";
import useAuthStore from "@/stores/auth.store";
import { isListingOwnedBy } from "@/utils/listing/listingOwnership";
import { useQuery } from "@tanstack/react-query";
import { listingKeys } from "./listingKeys";

export const useListingsByCategory = (categoryId) => {
  const userId = useAuthStore((state) => state.user?.id);

  return useQuery({
    queryKey: listingKeys.byCategory(categoryId),

    queryFn: () => getListingsByCategory(categoryId),

    select: (listings) =>
      userId
        ? listings.filter((listing) => !isListingOwnedBy(listing, userId))
        : listings,

    enabled: !!categoryId,

    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};
// Fetches all ACTIVE public listings belonging to a specific category.
// Used when a buyer filters listings by category.
