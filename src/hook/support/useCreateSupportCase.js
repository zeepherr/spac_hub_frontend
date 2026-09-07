import { createSupportCase } from "@/api/support.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { supportKeys } from "./supportKeys";

export const useCreateSupportCase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSupportCase,

    onSuccess: (response) => {
      const supportCase = response.data;

      /*
       * Put the returned detail directly into cache.
       */
      if (supportCase?.id) {
        queryClient.setQueryData(
          supportKeys.myDetail(supportCase.id),
          supportCase,
        );
      }

      /*
       * Refresh Buyer/Seller Support Case list.
       */
      queryClient.invalidateQueries({
        queryKey: supportKeys.myLists(),
      });

      toast.success(response.message);
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to create Support Case.",
      );
    },
  });
};
