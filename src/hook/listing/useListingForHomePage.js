import { getActiveListings } from "@/api/listing.api";
import useAuthStore from "@/stores/auth.store";
import { isListingOwnedBy } from "@/utils/listing/listingOwnership";
import { useQuery } from "@tanstack/react-query";
import { listingKeys } from "./listingKeys";

export const useListings = () => {
  const userId = useAuthStore((state) => state.user?.id);

  return useQuery({
    queryKey: listingKeys.active(),
    queryFn: () => getActiveListings(),
    select: (listings) =>
      userId
        ? listings.filter((listing) => !isListingOwnedBy(listing, userId))
        : listings,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};

// Fetches all currently ACTIVE public listings.
// Used on the marketplace home page or general listing page.
