import { createConditionQuestion } from "@/api/conditionQuestion.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { conditionQuestionKeys } from "./conditionQuestionKeys";
import { categoryKeys } from "@/hook/category/categoryKeys";

export const useCreateConditionQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ categoryId, payload }) =>
      createConditionQuestion(categoryId, payload),

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
