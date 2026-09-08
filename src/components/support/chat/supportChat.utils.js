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

function formatMessageTime(date) {
  if (!date) {
    return "";
  }
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsedDate);
}

export { formatEnumLabel, formatMessageTime };
