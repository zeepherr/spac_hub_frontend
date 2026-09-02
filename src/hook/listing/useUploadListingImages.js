import { uploadListingImages } from "@/api/listing.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { listingKeys } from "./listingKeys";

export const useUploadListingImages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ listingId, images }) =>
      uploadListingImages(listingId, images),

    onSuccess: (data, variables) => {
      toast.success(data.message, {
        position: "top-right",
      });

      queryClient.invalidateQueries({
        queryKey: listingKeys.detail(variables.listingId),
      });

      queryClient.invalidateQueries({
        queryKey: listingKeys.mine(),
      });
    },
  });
};

// Uploads product images for a seller's draft listing.
