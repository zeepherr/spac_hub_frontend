import { authApi } from "./axios";

// Calculates the authoritative Checkout price.
// This does not create or reserve anything.
export const getCheckoutQuote = async (listingIds) => {
  const response = await authApi.post(
    "/checkouts/quote",
    {
      listingIds,
    },
    {
      globalLoading: false,
    },
  );

  return response.data.data;
};

// Creates a Checkout and reserves the Listings.
export const createCheckout = async (payload) => {
  const response = await authApi.post("/checkouts", payload);

  return response.data;
};
