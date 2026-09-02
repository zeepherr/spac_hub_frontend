import { getActiveListings } from "@/api/listing.api";
import { useQuery } from "@tanstack/react-query";
import { listingKeys } from "./listingKeys";

export const useListings = () => {
  return useQuery({
    queryKey: listingKeys.active(),
    queryFn: getActiveListings,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};

// Fetches all currently ACTIVE public listings.
// Used on the marketplace home page or general listing page.
