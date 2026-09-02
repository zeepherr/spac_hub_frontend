import { saveListingConditionAnswers } from "@/api/listing.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { listingKeys } from "./listingKeys";

export const useSaveListingConditionAnswers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ listingId, answers }) =>
      saveListingConditionAnswers(listingId, answers),

    onSuccess: (data, variables) => {
      toast.success(data.message, {
        position: "top-right",
      });

      queryClient.invalidateQueries({
        queryKey: listingKeys.conditionQuestions(variables.listingId),
      });

      queryClient.invalidateQueries({
        queryKey: listingKeys.detail(variables.listingId),
      });
    },
  });
};

// Saves or updates the seller's answers to listing condition questions.
