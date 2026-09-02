import { identifyProduct } from "@/api/listing.api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useIdentifyProduct = () => {
  return useMutation({
    mutationFn: identifyProduct,

    onSuccess: (data) => {
      toast.success(data.message, {
        position: "top-right",
      });
    },
  });
};
// Sends a product image to AI to identify product information
// such as title, brand, model, category, and description.
