import { authApi } from "./axios";

export const getBuyingOrders = async () => {
  const response = await authApi.get("/orders/buying");

  return response.data.data;
};
// Seller
export const getSellingOrders = async () => {
  const response = await authApi.get("/orders/selling");

  return response.data.data;
};
export const getOrderById = async (orderId) => {
  const response = await authApi.get(`/orders/${orderId}`);

  return response.data.data;
};

// Seller submits parcel tracking to Admin
export const shipOrderToAdmin = async (orderId, payload) => {
  const response = await authApi.post(
    `/orders/${orderId}/ship-to-admin`,
    payload,
  );

  return response.data;
};
