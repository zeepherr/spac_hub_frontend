export const conditionQuestionKeys = {
  all: ["condition-questions"],

  byCategory: (categoryId) => [
    ...conditionQuestionKeys.all,
    "category",
    categoryId,
  ],

  detail: (categoryId, questionId) => [
    ...conditionQuestionKeys.byCategory(categoryId),
    "detail",
    questionId,
  ],
};
