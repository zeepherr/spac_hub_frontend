import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUpdateCategoryStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }) =>
      updateCategoryStatus(id, isActive),

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });

      toast.success(data.message);
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update category",
      );
    },
  });
}