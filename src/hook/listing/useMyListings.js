import { getMyListings } from "@/api/listing.api";
import { useQuery } from "@tanstack/react-query";
import { listingKeys } from "./listingKeys";

export const useMyListings = () => {
  return useQuery({
    queryKey: listingKeys.mine(),
    queryFn: getMyListings,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};

// Fetches all listings created by the authenticated seller.
// Used on the seller's "My Listings" page.
