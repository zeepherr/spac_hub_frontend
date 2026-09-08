import {
  connectSupportSocket,
  disconnectSupportSocket,
} from "@/lib/support.socket";
import useAuthStore from "@/stores/auth.store";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { supportKeys } from "./supportKeys";

export function useAdminSupportRealtime() {
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (!accessToken) {
      return undefined;
    }

    const socket = connectSupportSocket();

    if (!socket) {
      return undefined;
    }

    const handleCaseCreated = (response) => {
      const newSupportCase = response?.data;

      if (!response?.success || !newSupportCase) {
        return;
      }

      queryClient.setQueryData(supportKeys.adminList(), (oldSupportCases) => {
        const currentCases = Array.isArray(oldSupportCases)
          ? oldSupportCases
          : [];

        const alreadyExists = currentCases.some(
          (supportCase) => String(supportCase.id) === String(newSupportCase.id),
        );

        if (alreadyExists) {
          return currentCases;
        }

        return [newSupportCase, ...currentCases];
      });

      /*
       * Background verification against the database.
       */
      void queryClient.invalidateQueries({
        queryKey: supportKeys.adminList(),
        exact: true,
        refetchType: "active",
      });
    };

    socket.on("support:case-created", handleCaseCreated);

    return () => {
      socket.off("support:case-created", handleCaseCreated);
      disconnectSupportSocket();
    };
  }, [accessToken, queryClient]);
}
