import { authApi } from "./axios";

// Creates a checkout and reserves the selected listing(s).
export const createCheckout = async (listingIds) => {
  const response = await authApi.post("/checkouts", {
    listingIds,
  });

  return response.data;
};
