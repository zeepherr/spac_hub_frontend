import { analyzeListingCondition } from "@/api/listing.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { listingKeys } from "./listingKeys";

export const useAnalyzeListingCondition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: analyzeListingCondition,

    onSuccess: (data, listingId) => {
      toast.success(data.message, {
        position: "top-right",
      });

      queryClient.invalidateQueries({
        queryKey: listingKeys.detail(listingId),
      });

      queryClient.invalidateQueries({
        queryKey: listingKeys.mine(),
      });
    },
  });
};

// AI analyzes the listing details, condition answers, and images
// to estimate the product's condition score and grade.
