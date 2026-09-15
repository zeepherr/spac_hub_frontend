export const BUYER_SUPPORT_ISSUES = [
  {
    value: "PRODUCT_NOT_AS_DESCRIBED",
    label: "Product not as described",
  },
  {
    value: "PAYMENT",
    label: "Payment issue",
  },
  {
    value: "SHIPPING",
    label: "Shipping issue",
  },
  {
    value: "DAMAGED_PRODUCT",
    label: "Damaged product",
  },
  {
    value: "SELLER_NOT_RESPONDING",
    label: "Seller not responding",
  },
  {
    value: "OTHER",
    label: "Other issue",
  },
];

export const SELLER_SUPPORT_ISSUES = [
  {
    value: "PAYMENT",
    label: "Payment issue",
  },
  {
    value: "SHIPPING",
    label: "Shipping or return issue",
  },
  {
    value: "BUYER_NOT_RESPONDING",
    label: "Buyer not responding",
  },
  {
    value: "OTHER",
    label: "Inspection or other issue",
  },
];
export const ADMIN_SUPPORT_ISSUES = [
  {
    value: "PRODUCT_NOT_AS_DESCRIBED",
    label: "Product not as described",
  },
  {
    value: "PAYMENT",
    label: "Payment issue",
  },
  {
    value: "SHIPPING",
    label: "Shipping issue",
  },
  {
    value: "DAMAGED_PRODUCT",
    label: "Damaged product",
  },
  {
    value: "SELLER_NOT_RESPONDING",
    label: "Seller not responding",
  },
  {
    value: "BUYER_NOT_RESPONDING",
    label: "Buyer not responding",
  },
  {
    value: "OTHER",
    label: "Other issue",
  },
];

export const SUPPORT_STATUS_META = {
  OPEN: {
    label: "Open",
    className: "bg-orange-50 text-orange-600",
  },

  INVESTIGATING: {
    label: "Investigating",
    className: "bg-blue-50 text-blue-600",
  },

  WAITING_FOR_BUYER: {
    label: "Waiting for Buyer",
    className: "bg-amber-50 text-amber-700",
  },

  WAITING_FOR_SELLER: {
    label: "Waiting for Seller",
    className: "bg-amber-50 text-amber-700",
  },

  RESOLVED: {
    label: "Resolved",
    className: "bg-emerald-50 text-emerald-600",
  },

  CLOSED: {
    label: "Closed",
    className: "bg-neutral-100 text-neutral-600",
  },
};

export function hasUnreadSupportMessage(supportCase, currentUserId) {
  const lastMessage = supportCase?.conversation?.messages?.[0];

  return Boolean(
    currentUserId &&
    lastMessage &&
    lastMessage.senderId !== currentUserId &&
    !lastMessage.readAt,
  );
}
