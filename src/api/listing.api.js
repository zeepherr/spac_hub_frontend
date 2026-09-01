import { authApi, publicApi } from "./axios";

// AI identify product from image
export const identifyProduct = async (image) => {
  const formData = new FormData();

  formData.append("image", image);

  const response = await authApi.post("/listings/identify-product", formData);

  return response.data;
};

// Create draft listing
export const createListing = async (payload) => {
  const response = await authApi.post("/listings", payload);

  return response.data;
};

// Get seller's listings
export const getMyListings = async () => {
  const response = await authApi.get("/listings/mine", {
    globalLoading: false,
  });

  return response.data.data;
};

// Get one seller listing
export const getListingById = async (listingId) => {
  const response = await authApi.get(`/listings/${listingId}`, {
    globalLoading: false,
  });

  return response.data.data;
};

// Update current draft listing
export const updateListing = async (listingId, payload) => {
  const response = await authApi.patch(`/listings/${listingId}`, payload);

  return response.data;
};

// Get condition questions for listing
export const getListingConditionQuestions = async (listingId) => {
  const response = await authApi.get(
    `/listings/${listingId}/condition-questions`,
    {
      globalLoading: false,
    },
  );

  return response.data.data;
};

// Save condition answers
export const saveListingConditionAnswers = async (listingId, answers) => {
  const response = await authApi.patch(
    `/listings/${listingId}/condition-answers`,
    {
      answers,
    },
  );

  return response.data;
};

// Upload listing images
export const uploadListingImages = async (listingId, images) => {
  const formData = new FormData();

  images.forEach((image) => {
    formData.append("images", image);
  });

  const response = await authApi.post(
    `/listings/${listingId}/images`,
    formData,
  );

  return response.data;
};

// Analyze listing condition with AI
export const analyzeListingCondition = async (listingId) => {
  const response = await authApi.post(
    `/listings/${listingId}/analyze-condition`,
  );

  return response.data;
};

// Publish draft listing
export const publishListing = async (listingId) => {
  const response = await authApi.post(`/listings/${listingId}/publish`);

  return response.data;
};

export const getActiveListings = async () => {
  const response = await publicApi.get("/listings");

  return response.data.data;
};

export const getListingsByCategory = async (categoryId) => {
  const response = await publicApi.get(`/listings/category/${categoryId}`);

  return response.data.data;
};
