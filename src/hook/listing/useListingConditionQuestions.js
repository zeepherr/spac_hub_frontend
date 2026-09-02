import { getListingConditionQuestions } from "@/api/listing.api";
import { useQuery } from "@tanstack/react-query";
import { listingKeys } from "./listingKeys";

export const useListingConditionQuestions = (listingId) => {
  return useQuery({
    queryKey: listingKeys.conditionQuestions(listingId),
    queryFn: () => getListingConditionQuestions(listingId),
    enabled: !!listingId,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};

// Fetches the condition questions required for a seller's listing.
// Used while the seller is completing the listing condition form.
