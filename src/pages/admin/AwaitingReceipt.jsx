import { useMemo, useState } from "react";
import { LoaderCircle, Package, RefreshCw, Search, X } from "lucide-react";

import { useAdminOrders } from "@/hook/order/useAdminOrder";
import { useReceiveOrderFromSeller } from "@/hook/order/useReceiveOrderFromSeller";

function getSellerShipment(order) {
  return order.shipments?.find(
    (shipment) => shipment.shipmentType === "SELLER_TO_ADMIN",
  );
}

function getSellerName(order) {
  const firstName = order.seller?.firstName ?? "";
  const lastName = order.seller?.lastName ?? "";

  return `${firstName} ${lastName}`.trim() || "-";
}

function getCoverImage(order) {
  const images = order.listing?.images ?? [];

  return (
    images.find((image) => image.isCover)?.imageUrl ||
    images[0]?.imageUrl ||
    null
  );
}

function formatPrice(price) {
  return `฿${Number(price ?? 0).toLocaleString("th-TH")}`;
}

function formatDate(date) {
  if (!date) return "-";

  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

function getShipmentStatus(status) {
  switch (status) {
    case "DELIVERED":
      return {
        label: "จัดส่งถึงแล้ว",
        className: "bg-green-100 text-green-700",
      };

    case "SHIPPED":
      return {
        label: "อยู่ระหว่างขนส่ง",
        className: "bg-blue-100 text-blue-700",
      };

    default:
      return {
        label: status || "รอการจัดส่ง",
        className: "bg-neutral-100 text-neutral-600",
      };
  }
}

function AwaitingReceipt() {
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const ordersQuery = useAdminOrders({
    statuses: ["SELLER_SHIPPING"],
  });

  const orders = Array.isArray(ordersQuery.data)
    ? ordersQuery.data
    : (ordersQuery.data?.data ?? []);

  const filteredOrders = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return orders;
    }

    return orders.filter((order) => {
      const shipment = getSellerShipment(order);

      const values = [
        order.orderNumber,
        order.listing?.title,
        order.listing?.brand,
        order.listing?.model,
        order.seller?.firstName,
        order.seller?.lastName,
        order.seller?.email,
        shipment?.carrier,
        shipment?.trackingNumber,
      ];

      return values.some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(keyword),
      );
    });
  }, [orders, search]);

  return (
    <div className="min-h-screen bg-[#F5F5F4] p-8">
      <div className="w-full">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100">
              <Package size={23} className="text-orange-500" />
            </div>

            <div>
              <h1 className="text-2xl font-semibold text-neutral-900">
                พัสดุรอสแกนรับ
              </h1>

              <p className="mt-1 text-sm text-neutral-500">
                ตรวจสอบพัสดุที่ผู้ขายจัดส่งมายังศูนย์ตรวจสอบ
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => ordersQuery.refetch()}
            disabled={ordersQuery.isFetching}
            className="flex h-11 items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-700 shadow-sm transition hover:bg-neutral-50 disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={ordersQuery.isFetching ? "animate-spin" : ""}
            />
            รีเฟรช
          </button>
        </div>

        {/* Search */}
        <div className="mb-5 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="ค้นหา Order, สินค้า, ผู้ขาย หรือเลข Tracking"
              className="h-11 w-full rounded-xl border border-neutral-200 bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-neutral-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
          </div>
        </div>

        {/* Table */}
        <div className="w-full overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
          {ordersQuery.isPending ? (
            <div className="flex min-h-[500px] items-center justify-center">
              <LoaderCircle
                size={28}
                className="animate-spin text-orange-500"
              />

              <span className="ml-3 text-sm text-neutral-500">
                กำลังโหลดรายการ...
              </span>
            </div>
          ) : ordersQuery.isError ? (
            <div className="flex min-h-[500px] flex-col items-center justify-center">
              <p className="text-sm font-medium text-red-500">
                ไม่สามารถโหลดรายการพัสดุได้
              </p>

              <button
                type="button"
                onClick={() => ordersQuery.refetch()}
                className="mt-4 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600"
              >
                ลองอีกครั้ง
              </button>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex min-h-[500px] flex-col items-center justify-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50">
                <Package size={25} className="text-orange-400" />
              </div>

              <p className="font-medium text-neutral-700">
                ไม่มีพัสดุรอสแกนรับ
              </p>

              <p className="mt-1 text-sm text-neutral-400">
                พัสดุที่ผู้ขายกำลังจัดส่งจะแสดงที่นี่
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-fixed">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50">
                    <th className="w-[21%] px-6 py-4 text-left text-xs font-semibold text-neutral-500">
                      Order
                    </th>

                    <th className="w-[23%] px-6 py-4 text-left text-xs font-semibold text-neutral-500">
                      สินค้า
                    </th>

                    <th className="w-[19%] px-6 py-4 text-left text-xs font-semibold text-neutral-500">
                      ผู้ขาย
                    </th>

                    <th className="w-[17%] px-6 py-4 text-left text-xs font-semibold text-neutral-500">
                      การจัดส่ง
                    </th>

                    <th className="w-[10%] px-6 py-4 text-left text-xs font-semibold text-neutral-500">
                      สถานะ
                    </th>

                    <th className="w-[10%] px-6 py-4 text-right text-xs font-semibold text-neutral-500">
                      จัดการ
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-neutral-100">
                  {filteredOrders.map((order) => {
                    const shipment = getSellerShipment(order);
                    const coverImage = getCoverImage(order);
                    const shipmentStatus = getShipmentStatus(shipment?.status);

                    return (
                      <tr
                        key={order.id}
                        className="h-[90px] transition hover:bg-neutral-50"
                      >
                        {/* Order */}
                        <td className="px-6 py-4">
                          <p className="truncate text-sm font-semibold text-neutral-900">
                            {order.orderNumber}
                          </p>

                          {/* <p className="mt-1 text-xs text-neutral-500">
                            #{order.id}
                          </p> */}

                          <p className="mt-1 text-xs text-neutral-400">
                            {formatDate(order.createdAt)}
                          </p>
                        </td>

                        {/* Product */}
                        <td className="px-6 py-4">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                              {coverImage ? (
                                <img
                                  src={coverImage}
                                  alt={order.listing?.title}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                  <Package
                                    size={20}
                                    className="text-neutral-300"
                                  />
                                </div>
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-neutral-900">
                                {order.listing?.title || "-"}
                              </p>

                              <p className="mt-1 truncate text-xs text-neutral-500">
                                {order.listing?.brand || "-"}
                                {order.listing?.model
                                  ? ` • ${order.listing.model}`
                                  : ""}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Seller */}
                        <td className="px-6 py-4">
                          <p className="truncate text-sm font-medium text-neutral-800">
                            {getSellerName(order)}
                          </p>

                          {/* <p className="mt-1 truncate text-xs text-neutral-400">
                            {order.seller?.email || "-"}
                          </p> */}
                        </td>

                        {/* Shipping */}
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-neutral-800">
                            {shipment?.carrier || "-"}
                          </p>

                          <p className="mt-1 text-xs text-neutral-500">
                            {shipment?.trackingNumber || "-"}
                          </p>

                          {/* <span
                            className={`mt-1.5 inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${shipmentStatus.className}`}
                          >
                            {shipmentStatus.label}
                          </span> */}
                        </td>

                        {/* Order Status */}
                        <td className="px-6 py-4">
                          <span
                            className={`mt-1.5 inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${shipmentStatus.className}`}
                          >
                            {shipmentStatus.label}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="px-6 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            className="whitespace-nowrap rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 active:bg-orange-700"
                          >
                            จัดการสินค้า
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Manage Product Modal */}
      {selectedOrder && (
        <ManageProductModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}

function ManageProductModal({ order, onClose }) {
  const shipment = getSellerShipment(order);
  const coverImage = getCoverImage(order);
  const shipmentStatus = getShipmentStatus(shipment?.status);
  const receiveOrderMutation = useReceiveOrderFromSeller();

  const handleReceive = () => {
    receiveOrderMutation.mutate(
      {
        orderId: order.id,
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-5">
          <h2 className="text-xl font-semibold text-neutral-900">
            จัดการสินค้า
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {/* Product */}
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
              {coverImage ? (
                <img
                  src={coverImage}
                  alt={order.listing?.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Package size={26} className="text-neutral-300" />
                </div>
              )}
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-lg font-semibold text-neutral-900">
                {order.listing?.title || "-"}
              </h3>

              <p className="mt-1 text-sm text-neutral-500">
                {order.listing?.brand || "-"}
                {order.listing?.model ? ` • ${order.listing.model}` : ""}
              </p>

              <p className="mt-2 text-lg font-semibold text-orange-500">
                {formatPrice(order.agreedPrice)}
              </p>
            </div>
          </div>

          <div className="my-6 border-t border-neutral-200" />

          {/* Details */}
          <div className="grid grid-cols-2 gap-x-10 gap-y-4">
            <div>
              <p className="text-xs text-neutral-400">Order Number</p>

              <p className="mt-1 break-all text-sm font-medium text-neutral-800">
                {order.orderNumber}
              </p>
            </div>

            <div>
              <p className="text-xs text-neutral-400">บริษัทขนส่ง</p>

              <p className="mt-1 text-sm font-medium text-neutral-800">
                {shipment?.carrier || "-"}
              </p>
            </div>

            <div>
              <p className="text-xs text-neutral-400">เลขที่ออเดอร์</p>

              <p className="mt-1 text-sm font-medium text-neutral-800">
                #{order.id}
              </p>
            </div>

            <div>
              <p className="text-xs text-neutral-400">เลข Tracking</p>

              <p className="mt-1 text-sm font-medium text-neutral-800">
                {shipment?.trackingNumber || "-"}
              </p>
            </div>

            <div>
              <p className="text-xs text-neutral-400">วันที่สร้าง</p>

              <p className="mt-1 text-sm font-medium text-neutral-800">
                {formatDate(order.createdAt)}
              </p>
            </div>

            <div>
              <p className="text-xs text-neutral-400">สถานะการจัดส่ง</p>

              <span
                className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-medium ${shipmentStatus.className}`}
              >
                {shipmentStatus.label}
              </span>
            </div>

            <div>
              <p className="text-xs text-neutral-400">ผู้ขาย</p>

              <p className="mt-1 text-sm font-medium text-neutral-800">
                {getSellerName(order)}
              </p>

              <p className="mt-1 break-all text-xs text-neutral-400">
                {order.seller?.email || "-"}
              </p>
            </div>

            <div>
              <p className="text-xs text-neutral-400">สถานะปัจจุบัน</p>

              <span className="mt-1 inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
                ผู้ขายกำลังส่ง
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-neutral-200 px-6 py-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
          >
            ยกเลิก
          </button>

          <button
            type="button"
            onClick={handleReceive}
            className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 active:bg-orange-700"
          >
            รับสินค้าแล้ว
          </button>
        </div>
      </div>
    </div>
  );
}

export default AwaitingReceipt;
