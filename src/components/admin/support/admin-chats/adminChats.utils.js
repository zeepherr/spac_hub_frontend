const STATUS_FILTERS = [
  { value: "ALL", label: "All cases" },
  { value: "OPEN", label: "Open" },
  { value: "INVESTIGATING", label: "Investigating" },
  { value: "WAITING_FOR_BUYER", label: "Waiting for Buyer" },
  { value: "WAITING_FOR_SELLER", label: "Waiting for Seller" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "CLOSED", label: "Closed" },
];

const STATUS_OPTIONS = STATUS_FILTERS.filter(
  (status) => status.value !== "ALL",
);

function getSupportCaseOpenerRole(supportCase) {
  const openerParticipant = supportCase.conversation?.participants?.find(
    (participant) => participant.userId === supportCase.openedById,
  );

  if (openerParticipant?.roleInChat === "BUYER") {
    return "Buyer";
  }

  if (openerParticipant?.roleInChat === "SELLER") {
    return "Seller";
  }

  if (String(supportCase.order?.buyerId) === String(supportCase.openedById)) {
    return "Buyer";
  }

  if (String(supportCase.order?.sellerId) === String(supportCase.openedById)) {
    return "Seller";
  }

  return "User";
}

function formatEnumLabel(value) {
  if (!value) {
    return "-";
  }

  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatCaseDate(date) {
  if (!date) {
    return "-";
  }

  const parsedDate = new Date(date);

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

export {
  formatCaseDate,
  formatEnumLabel,
  getSupportCaseOpenerRole,
  STATUS_FILTERS,
  STATUS_OPTIONS,
};
