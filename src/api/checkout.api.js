import { authApi } from "./axios";

// Calculates the authoritative Checkout price.
// This does not create or reserve anything.
export const getCheckoutQuote = async (
  listingIds,
  setupServiceRequested = false,
) => {
  const response = await authApi.post(
    "/checkouts/quote",
    {
      listingIds,
      setupServiceRequested,
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

// Admin returns a rejected product to the Seller.
export const returnOrderToSeller = async (orderId, payload) => {
  const response = await authApi.post(
    `/admin/orders/${orderId}/return-to-seller`,
    payload,
  );

  return response.data;
};
