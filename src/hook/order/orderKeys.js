export const orderKeys = {
  all: ["orders"],

  buying: () => [...orderKeys.all, "buying"],
  selling: () => [...orderKeys.all, "selling"],

  details: () => [...orderKeys.all, "detail"],

  detail: (orderId) => [...orderKeys.details(), String(orderId)],
};
