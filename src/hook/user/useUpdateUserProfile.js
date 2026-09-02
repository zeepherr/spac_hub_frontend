//อัปเดตข้อมูล

import {useMutation,useQueryClient,} from "@tanstack/react-query";
import { toast } from "sonner";

import { updateMe } from "@/api/auth/auth.api";
import useAuthStore from "@/stores/auth.store";
import { userKeys } from "./userKeys";

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();

  const setUser = useAuthStore(
    (state) => state.setUser,
  );

  return useMutation({
    mutationFn: updateMe,

    onSuccess: (response) => {
      /*
       * เปลี่ยนข้อมูล Profile ใน Query Cache
       */
      queryClient.setQueryData(
        userKeys.profile(),
        response,
      );

      /*
       * เปลี่ยนชื่อและรูปใน Sidebar
       */
      setUser(response.user);

      toast.success(
        response.message ||
          "บันทึกข้อมูลสำเร็จ",{position : "top-right"}
      );
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "ไม่สามารถบันทึกข้อมูลได้",{position : "top-right"}
      );
    },
  });
}
