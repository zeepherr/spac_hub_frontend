import { useMemo, useState } from "react";
import {
  ClipboardCheck,
  LoaderCircle,
  RefreshCw,
  Search,
  X,
} from "lucide-react";

import { useAdminOrders } from "@/hook/order/useAdminOrder";
import { useStartOrderInspection } from "@/hook/order/useStartOrderInspection";
import { useCompleteOrderInspection } from "@/hook/order/useCompleteOrderInspection";

function getProductName(order) {
  return order.listing?.title || "-";
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
  return `฿${Number(price || 0).toLocaleString("th-TH")}`;
}

function formatDate(date) {
  if (!date) return "-";

  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

const statusOptions = [
  {
    label: "ทั้งหมด",
    value: "ALL",
  },
  {
    label: "รอตรวจ",
    value: "INSPECTION_PENDING",
  },
  {
    label: "กำลังตรวจ",
    value: "INSPECTING",
  },
];

function Inspection() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const startInspectionMutation = useStartOrderInspection();
  const completeInspectionMutation = useCompleteOrderInspection();

  const statuses =
    status === "ALL"
      ? ["INSPECTION_PENDING", "INSPECTING"]
      : [status];

  const ordersQuery = useAdminOrders({
    statuses,
  });

  const orders = Array.isArray(ordersQuery.data)
    ? ordersQuery.data
    : ordersQuery.data?.data ?? [];

  const filteredOrders = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return orders;
    }

    return orders.filter((order) => {
      const values = [
        order.orderNumber,
        order.listing?.title,
        order.listing?.brand,
        order.listing?.model,
        order.seller?.firstName,
        order.seller?.lastName,
      ];

      return values.some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(keyword),
      );
    });
  }, [orders, search]);

  const handleStartInspection = () => {
    if (!selectedOrder) return;

    startInspectionMutation.mutate(
      {
        orderId: selectedOrder.id,
      },
      {
        onSuccess: () => {
          setSelectedOrder(null);
        },
      },
    );
  };

  const handlePassInspection = () => {
    if (!selectedOrder) return;

    completeInspectionMutation.mutate(
      {
        orderId: selectedOrder.id,

        payload: {
          result: "PASSED",
          verifiedCondition: "LIKE_NEW",
          verifiedScore: 92,
          notes: "Product matches the listing.",
        },
      },
      {
        onSuccess: () => {
          setSelectedOrder(null);
        },
      },
    );
  };

  const isMutationPending =
    startInspectionMutation.isPending ||
    completeInspectionMutation.isPending;

  return (
    <div className="min-h-screen bg-[#F5F5F4] p-8">
      <div className="w-full">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100">
              <ClipboardCheck
                size={23}
                className="text-orange-500"
              />
            </div>

            <div>
              <h1 className="text-2xl font-semibold text-neutral-900">
                รอตรวจสภาพ
              </h1>

              <p className="mt-1 text-sm text-neutral-500">
                ตรวจสอบสภาพสินค้าที่ได้รับจากผู้ขาย
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => ordersQuery.refetch()}
            disabled={ordersQuery.isFetching}
            className="flex h-11 items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-700 shadow-sm transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
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

        {/* Filter */}
        <div className="mb-5 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="ค้นหา Order, สินค้า, Brand หรือ Model"
                className="h-11 w-full rounded-xl border border-neutral-200 bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-neutral-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setStatus(option.value)}
                  className={`h-11 rounded-xl px-5 text-sm font-medium transition ${
                    status === option.value
                      ? "bg-orange-500 text-white shadow-sm hover:bg-orange-600"
                      : "border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
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
                ไม่สามารถโหลดรายการสินค้าได้
              </p>

              <button
                type="button"
                onClick={() => ordersQuery.refetch()}
                className="mt-4 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600"
              >
                ลองอีกครั้ง
              </button>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex min-h-[500px] flex-col items-center justify-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50">
                <ClipboardCheck
                  size={25}
                  className="text-orange-400"
                />
              </div>

              <p className="font-medium text-neutral-700">
                ไม่มีสินค้ารอตรวจ
              </p>

              <p className="mt-1 text-sm text-neutral-400">
                รายการที่รับสินค้าแล้วจะแสดงที่นี่
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-fixed">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50">
                    <th className="w-[24%] px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                      ออเดอร์
                    </th>

                    <th className="w-[34%] px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                      สินค้า
                    </th>

                    <th className="w-[14%] px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                      ราคาซื้อขาย
                    </th>

                    <th className="w-[14%] px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                      สถานะ
                    </th>

                    <th className="w-[14%] px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500">
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
                        className="h-[78px] transition hover:bg-neutral-50"
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
                            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                              {coverImage ? (
                                <img
                                  src={coverImage}
                                  alt={getProductName(order)}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                  <ClipboardCheck
                                    size={19}
                                    className="text-neutral-300"
                                  />
                                </div>
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-neutral-900">
                                {order.listing?.title || "-"}
                              </p>

                              <p className="mt-1 truncate text-xs text-neutral-400">
                                {order.listing?.brand || "-"}
                                {order.listing?.model
                                  ? ` • ${order.listing.model}`
                                  : ""}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Price */}
                        <td className="px-6 py-4">
                          <span className="text-sm font-semibold text-neutral-900">
                            {formatPrice(order.agreedPrice)}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          {order.status === "INSPECTING" ? (
                            <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                              กำลังตรวจ
                            </span>
                          ) : (
                            <span className="inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600">
                              รอตรวจ
                            </span>
                          )}
                        </td>

                        {/* Action */}
                        <td className="px-6 py-4 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedOrder(order)
                            }
                            className="min-w-[140px] rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 active:bg-orange-700"
                          >
                            {order.status === "INSPECTING"
                              ? "ตรวจสอบสินค้า"
                              : "เริ่มตรวจ"}
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

      {/* Inspection Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => {
            if (!isMutationPending) {
              setSelectedOrder(null);
            }
          }}
        >
          <div
            className="w-full max-w-xl rounded-2xl bg-white shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-5">
              <div>
                <h2 className="text-xl font-semibold text-neutral-900">
                  {selectedOrder.status === "INSPECTING"
                    ? "ตรวจสอบสินค้า"
                    : "เริ่มตรวจสินค้า"}
                </h2>

                <p className="mt-1 text-sm text-neutral-500">
                  {selectedOrder.orderNumber}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                disabled={isMutationPending}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700 disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              {/* Product */}
              <div className="flex items-center gap-4 rounded-xl border border-neutral-200 p-4">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                  {getCoverImage(selectedOrder) ? (
                    <img
                      src={getCoverImage(selectedOrder)}
                      alt={selectedOrder.listing?.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <ClipboardCheck
                        className="text-neutral-300"
                        size={24}
                      />
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <p className="truncate font-semibold text-neutral-900">
                    {selectedOrder.listing?.title || "-"}
                  </p>

                  <p className="mt-1 text-sm text-neutral-500">
                    {selectedOrder.listing?.brand || "-"}
                    {selectedOrder.listing?.model
                      ? ` • ${selectedOrder.listing.model}`
                      : ""}
                  </p>

                  <p className="mt-1 text-sm font-semibold text-orange-500">
                    {formatPrice(selectedOrder.agreedPrice)}
                  </p>
                </div>
              </div>

              {/* Order Detail */}
              <div className="mt-5 grid grid-cols-2 gap-4 rounded-xl bg-neutral-50 p-4">
                <div>
                  <p className="text-xs text-neutral-400">
                    สถานะ
                  </p>

                  <p className="mt-1 text-sm font-medium text-neutral-800">
                    {selectedOrder.status === "INSPECTING"
                      ? "กำลังตรวจ"
                      : "รอตรวจ"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-neutral-400">
                    วันที่สร้าง
                  </p>

                  <p className="mt-1 text-sm font-medium text-neutral-800">
                    {formatDate(selectedOrder.createdAt)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-neutral-400">
                    ผู้ขาย
                  </p>

                  <p className="mt-1 text-sm font-medium text-neutral-800">
                    {`${selectedOrder.seller?.firstName ?? ""} ${
                      selectedOrder.seller?.lastName ?? ""
                    }`.trim() || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-neutral-400">
                    ราคาซื้อขาย
                  </p>

                  <p className="mt-1 text-sm font-semibold text-neutral-800">
                    {formatPrice(selectedOrder.agreedPrice)}
                  </p>
                </div>
              </div>

              {/* Inspection Area */}
              {selectedOrder.status === "INSPECTING" && (
                <div className="mt-5 rounded-xl border border-orange-100 bg-orange-50/50 p-4">
                  <p className="text-sm font-semibold text-neutral-800">
                    ผลการตรวจสินค้า
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-neutral-500">
                        Condition
                      </p>

                      <p className="mt-1 text-sm font-medium text-neutral-900">
                        LIKE_NEW
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-neutral-500">
                        Score
                      </p>

                      <p className="mt-1 text-sm font-medium text-neutral-900">
                        92 / 100
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 text-xs text-neutral-500">
                    หมายเหตุ
                  </p>

                  <p className="mt-1 text-sm text-neutral-800">
                    Product matches the listing.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t border-neutral-200 px-6 py-5">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                disabled={isMutationPending}
                className="rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-600 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                ยกเลิก
              </button>

              {selectedOrder.status ===
                "INSPECTION_PENDING" && (
                <button
                  type="button"
                  onClick={handleStartInspection}
                  disabled={startInspectionMutation.isPending}
                  className="min-w-[140px] rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {startInspectionMutation.isPending
                    ? "กำลังเริ่มตรวจ..."
                    : "เริ่มตรวจ"}
                </button>
              )}

              {selectedOrder.status === "INSPECTING" && (
                <button
                  type="button"
                  onClick={handlePassInspection}
                  disabled={
                    completeInspectionMutation.isPending
                  }
                  className="min-w-[140px] rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {completeInspectionMutation.isPending
                    ? "กำลังบันทึก..."
                    : "ผ่านการตรวจ"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inspection;