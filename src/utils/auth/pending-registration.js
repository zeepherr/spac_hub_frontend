const PENDING_REGISTRATION_KEY = "pendingRegistration";

export function savePendingRegistration(data) {
  sessionStorage.setItem(
    PENDING_REGISTRATION_KEY,
    JSON.stringify({
      email: data.email,
      expiresAt: data.expiresAt,
      resendAvailableAt: data.resendAvailableAt,
    }),
  );
}

export function getPendingRegistration() {
  const value = sessionStorage.getItem(PENDING_REGISTRATION_KEY);

  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export function clearPendingRegistration() {
  sessionStorage.removeItem(PENDING_REGISTRATION_KEY);
}
