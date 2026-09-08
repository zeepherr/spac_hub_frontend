const ORDER_STATUS_STYLES = {
  AWAITING_PAYMENT: "bg-amber-50 text-amber-700",
  PAID: "bg-emerald-50 text-emerald-700",
  SELLER_SHIPPING: "bg-violet-50 text-violet-700",
  SHIPPING_TO_ADMIN: "bg-blue-50 text-blue-700",
  RECEIVED_BY_ADMIN: "bg-indigo-50 text-indigo-700",
  INSPECTION_PENDING: "bg-purple-50 text-purple-700",
  INSPECTING: "bg-purple-50 text-purple-700",
  NEEDS_REVIEW: "bg-orange-50 text-orange-700",
  VERIFIED: "bg-teal-50 text-teal-700",
  SHIPPING_TO_BUYER: "bg-blue-50 text-blue-700",
  COMPLETED: "bg-emerald-50 text-emerald-700",
  CANCELLED: "bg-red-50 text-red-700",
  REJECTED: "bg-red-50 text-red-700",
  REFUNDED: "bg-neutral-100 text-neutral-700",
};

function getSupportOrderImage(order) {
  const images = order?.listing?.images ?? [];
  const coverImage = images.find((image) => image.isCover) ?? images[0];

  return coverImage?.imageUrl || coverImage?.url || "";
}

function getSupportOrderName(order) {
  return (
    order?.listing?.title ||
    [order?.listing?.brand, order?.listing?.model]
      .filter(Boolean)
      .join(" ") ||
    "Untitled item"
  );
}

function getOrderStatusMeta(status) {
  return {
    label: formatEnumLabel(status || "Unknown"),
    className:
      ORDER_STATUS_STYLES[status] || "bg-neutral-100 text-neutral-700",
  };
}

function formatSupportOrderPrice(value) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return "Price unavailable";
  }

  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(numericValue);
}

function formatSupportOrderDate(value) {
  if (!value) {
    return "-";
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsedDate);
}

function formatEnumLabel(value) {
  if (!value) {
    return "";
  }

  return String(value)
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export {
  formatEnumLabel,
  formatSupportOrderDate,
  formatSupportOrderPrice,
  getOrderStatusMeta,
  getSupportOrderImage,
  getSupportOrderName,
};
