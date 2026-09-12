import {
  connectSupportSocket,
  disconnectSupportSocket,
} from "@/lib/support.socket";
import useAuthStore from "@/stores/auth.store";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { supportKeys } from "./supportKeys";

export function useUserSupportRealtime() {
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
      const supportCase = response?.data;

      if (!response?.success || !supportCase?.id) {
        return;
      }

      queryClient.setQueryData(supportKeys.myList(), (oldCases) => {
        const currentCases = Array.isArray(oldCases) ? oldCases : [];

        const withoutDuplicate = currentCases.filter(
          (item) => String(item.id) !== String(supportCase.id),
        );

        return [supportCase, ...withoutDuplicate];
      });

      queryClient.setQueryData(
        supportKeys.myDetail(supportCase.id),
        supportCase,
      );

      void queryClient.invalidateQueries({
        queryKey: supportKeys.myList(),
        exact: true,
        refetchType: "active",
      });
    };

    const handleCaseUpdated = (response) => {
      const update = response?.data;

      if (!response?.success || !update?.id) {
        return;
      }

      /*
       * Backend's case-updated event may be a partial object
       * when it comes from a new message.
       *
       * Refetching keeps the cache shape correct.
       */
      void queryClient.invalidateQueries({
        queryKey: supportKeys.myList(),
        exact: true,
        refetchType: "active",
      });

      void queryClient.invalidateQueries({
        queryKey: supportKeys.myDetail(update.id),
        exact: true,
        refetchType: "active",
      });
    };

    socket.on("support:case-created", handleCaseCreated);

    socket.on("support:case-updated", handleCaseUpdated);

    return () => {
      socket.off("support:case-created", handleCaseCreated);

      socket.off("support:case-updated", handleCaseUpdated);

      disconnectSupportSocket();
    };
  }, [accessToken, queryClient]);
}
