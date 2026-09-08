import { getWebAssets } from "@/api/webAsset.api";
import { useQuery } from "@tanstack/react-query";

import { webAssetKeys } from "./webAssetKeys";

export const useWebAssets = () => {
  return useQuery({
    queryKey: webAssetKeys.current(),

    queryFn: getWebAssets,

    staleTime: 5 * 60 * 1000,

    retry: false,
  });
};
