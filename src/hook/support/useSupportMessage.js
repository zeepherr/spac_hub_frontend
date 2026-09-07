import {
  getAdminSupportCaseMessages,
  getMySupportCaseMessages,
} from "@/api/support.api";
import { useInfiniteQuery } from "@tanstack/react-query";

import { supportKeys } from "./supportKeys";

const useSupportMessages = ({ supportCaseId, isAdmin, limit = 50 }) => {
  const parsedSupportCaseId = Number(supportCaseId);

  const isValidSupportCaseId =
    Number.isInteger(parsedSupportCaseId) && parsedSupportCaseId > 0;

  const queryKey = isAdmin
    ? supportKeys.adminMessages(parsedSupportCaseId)
    : supportKeys.myMessages(parsedSupportCaseId);

  const requestMessages = isAdmin
    ? getAdminSupportCaseMessages
    : getMySupportCaseMessages;

  return useInfiniteQuery({
    queryKey,

    queryFn: ({ pageParam }) =>
      requestMessages(parsedSupportCaseId, {
        cursor: pageParam,
        limit,
      }),

    initialPageParam: undefined,

    getNextPageParam: (lastPage) => {
      if (!lastPage.pagination.hasNextPage) {
        return undefined;
      }

      return lastPage.pagination.nextCursor;
    },

    enabled: isValidSupportCaseId,

    staleTime: 10 * 1000,

    retry: false,
  });
};

export const useMySupportMessages = (supportCaseId, options = {}) => {
  return useSupportMessages({
    supportCaseId,
    isAdmin: false,
    ...options,
  });
};

export const useAdminSupportMessages = (supportCaseId, options = {}) => {
  return useSupportMessages({
    supportCaseId,
    isAdmin: true,
    ...options,
  });
};
