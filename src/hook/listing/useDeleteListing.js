import { deleteListing } from "@/api/listing.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { listingKeys } from "./listingKeys";

export const useDeleteListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (listingId) => deleteListing(listingId),

    onSuccess: (data, listingId) => {
      toast.success(data.message, {
        position: "top-right",
      });

      queryClient.invalidateQueries({
        queryKey: listingKeys.mine(),
      });

      queryClient.invalidateQueries({
        queryKey: listingKeys.public(),
      });

      queryClient.removeQueries({
        queryKey: listingKeys.detail(listingId),
      });

      queryClient.removeQueries({
        queryKey: listingKeys.publicDetail(listingId),
      });
    },

    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete listing", {
        position: "top-right",
      });
    },
  });
};
