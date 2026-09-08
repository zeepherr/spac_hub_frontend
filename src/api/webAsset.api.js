import { authApi, publicApi } from "./axios";

/*
 * Public: homepage and authentication images.
 */
export const getWebAssets = async () => {
  const response = await publicApi.get("/web-assets", {
    globalLoading: false,
  });

  return response.data.data;
};

/*
 * Admin: upload or replace one image.
 */
export const replaceWebAssetImage = async (slot, image) => {
  const formData = new FormData();

  formData.append("image", image);

  const response = await authApi.put(`/admin/web-assets/${slot}`, formData);

  return response.data;
};

/*
 * Admin: remove one image.
 */
export const deleteWebAssetImage = async (slot) => {
  const response = await authApi.delete(`/admin/web-assets/${slot}`);

  return response.data;
};
