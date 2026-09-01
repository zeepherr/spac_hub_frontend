import { authApi, publicApi } from "../axios";

export const login = async (payload) => {
  const response = await publicApi.post("/auth/login", payload);
  return response.data;
};

export const registerUser = async (payload) => {
  const response = await publicApi.post("/auth/register", payload);
  return response.data;
};

export const logout = async () => {
  const response = await publicApi.post("/auth/logout");
  return response.data;
};

export async function fetchMe() {
  const response = await authApi.get("/auth/me");

  return response.data;
}

export async function refresh() {
  const response = await publicApi.post(
    "/auth/refresh",
    {},
    {
      skipAuthRefresh: true,
    },
  );

  return response.data;
}
export const verifyRegistrationEmail = async (payload) => {
  const response = await publicApi.post("/auth/register/verify", payload);

  return response.data;
};

export const resendRegistrationOtp = async (payload) => {
  const response = await publicApi.post("/auth/register/resend", payload);

  return response.data;
};



export const getMe = async () => {
  const response = await authApi.get("/user/me");

  return response.data;
};

export const updateMe = async (formData) => {
  const response = await authApi.patch(
    "/user/me",
    formData,
  );

  return response.data;
};