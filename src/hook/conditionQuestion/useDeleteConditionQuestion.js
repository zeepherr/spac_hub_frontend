import { deleteConditionQuestion } from "@/api/conditionQuestion.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { categoryKeys } from "@/hook/category/categoryKeys";
import { conditionQuestionKeys } from "./conditionQuestionKeys";

export const useDeleteConditionQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ categoryId, questionId }) =>
      deleteConditionQuestion(categoryId, questionId),

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

      queryClient.removeQueries({
        queryKey: conditionQuestionKeys.detail(
          variables.categoryId,
          variables.questionId,
        ),
      });
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to delete condition question",
        {
          position: "top-right",
        },
      );
    },
  });
};
