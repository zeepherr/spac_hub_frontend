import { authApi } from "./axios";

// Creates a Stripe Checkout Session for an existing checkout.
export const createPaymentCheckout = async (checkoutId) => {
  const response = await authApi.post("/payments/checkout", {
    checkoutId,
  });

  return response.data;
};

// Gets the backend-confirmed payment status after returning from Stripe.
export const getPaymentStatus = async (sessionId) => {
  const response = await authApi.get(`/payments/status/${sessionId}`, {
    globalLoading: false,
  });

  return response.data.data;
};
