import { updateConditionQuestionStatus } from "@/api/conditionQuestion.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { categoryKeys } from "@/hook/category/categoryKeys";
import { conditionQuestionKeys } from "./conditionQuestionKeys";

export const useUpdateConditionQuestionStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ categoryId, questionId, payload }) =>
      updateConditionQuestionStatus(categoryId, questionId, payload),

    onSuccess: (data, variables) => {
      toast.success(data.message, {
        position: "top-right",
      });

      queryClient.invalidateQueries({
        queryKey: conditionQuestionKeys.byCategory(variables.categoryId),
      });
      
      queryClient.invalidateQueries({
        queryKey: categoryKeys.includeInactive(),
      });
    },
  });
};
