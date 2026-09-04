import { authApi } from "./axios";

//buyer
export const getBuyingOrders = async () => {
  const response = await authApi.get("/orders/buying");

  return response.data.data;
};
// Buyer confirms that the parcel has been received.
export const confirmOrderDelivery = async (orderId) => {
  const response = await authApi.post(`/orders/${orderId}/confirm-delivery`);

  return response.data;
};
//shared
export const getOrderById = async (orderId) => {
  const response = await authApi.get(`/orders/${orderId}`);

  return response.data.data;
};
<<<<<<< HEAD

export const confirmOrderDelivery = async (orderId) => {
  const response = await authApi.post(`/orders/${orderId}/confirm-delivery`);

  return response.data;
}
=======
// Seller
export const getSellingOrders = async () => {
  const response = await authApi.get("/orders/selling");

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

// Admin: fetch orders by one or more statuses
export const getAdminOrders = async (statuses = []) => {
  const status = statuses.length > 0 ? statuses.join(",") : undefined;

  const response = await authApi.get("/admin/orders", {
    params: status ? { status } : undefined,
    globalLoading: false,
  });

  return response.data.data;
};

export const getAdminOrderById = async (orderId) => {
  const response = await authApi.get(`/admin/orders/${orderId}`, {
    globalLoading: false,
  });

  return response.data.data;
};

export const receiveOrderFromSeller = async (orderId) => {
  const response = await authApi.post(`/admin/orders/${orderId}/receive`);

  return response.data;
};

export const startOrderInspection = async (orderId) => {
  const response = await authApi.post(
    `/admin/orders/${orderId}/inspection/start`,
  );

  return response.data;
};

export const completeOrderInspection = async (orderId, payload) => {
  const response = await authApi.post(
    `/admin/orders/${orderId}/inspection/complete`,
    payload,
  );

  return response.data;
};

export const shipOrderToBuyer = async (orderId, payload) => {
  const response = await authApi.post(
    `/admin/orders/${orderId}/ship-to-buyer`,
    payload,
  );

  return response.data;
};
>>>>>>> children
