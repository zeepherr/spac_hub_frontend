import { getAdminSupportCaseById } from "@/api/support.api";
import { useQuery } from "@tanstack/react-query";

import { supportKeys } from "./supportKeys";

export const useAdminSupportCaseById = (supportCaseId) => {
  const parsedSupportCaseId = Number(supportCaseId);

  const isValidSupportCaseId =
    Number.isInteger(parsedSupportCaseId) && parsedSupportCaseId > 0;

  return useQuery({
    queryKey: supportKeys.adminDetail(parsedSupportCaseId),

    queryFn: () => getAdminSupportCaseById(parsedSupportCaseId),

    enabled: isValidSupportCaseId,

    staleTime: 15 * 1000,

    retry: false,
  });
};
