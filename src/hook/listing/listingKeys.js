export const listingKeys = {
  all: ["listings"],

  public: () => [...listingKeys.all, "public"],

  active: () => [...listingKeys.public(), "active"],

  byCategory: (categoryId) => [...listingKeys.public(), "category", categoryId],

  mine: () => [...listingKeys.all, "mine"],

  detail: (listingId) => [...listingKeys.all, "detail", listingId],

  conditionQuestions: (listingId) => [
    ...listingKeys.detail(listingId),
    "condition-questions",
  ],
};
