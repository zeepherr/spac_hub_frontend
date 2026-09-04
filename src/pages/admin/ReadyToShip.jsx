import { useMemo, useState } from "react";
import {
  LoaderCircle,
  PackageCheck,
  RefreshCw,
  Search,
  X,
} from "lucide-react";

import { useAdminOrders } from "@/hook/order/useAdminOrder";
import { useShipOrderToBuyer } from "@/hook/order/useShipOrderToBuyer";

function getBuyerName(order) {
  const firstName = order.buyer?.firstName ?? "";
  const lastName = order.buyer?.lastName ?? "";

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

function formatDate(date) {
  if (!date) return "-";

  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

function ReadyToShip() {
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const ordersQuery = useAdminOrders({
    statuses: ["VERIFIED"],
  });

  const orders = Array.isArray(ordersQuery.data)
    ? ordersQuery.data
    : ordersQuery.data?.data ?? [];

  const filteredOrders = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return orders;

    return orders.filter((order) => {
      const values = [
        order.orderNumber,
        order.listing?.title,
        order.listing?.brand,
        order.listing?.model,
        order.buyer?.firstName,
        order.buyer?.lastName,
        order.buyer?.email,
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
              <PackageCheck
                size={23}
                className="text-orange-500"
              />
            </div>

            <div>
              <h1 className="text-2xl font-semibold text-neutral-900">
                พร้อมจัดส่ง
              </h1>

              <p className="mt-1 text-sm text-neutral-500">
                สินค้าที่ผ่านการตรวจสภาพและพร้อมจัดส่งให้ผู้ซื้อ
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
              className={
                ordersQuery.isFetching ? "animate-spin" : ""
              }
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
              placeholder="ค้นหา Order, สินค้า หรือผู้ซื้อ"
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
                ไม่สามารถโหลดรายการได้
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
                <PackageCheck
                  size={25}
                  className="text-orange-400"
                />
              </div>

              <p className="font-medium text-neutral-700">
                ไม่มีสินค้าพร้อมจัดส่ง
              </p>

              <p className="mt-1 text-sm text-neutral-400">
                สินค้าที่ผ่านการตรวจสภาพจะแสดงที่นี่
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-fixed">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50">
                    <th className="w-[22%] px-6 py-4 text-left text-xs font-semibold text-neutral-500">
                      Order
                    </th>

                    <th className="w-[27%] px-6 py-4 text-left text-xs font-semibold text-neutral-500">
                      สินค้า
                    </th>

                    <th className="w-[18%] px-6 py-4 text-left text-xs font-semibold text-neutral-500">
                      ผู้ซื้อ
                    </th>

                    <th className="w-[14%] px-6 py-4 text-left text-xs font-semibold text-neutral-500">
                      ผลตรวจ
                    </th>

                    <th className="w-[9%] px-6 py-4 text-left text-xs font-semibold text-neutral-500">
                      สถานะ
                    </th>

                    <th className="w-[10%] px-6 py-4 text-right text-xs font-semibold text-neutral-500">
                      จัดการ
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-neutral-100">
                  {filteredOrders.map((order) => {
                    const coverImage = getCoverImage(order);

                    return (
                      <tr
                        key={order.id}
                        className="h-[90px] transition hover:bg-neutral-50"
                      >
                        {/* Order */}
                        <td className="px-6 py-4">
                          <p className="truncate text-sm font-semibold text-neutral-900">
                            {order.orderNumber || "-"}
                          </p>

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
                                  alt={order.listing?.title || "สินค้า"}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                  <PackageCheck
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

                        {/* Buyer */}
                        <td className="px-6 py-4">
                          <p className="truncate text-sm font-medium text-neutral-800">
                            {getBuyerName(order)}
                          </p>
                        </td>

                        {/* Inspection */}
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-neutral-800">
                            {order.inspection?.verifiedCondition || "-"}
                          </p>

                          <p className="mt-1 text-xs text-neutral-500">
                            Score:{" "}
                            {order.inspection?.verifiedScore ?? "-"}
                          </p>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span className="inline-flex whitespace-nowrap rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                            ผ่านตรวจ
                          </span>
                        </td>

                        {/* Action */}
                        <td className="px-6 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            className="whitespace-nowrap rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
                          >
                            จัดส่งสินค้า
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

      {selectedOrder && (
        <ShipToBuyerModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}

function ShipToBuyerModal({ order, onClose }) {
  const [carrier, setCarrier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");

  const shipMutation = useShipOrderToBuyer();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!carrier.trim() || !trackingNumber.trim()) {
      return;
    }

    shipMutation.mutate(
      {
        orderId: order.id,
        payload: {
          carrier: carrier.trim(),
          trackingNumber: trackingNumber.trim(),
        },
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
        className="w-full max-w-lg rounded-2xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900">
              จัดส่งสินค้า
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              {order.orderNumber}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={shipMutation.isPending}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-neutral-100"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5 p-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700">
                บริษัทขนส่ง
              </label>

              <input
                type="text"
                value={carrier}
                onChange={(event) => setCarrier(event.target.value)}
                placeholder="เช่น Kerry Express"
                disabled={shipMutation.isPending}
                className="h-11 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700">
                เลข Tracking
              </label>

              <input
                type="text"
                value={trackingNumber}
                onChange={(event) =>
                  setTrackingNumber(event.target.value)
                }
                placeholder="กรอกเลข Tracking"
                disabled={shipMutation.isPending}
                className="h-11 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <div className="rounded-xl bg-neutral-50 p-4">
              <p className="text-xs text-neutral-400">
                ผู้รับ
              </p>

              <p className="mt-1 text-sm font-medium text-neutral-800">
                {getBuyerName(order)}
              </p>

              {order.checkout?.shippingRecipientName && (
                <p className="mt-3 text-xs text-neutral-500">
                  ชื่อผู้รับ:{" "}
                  {order.checkout.shippingRecipientName}
                </p>
              )}

              {order.checkout?.shippingPhone && (
                <p className="mt-1 text-xs text-neutral-500">
                  โทร: {order.checkout.shippingPhone}
                </p>
              )}

              {order.checkout?.shippingAddress && (
                <p className="mt-1 text-xs text-neutral-500">
                  ที่อยู่: {order.checkout.shippingAddress}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-neutral-200 px-6 py-5">
            <button
              type="button"
              onClick={onClose}
              disabled={shipMutation.isPending}
              className="rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:opacity-50"
            >
              ยกเลิก
            </button>

            <button
              type="submit"
              disabled={
                shipMutation.isPending ||
                !carrier.trim() ||
                !trackingNumber.trim()
              }
              className="min-w-[130px] rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {shipMutation.isPending
                ? "กำลังจัดส่ง..."
                : "ยืนยันจัดส่ง"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReadyToShip;