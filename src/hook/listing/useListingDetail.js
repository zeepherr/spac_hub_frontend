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
