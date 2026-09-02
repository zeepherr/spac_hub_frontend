import { getListingById } from "@/api/listing.api";
import { useQuery } from "@tanstack/react-query";
import { listingKeys } from "./listingKeys";

export const useListingDetail = (listingId) => {
  return useQuery({
    queryKey: listingKeys.detail(listingId),
    queryFn: () => getListingById(listingId),
    enabled: !!listingId,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};

// Fetches one listing owned by the authenticated seller.
// Used for seller-side listing management or editing.
// Do not use this hook for the public buyer listing detail page.
