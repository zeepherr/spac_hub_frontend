import { authApi } from "./axios";

/*
 * Buyer/Seller creates an Order Support Case.
 *
 * payload:
 * {
 *   orderId: number,
 *   issueType:
 *     | "PRODUCT_NOT_AS_DESCRIBED"
 *     | "PAYMENT"
 *     | "SHIPPING"
 *     | "DAMAGED_PRODUCT"
 *     | "SELLER_NOT_RESPONDING"
 *     | "BUYER_NOT_RESPONDING"
 *     | "OTHER",
 *   message: string
 * }
 */
export const createSupportCase = async (payload) => {
  const response = await authApi.post("/support-cases", payload);

  /*
   * Returns the full response because the frontend needs:
   *
   * response.data
   * response.message
   * response.meta.created
   */
  return response.data;
};

/*
 * Buyer/Seller: get only their own Support Cases.
 */
export const getMySupportCases = async () => {
  const response = await authApi.get("/support-cases", {
    globalLoading: false,
  });

  return response.data.data;
};

/*
 * Buyer/Seller: get one owned Support Case.
 */
export const getMySupportCaseById = async (supportCaseId) => {
  const response = await authApi.get(`/support-cases/${supportCaseId}`, {
    globalLoading: false,
  });

  return response.data.data;
};

/*
 * Buyer/Seller: get paginated message history.
 */
export const getMySupportCaseMessages = async (
  supportCaseId,
  { cursor, limit = 50 } = {},
) => {
  const response = await authApi.get(
    `/support-cases/${supportCaseId}/messages`,
    {
      params: {
        ...(cursor ? { cursor } : {}),
        limit,
      },

      globalLoading: false,
    },
  );

  return {
    messages: response.data.data,
    pagination: response.data.pagination,
  };
};

/*
 * Admin: get the complete Support Case queue.
 *
 * The current Backend route does not support
 * status/search query parameters yet.
 */
export const getAdminSupportCases = async () => {
  const response = await authApi.get("/admin/support-cases", {
    globalLoading: false,
  });

  return response.data.data;
};

/*
 * Admin: get one Support Case detail.
 */
export const getAdminSupportCaseById = async (supportCaseId) => {
  const response = await authApi.get(`/admin/support-cases/${supportCaseId}`, {
    globalLoading: false,
  });

  return response.data.data;
};

/*
 * Admin: get paginated message history.
 */
export const getAdminSupportCaseMessages = async (
  supportCaseId,
  { cursor, limit = 50 } = {},
) => {
  const response = await authApi.get(
    `/admin/support-cases/${supportCaseId}/messages`,
    {
      params: {
        ...(cursor ? { cursor } : {}),
        limit,
      },

      globalLoading: false,
    },
  );

  return {
    messages: response.data.data,
    pagination: response.data.pagination,
  };
};

/*
 * Admin updates the Support Case status.
 *
 * payload:
 * {
 *   status:
 *     | "OPEN"
 *     | "INVESTIGATING"
 *     | "WAITING_FOR_BUYER"
 *     | "WAITING_FOR_SELLER"
 *     | "RESOLVED"
 *     | "CLOSED",
 *   resolutionNote?: string
 * }
 */
export const updateAdminSupportCaseStatus = async (supportCaseId, payload) => {
  const response = await authApi.patch(
    `/admin/support-cases/${supportCaseId}/status`,
    payload,
  );

  return response.data;
};
