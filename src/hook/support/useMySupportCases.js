import { getMySupportCases } from "@/api/support.api";
import { useQuery } from "@tanstack/react-query";

import { supportKeys } from "./supportKeys";

export const useMySupportCases = () => {
  return useQuery({
    queryKey: supportKeys.myList(),

    queryFn: getMySupportCases,

    staleTime: 15 * 1000,

    /*
     * Backend currently does not broadcast
     * Support Case status changes.
     */
    refetchInterval: 30 * 1000,

    retry: false,
  });
};
