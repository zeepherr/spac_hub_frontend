import { deleteWebAssetImage } from "@/api/webAsset.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { webAssetKeys } from "./webAssetKeys";

export const useDeleteWebAssetImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteWebAssetImage,

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
        error.response?.data?.message || "Failed to delete website image.",
        {
          position: "top-right",
        },
      );
    },
  });
};
