import { authApi } from "./axios";

// Get all cart items for the authenticated user
export const getMyCart = async () => {
  const response = await authApi.get("/cart", {
    globalLoading: false,
  });

  return response.data.data;
};

// Add one ACTIVE listing to the authenticated user's cart
export const addCartItem = async (listingId) => {
  const response = await authApi.post(`/cart/${listingId}`);

  return response.data;
};

// Remove one listing from the authenticated user's cart
export const removeCartItem = async (listingId) => {
  const response = await authApi.delete(`/cart/${listingId}`);

  return response.data;
};
