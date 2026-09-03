export const checkoutKeys = {
  all: ["checkouts"],

  quotes: () => [...checkoutKeys.all, "quote"],

  quote: (listingIds) => [...checkoutKeys.quotes(), [...listingIds].sort()],
};
