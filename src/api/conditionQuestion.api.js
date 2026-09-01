import { authApi } from "./axios";

export const getQuestionsByCategory = async (categoryId) => {
  const response = await authApi.get(`/categories/${categoryId}/questions`, {
    globalLoading: false,
  });

  return response.data.data;
};

export const getQuestionById = async (categoryId, questionId) => {
  const response = await authApi.get(
    `/categories/${categoryId}/questions/${questionId}`,
    {
      globalLoading: false,
    },
  );

  return response.data.data;
};

export const createConditionQuestion = async (categoryId, payload) => {
  const response = await authApi.post(
    `/categories/${categoryId}/questions`,
    payload,
  );

  return response.data;
};

export const updateConditionQuestion = async (
  categoryId,
  questionId,
  payload,
) => {
  const response = await authApi.patch(
    `/categories/${categoryId}/questions/${questionId}`,
    payload,
  );

  return response.data;
};

export const updateConditionQuestionStatus = async (
  categoryId,
  questionId,
  payload,
) => {
  const response = await authApi.patch(
    `/categories/${categoryId}/questions/${questionId}/status`,
    payload,
  );

  return response.data;
};
