export const orderKeys = {
  all: ["orders"],

  buying: () => [...orderKeys.all, "buying"],

  selling: () => [...orderKeys.all, "selling"],

  details: () => [...orderKeys.all, "detail"],

  detail: (orderId) => [...orderKeys.details(), String(orderId)],

  admin: () => [...orderKeys.all, "admin"],

  adminLists: () => [...orderKeys.admin(), "list"],

  adminList: (statuses = []) => [
    ...orderKeys.adminLists(),
    [...statuses].sort(),
  ],

  adminDetails: () => [...orderKeys.admin(), "detail"],

  adminDetail: (orderId) => [...orderKeys.adminDetails(), String(orderId)],
};
