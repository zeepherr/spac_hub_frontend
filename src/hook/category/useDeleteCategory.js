import { deleteCategory } from "@/api/category.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { categoryKeys } from "./categoryKeys";

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteCategory(id),

    onSuccess: (data) => {
      toast.success(data.message, {
        position: "top-right",
      });

      queryClient.invalidateQueries({
        queryKey: categoryKeys.all,
      });
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to delete category",
        {
          position: "top-right",
        },
      );
    },
  });
};
