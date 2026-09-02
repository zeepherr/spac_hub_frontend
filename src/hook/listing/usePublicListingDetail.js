import { getPublicListingById } from "@/api/listing.api";
import { useQuery } from "@tanstack/react-query";
import { listingKeys } from "./listingKeys";

export const usePublicListingDetail = (listingId) => {
  return useQuery({
    queryKey: listingKeys.publicDetail(listingId),

    queryFn: () => getPublicListingById(listingId),

    enabled: !!listingId,

    staleTime: 5 * 60 * 1000,

    retry: false,
  });
};

// Fetches one ACTIVE listing for public/buyer viewing.
// Used on the public listing detail page.
