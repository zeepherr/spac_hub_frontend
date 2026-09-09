import { createListing } from "@/api/listing.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { listingKeys } from "./listingKeys";

export const useCreateListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createListing,

    onSuccess: (data) => {
      // toast.success(data.message, {
      //   position: "top-right",
      // });

      queryClient.invalidateQueries({
        queryKey: listingKeys.mine(),
      });
    },
  });
};

// Creates a new draft listing for the authenticated seller.
// The listing must be completed before it can be published.
