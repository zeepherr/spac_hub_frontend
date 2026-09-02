//โหลดข้อมูลผู้ใช้

import { useQuery } from "@tanstack/react-query";

import { getMe } from "@/api/auth/auth.api";
import { userKeys } from "./userKeys";

export function useUserProfile() {
  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: getMe,
  });
}