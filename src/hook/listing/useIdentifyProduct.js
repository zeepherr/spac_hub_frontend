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
