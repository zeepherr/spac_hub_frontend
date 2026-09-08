import { updateAdminSupportCaseStatus } from "@/api/support.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { supportKeys } from "./supportKeys";

export const useUpdateSupportCaseStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ supportCaseId, payload }) =>
      updateAdminSupportCaseStatus(supportCaseId, payload),

    onSuccess: (response, { supportCaseId }) => {
      /*
       * Immediately update the opened case.
       */
      queryClient.setQueryData(
        supportKeys.adminDetail(supportCaseId),
        response.data,
      );

      /*
       * Refresh status shown in Admin queue.
       */
      queryClient.invalidateQueries({
        queryKey: supportKeys.adminLists(),
      });

      toast.success(response.message);
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "Failed to update Support Case status.",
      );
    },
  });
};
