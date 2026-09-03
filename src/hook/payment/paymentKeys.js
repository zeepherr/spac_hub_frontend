export const paymentKeys = {
  all: ["payments"],

  status: (sessionId) => [...paymentKeys.all, "status", sessionId],
};
