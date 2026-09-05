import { clearClientSession } from "@/lib/clear.client.session";
import useAuthStore from "@/stores/auth.store";
import { authApi } from "../axios";
import { refreshAccessToken } from "./auth.session";
let isInstalled = false;

export function setupAuthInterceptors() {
  if (isInstalled) {
    return;
  }

  isInstalled = true;

  // Attach access token
  authApi.interceptors.request.use(
    (config) => {
      const accessToken = useAuthStore.getState().accessToken;

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      return config;
    },

    (error) => {
      return Promise.reject(error);
    },
  );

  // Handle expired access token
  authApi.interceptors.response.use(
    (response) => response,

    async (error) => {
      const originalRequest = error.config;

      const status = error.response?.status;

      if (
        status !== 401 ||
        !originalRequest ||
        originalRequest._retry ||
        originalRequest.skipAuthRefresh
      ) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const { accessToken } = await refreshAccessToken();

        originalRequest.headers = originalRequest.headers ?? {};

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return authApi(originalRequest);
      } catch (refreshError) {
        const refreshStatus = refreshError.response?.status;

        if (refreshStatus === 401 || refreshStatus === 403) {
          await clearClientSession();
        }

        return Promise.reject(refreshError);
      }
    },
  );
}

// Frontend
//    │
//    │ GET /products
//    │ Authorization: Bearer OLD_TOKEN
//    ▼
// Backend
//    │
//    │ token expired
//    ▼
// 401
//    │
//    ▼
// Axios Response Interceptor
//    │
//    │ POST /auth/refresh
//    ▼
// Backend
//    │
//    │ reads refresh cookie
//    │ validates it
//    ▼
// New Access Token
//    │
//    ▼
// Frontend
//    │
//    │ Zustand.setAccessToken(newToken)
//    │
//    │ Retry GET /products
//    │ Authorization: Bearer NEW_TOKEN
//    ▼
// Backend
//    │
//    │ token valid
//    ▼
// 200 Products
// {
//   message: "Request failed with status code 401",

//   response: {
//     status: 401,
//     data: {
//       message: "Token expired"
//     }
//   },

//   config: {
//     method: "get",
//     url: "/products",
//     baseURL: "http://localhost:3000/api/v1",

//     headers: {
//       Authorization: "Bearer abc123"
//     },

//     timeout: 0,

//     // other axios config...
//   }
// }
