export const listingKeys = {
  all: ["listings"],

  public: () => [...listingKeys.all, "public"],

  active: () => [...listingKeys.public(), "active"],

  byCategory: (categoryId) => [...listingKeys.public(), "category", categoryId],

  mine: () => [...listingKeys.all, "mine"],

  detail: (listingId) => [...listingKeys.all, "detail", listingId],
  publicDetail: (listingId) => [...listingKeys.public(), "detail", listingId],

  conditionQuestions: (listingId) => [
    ...listingKeys.detail(listingId),
    "condition-questions",
  ],
};
