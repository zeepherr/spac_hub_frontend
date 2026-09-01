import { getQuestionById } from "@/api/conditionQuestion.api";
import { useQuery } from "@tanstack/react-query";
import { conditionQuestionKeys } from "./conditionQuestionKeys";

export const useConditionQuestion = (categoryId, questionId) => {
  return useQuery({
    queryKey: conditionQuestionKeys.detail(categoryId, questionId),

    queryFn: () => getQuestionById(categoryId, questionId),

    enabled: !!categoryId && !!questionId,

    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};
