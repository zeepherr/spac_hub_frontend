import { authApi } from "./axios";

export const getBuyingOrders = async () => {
  const response = await authApi.get("/orders/buying");

  return response.data.data;
};

export const getOrderById = async (orderId) => {
  const response = await authApi.get(`/orders/${orderId}`);

  return response.data.data;
};

export const confirmOrderDelivery = async (orderId) => {
  const response = await authApi.post(`/orders/${orderId}/confirm-delivery`);

  return response.data;
}