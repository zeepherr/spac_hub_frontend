import { authApi } from "./axios";

export const getAllCategoriesAdmin = async () => {
  const response = await authApi.get("/categories/admin");

  return response.data.data;
};

export const createCategory = async (payload) => {
  const response = await authApi.post("/categories",payload);

  return response.data;
};

export const updateCategory = async ({id,payload}) => {
  const response = await authApi.patch(`/categories/:${id}`,payload)

  return response.data.data
};

