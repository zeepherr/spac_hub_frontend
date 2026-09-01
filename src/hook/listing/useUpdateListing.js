import { updateListing } from "@/api/listing.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { listingKeys } from "./listingKeys";

export const useUpdateListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ listingId, payload }) => updateListing(listingId, payload),

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
