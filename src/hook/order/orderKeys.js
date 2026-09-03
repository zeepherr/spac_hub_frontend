export const orderKeys = {
  all: ["orders"],

  buying: () => [...orderKeys.all, "buying"],

  details: () => [...orderKeys.all, "detail"],

  detail: (orderId) => [...orderKeys.details(), String(orderId)],
};
