import { useMutation,useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { confirmOrderDelivery } from "@/api/order.api";
import { orderKeys } from "./orderKeys";

export function useConfirmOrderDelivery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId }) => {
      return confirmOrderDelivery(orderId);
    },

    onSuccess: async (response,variables) => {
      const { orderId } = variables;

      /* โหลดรายการคำสั่งซื้อทั้งหมดใหม่ */
      await queryClient.invalidateQueries({
        queryKey: orderKeys.buying(),
      });

      /* โหลดรายละเอียด Order นี้ใหม่ */
      await queryClient.invalidateQueries({
        queryKey:
          orderKeys.detail(orderId),
      });

      toast.success(
        response.message || "ยืนยันการรับสินค้าสำเร็จ",
      );
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message ||"ไม่สามารถยืนยันการรับสินค้าได้",
      );
    },
  });
}