import { publishListing } from "@/api/listing.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { listingKeys } from "./listingKeys";

export const usePublishListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: publishListing,

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
      queryClient.invalidateQueries({
        queryKey: listingKeys.public(),
      });
    },
  });
};
