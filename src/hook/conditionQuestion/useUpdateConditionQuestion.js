import { updateConditionQuestion } from "@/api/conditionQuestion.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { conditionQuestionKeys } from "./conditionQuestionKeys";

export const useUpdateConditionQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ categoryId, questionId, payload }) =>
      updateConditionQuestion(categoryId, questionId, payload),

    onSuccess: (data, variables) => {
      toast.success(data.message, {
        position: "top-right",
      });

      queryClient.invalidateQueries({
        queryKey: conditionQuestionKeys.byCategory(variables.categoryId),
      });
    },
  });
};
