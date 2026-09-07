export const checkoutKeys = {
  all: ["checkouts"],

  quotes: () => [...checkoutKeys.all, "quote"],

  quote: (listingIds, setupServiceRequested = false) => [
    ...checkoutKeys.quotes(),
    [...listingIds].sort(),
    setupServiceRequested,
  ],
};
