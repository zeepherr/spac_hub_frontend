import { createAdminSupportCases } from "@/api/support.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { supportKeys } from "./supportKeys";

export const useAdminCreateSupportCase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAdminSupportCases,

    onSuccess: (response) => {
      const cases = response?.data?.cases ?? [];

      for (const item of cases) {
        const supportCase = item?.supportCase;

        if (!supportCase?.id) {
          continue;
        }

        queryClient.setQueryData(
          supportKeys.adminDetail(supportCase.id),
          supportCase,
        );
      }

      queryClient.invalidateQueries({
        queryKey: supportKeys.adminLists(),
      });

      toast.success(
        response?.message || "Support conversation prepared successfully.",
      );
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "Failed to start Support conversation.",
      );
    },
  });
};
