import { authApi } from "./axios";

export const getAllCategoriesForUser = async () => {
  const response = await authApi.get("/categories");

  return response.data.data;
};

export const getAllCategoriesAdmin = async () => {
  const response = await authApi.get("/categories/admin", {
    globalLoading: false,
  });

  return response.data.data;
};

export const createCategory = async (payload) => {
  const response = await authApi.post("/categories", payload);

  return response.data;
};

export const updateCategory = async (id, payload) => {
  const response = await authApi.patch(`/categories/${id}`, payload);

  return response.data;
};

// export const updateCategoryStatus = async (id, isActive) => {
//   const response = await mainApi.patch(`/categories/${id}/status`, {
//     isActive,
//   });

//   return response.data;
// };
