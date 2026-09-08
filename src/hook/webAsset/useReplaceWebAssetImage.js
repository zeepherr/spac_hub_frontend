import { replaceWebAssetImage } from "@/api/webAsset.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { webAssetKeys } from "./webAssetKeys";

export const useReplaceWebAssetImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slot, image }) => replaceWebAssetImage(slot, image),

    onSuccess: (response) => {
      queryClient.setQueryData(webAssetKeys.current(), response.data);

      void queryClient.invalidateQueries({
        queryKey: webAssetKeys.current(),
        exact: true,
      });

      toast.success(response.message, {
        position: "top-right",
      });
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update website image.",
        {
          position: "top-right",
        },
      );
    },
  });
};
