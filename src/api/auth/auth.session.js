import { fetchMe, refresh } from "@/api/auth/auth.api";
import { clearLogoutMarker } from "@/lib/clear.client.session";
import useAuthStore from "@/stores/auth.store";

let restorePromise = null;

export async function establishSession(payload) {
  const { accessToken, user: responseUser } = payload;

  if (!accessToken) {
    throw new Error("Login response did not return an access token");
  }

  const auth = useAuthStore.getState();

  try {
    auth.setAccessToken(accessToken);

    let user = responseUser;

    if (!user) {
      const me = await fetchMe();
      user = me;
    }

    if (!user) {
      throw new Error("Unable to establish the authenticated user");
    }
    clearLogoutMarker();
    auth.setSession({
      accessToken,
      user,
    });

    return user;
  } catch (error) {
    auth.clearSession();
    throw error;
  }
}

export function restoreSession() {
  if (restorePromise) {
    return restorePromise;
  }

  restorePromise = runRestoreSession();

  return restorePromise;
}

async function runRestoreSession() {
  try {
    const { accessToken, user: refreshUser } = await refreshAccessToken();

    let user = refreshUser;

    if (!user) {
      const me = await fetchMe();
      user = me;
    }

    useAuthStore.getState().setSession({
      accessToken,
      user,
    });
  } catch {
    useAuthStore.getState().clearSession();
  } finally {
    restorePromise = null;
  }
}

let refreshPromise = null;

export function refreshAccessToken() {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = runRefresh();

  return refreshPromise;
}

async function runRefresh() {
  try {
    const payload = await refresh();

    const { accessToken, user } = payload;

    if (!accessToken) {
      throw new Error("Refresh response did not return an access token");
    }

    const auth = useAuthStore.getState();

    auth.setAccessToken(accessToken);

    if (user) {
      auth.setUser(user);
    }

    return {
      accessToken,
      user,
    };
  } finally {
    refreshPromise = null;
  }
}
