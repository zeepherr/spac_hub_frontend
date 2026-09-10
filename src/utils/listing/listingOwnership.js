export function isListingOwnedBy(listing, userId) {
  if (!listing || !userId) return false;

  const sellerId = listing.sellerId ?? listing.seller?.id;

  return sellerId != null && String(sellerId) === String(userId);
}
