import { create } from "zustand";

const useAuthStore = create((set) => ({
  accessToken: null,
  user: null,
  setAccessToken: (accessToken) => {
    set({ accessToken });
  },
  setUser: (user) => {
    set({ user });
  },
  // checking | authenticated | guest
  status: "authenticated", // later will be set checking

  setSession: ({ accessToken, user }) => {
    set({
      accessToken,
      user,
      status: "authenticated",
    });
  },

  setChecking: () => {
    set({
      status: "checking",
    });
  },

  clearSession: () => {
    set({
      accessToken: null,
      user: null,
      status: "guest",
    });
  },
}));

export default useAuthStore;
