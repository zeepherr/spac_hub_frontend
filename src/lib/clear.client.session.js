import { queryClient } from "@/lib/query-client";
import useAuthStore from "@/stores/auth.store";

const LOGOUT_MARKER = "spec_hub:explicit-logout";

export async function clearClientSession({ explicit = false } = {}) {
  if (explicit) {
    localStorage.setItem(LOGOUT_MARKER, "1");
  }

  await queryClient.cancelQueries();
  queryClient.clear();

  useAuthStore.getState().clearSession();
}

export function clearLogoutMarker() {
  localStorage.removeItem(LOGOUT_MARKER);
}

export function wasExplicitlyLoggedOut() {
  return localStorage.getItem(LOGOUT_MARKER) === "1";
}
