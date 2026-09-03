import { authApi } from "./axios";

// Creates a checkout and reserves the selected listing(s).
export const createCheckout = async (payload) => {
  const response = await authApi.post("/checkouts", payload);

  return response.data;
};
