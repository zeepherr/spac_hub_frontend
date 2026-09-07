import { getMySupportCaseById } from "@/api/support.api";
import { useQuery } from "@tanstack/react-query";

import { supportKeys } from "./supportKeys";

export const useMySupportCaseById = (supportCaseId) => {
  const parsedSupportCaseId = Number(supportCaseId);

  const isValidSupportCaseId =
    Number.isInteger(parsedSupportCaseId) && parsedSupportCaseId > 0;

  return useQuery({
    queryKey: supportKeys.myDetail(parsedSupportCaseId),

    queryFn: () => getMySupportCaseById(parsedSupportCaseId),

    enabled: isValidSupportCaseId,

    staleTime: 15 * 1000,

    refetchInterval: 30 * 1000,

    retry: false,
  });
};
