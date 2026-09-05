const PENDING_CHECKOUT_SESSION_KEY = "pendingCheckoutSession";

export function savePendingCheckoutSession(sessionId) {
  if (!sessionId) return;
  sessionStorage.setItem(
    PENDING_CHECKOUT_SESSION_KEY,
    JSON.stringify({ sessionId }),
  );
}

export function getPendingCheckoutSession() {
  const value = sessionStorage.getItem(PENDING_CHECKOUT_SESSION_KEY);

  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export function clearPendingCheckoutSession() {
  sessionStorage.removeItem(PENDING_CHECKOUT_SESSION_KEY);
}
