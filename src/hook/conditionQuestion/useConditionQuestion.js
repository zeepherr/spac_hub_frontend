import {
  getQuestionById,
  getQuestionsByCategory,
} from "@/api/conditionQuestion.api";

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

// GET ALL QUESTIONS BY CATEGORY
export const useConditionQuestions = (categoryId, isOpen) => {
  return useQuery({
    queryKey: conditionQuestionKeys.byCategory(categoryId),

    queryFn: () => getQuestionsByCategory(categoryId),

    enabled: !!categoryId && isOpen,

    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};