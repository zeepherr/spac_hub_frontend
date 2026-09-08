import { getAdminSupportCases } from "@/api/support.api";
import { useQuery } from "@tanstack/react-query";

import { supportKeys } from "./supportKeys";

export const useAdminSupportCases = () => {
  return useQuery({
    queryKey: supportKeys.adminList(),

    queryFn: getAdminSupportCases,

    staleTime: 15 * 1000,

    /*
     * New Support Cases are created through REST.
     * There is no global Admin Socket event for new cases yet.
     */
    refetchInterval: 30 * 1000,

    retry: false,
  });
};
