import { getListingsByCategory } from "@/api/listing.api";
import { useQuery } from "@tanstack/react-query";
import { listingKeys } from "./listingKeys";

export const useListingsByCategory = (categoryId) => {
  return useQuery({
    queryKey: listingKeys.byCategory(categoryId),

    queryFn: () => getListingsByCategory(categoryId),

    enabled: !!categoryId,

    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};
// Fetches all ACTIVE public listings belonging to a specific category.
// Used when a buyer filters listings by category.
