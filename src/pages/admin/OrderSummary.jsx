import { useMemo, useState } from "react";
import {
  LoaderCircle,
  PackageCheck,
  RefreshCw,
  RotateCcw,
  Search,
  Truck,
} from "lucide-react";

import { useAdminOrders } from "@/hook/order/useAdminOrder";

function OrderSummary() {
  const [search, setSearch] = useState("");

  /*
   * SHIPPING_TO_BUYER
   * = Admin ส่งสินค้าให้ Buyer แล้ว
   *
   * COMPLETED
   * = Buyer ได้รับสินค้าแล้ว
   *
   * REJECTED
   * = ใช้สำหรับค้นหา ADMIN_TO_SELLER shipment
   */
  const ordersQuery = useAdminOrders({
    statuses: [
      "SHIPPING_TO_BUYER",
      "COMPLETED",
      "REJECTED",
    ],
  });

  const orders = ordersQuery.data ?? [];

  /*
   * ================================
   * จัดส่งสินค้าให้ Buyer แล้ว
   * ================================
   */
  const shippedToBuyerOrders = useMemo(() => {
    return orders
      .map((order) => {
        const shipment =
          order.shipments?.find(
            (shipment) =>
              shipment.shipmentType ===
              "ADMIN_TO_BUYER",
          );

        if (!shipment) return null;

        return {
          ...order,
          summaryShipment: shipment,
        };
      })
      .filter(Boolean);
  }, [orders]);

  /*
   * ================================
   * ส่งคืน Seller แล้ว
   * ================================
   */
  const returnedToSellerOrders =
    useMemo(() => {
      return orders
        .map((order) => {
          const shipment =
            order.shipments?.find(
              (shipment) =>
                shipment.shipmentType ===
                "ADMIN_TO_SELLER",
            );

          if (!shipment) return null;

          return {
            ...order,
            summaryShipment: shipment,
          };
        })
        .filter(Boolean);
    }, [orders]);

  /*
   * ================================
   * SEARCH
   * ================================
   */
  const matchesSearch = (order) => {
    const keyword =
      search.trim().toLowerCase();

    if (!keyword) return true;

    const listing = order.listing;
    const shipment =
      order.summaryShipment;

    return (
      order.orderNumber
        ?.toLowerCase()
        .includes(keyword) ||
      listing?.title
        ?.toLowerCase()
        .includes(keyword) ||
      listing?.brand
        ?.toLowerCase()
        .includes(keyword) ||
      listing?.model
        ?.toLowerCase()
        .includes(keyword) ||
      shipment?.carrier
        ?.toLowerCase()
        .includes(keyword) ||
      shipment?.trackingNumber
        ?.toLowerCase()
        .includes(keyword)
    );
  };

  const filteredBuyerOrders = useMemo(
    () =>
      shippedToBuyerOrders.filter(
        matchesSearch,
      ),
    [shippedToBuyerOrders, search],
  );

  const filteredSellerOrders = useMemo(
    () =>
      returnedToSellerOrders.filter(
        matchesSearch,
      ),
    [returnedToSellerOrders, search],
  );

  if (ordersQuery.isPending) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <LoaderCircle
          size={30}
          className="animate-spin text-orange-500"
        />

        <span className="ml-3 text-sm text-neutral-500">
          กำลังโหลดข้อมูล...
        </span>
      </div>
    );
  }

  if (ordersQuery.isError) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-red-500">
            ไม่สามารถโหลดข้อมูลได้
          </p>

          <button
            type="button"
            onClick={() =>
              ordersQuery.refetch()
            }
            className="mt-4 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600"
          >
            ลองใหม่
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F4] px-6 py-6">
      <div className="mx-auto w-full max-w-[1500px]">
        {/* HEADER */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100">
              <PackageCheck
                size={22}
                className="text-orange-500"
              />
            </div>

            <div>
              <h1 className="text-xl font-semibold text-neutral-900">
                สรุปการจัดส่ง
              </h1>

              <p className="mt-1 text-xs text-neutral-500">
                รวมรายการสินค้าที่จัดส่งให้ผู้ซื้อ
                และสินค้าที่ส่งคืนให้ผู้ขายแล้ว
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              ordersQuery.refetch()
            }
            disabled={
              ordersQuery.isFetching
            }
            className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 shadow-sm transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={
                ordersQuery.isFetching
                  ? "animate-spin"
                  : ""
              }
            />

            รีเฟรช
          </button>
        </div>

        {/* SEARCH */}
        <div className="mb-6 rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm">
          <div className="relative">
            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
              placeholder="ค้นหา Order, สินค้า, Brand, Model, บริษัทขนส่ง หรือเลขพัสดุ"
              className="h-11 w-full rounded-xl border border-neutral-200 bg-white pl-11 pr-4 text-sm text-neutral-800 outline-none transition placeholder:text-neutral-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
          </div>
        </div>

        {/* BUYER TABLE */}
        <SummarySection
          type="BUYER"
          title="จัดส่งสินค้าแล้ว"
          description="รายการสินค้าที่จัดส่งให้ผู้ซื้อแล้ว"
          orders={
            filteredBuyerOrders
          }
        />

        {/* SELLER TABLE */}
        <div className="mt-6">
          <SummarySection
            type="SELLER"
            title="ส่งคืนผู้ขายแล้ว"
            description="รายการสินค้าที่ไม่ผ่านการตรวจและส่งคืนให้ผู้ขายแล้ว"
            orders={
              filteredSellerOrders
            }
          />
        </div>
      </div>
    </div>
  );
}

function SummarySection({
  type,
  title,
  description,
  orders,
}) {
  const isBuyer = type === "BUYER";

  return (
    <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
      {/* SECTION HEADER */}
      <div
        className={`flex items-center justify-between px-6 py-5 ${
          isBuyer
            ? "bg-orange-50"
            : "bg-red-50"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl ${
              isBuyer
                ? "bg-orange-100"
                : "bg-red-100"
            }`}
          >
            {isBuyer ? (
              <Truck
                size={21}
                className="text-orange-500"
              />
            ) : (
              <RotateCcw
                size={21}
                className="text-red-500"
              />
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold text-neutral-900">
              {title}
            </h2>

            <p className="mt-1 text-xs text-neutral-500">
              {description}
            </p>
          </div>
        </div>

        <span
          className={`rounded-full px-4 py-1.5 text-xs font-semibold ${
            isBuyer
              ? "bg-orange-100 text-orange-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {orders.length} รายการ
        </span>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50/60 text-left">
              <th className="px-6 py-4 text-xs font-semibold text-neutral-500">
                ออเดอร์
              </th>

              <th className="px-6 py-4 text-xs font-semibold text-neutral-500">
                สินค้า
              </th>

              <th className="px-6 py-4 text-xs font-semibold text-neutral-500">
                ราคาซื้อขาย
              </th>

              <th className="px-6 py-4 text-xs font-semibold text-neutral-500">
                บริษัทขนส่ง
              </th>

              <th className="px-6 py-4 text-xs font-semibold text-neutral-500">
                เลขพัสดุ
              </th>

              <th className="px-6 py-4 text-xs font-semibold text-neutral-500">
                สถานะพัสดุ
              </th>

              <th className="px-6 py-4 text-xs font-semibold text-neutral-500">
                วันที่จัดส่ง
              </th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-14 text-center"
                >
                  {isBuyer ? (
                    <Truck
                      size={34}
                      className="mx-auto text-neutral-300"
                    />
                  ) : (
                    <RotateCcw
                      size={34}
                      className="mx-auto text-neutral-300"
                    />
                  )}

                  <p className="mt-3 text-sm font-medium text-neutral-500">
                    {isBuyer
                      ? "ยังไม่มีรายการจัดส่งสินค้า"
                      : "ยังไม่มีรายการส่งคืนผู้ขาย"}
                  </p>

                  <p className="mt-1 text-xs text-neutral-400">
                    รายการที่ดำเนินการแล้วจะแสดงที่นี่
                  </p>
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <SummaryRow
                  key={order.id}
                  order={order}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function SummaryRow({ order }) {
  const listing = order.listing;
  const shipment =
    order.summaryShipment;

  const images =
    listing?.images ?? [];

  const coverImage =
    images.find(
      (image) => image.isCover,
    )?.imageUrl ||
    images[0]?.imageUrl ||
    null;

  return (
    <tr className="border-b border-neutral-100 last:border-b-0 transition hover:bg-neutral-50/60">
      {/* ORDER */}
      <td className="px-6 py-4">
        <div className="min-w-[210px]">
          <p className="text-sm font-semibold text-neutral-900">
            {order.orderNumber}
          </p>

          <p className="mt-1 text-xs text-neutral-400">
            {formatDate(
              order.createdAt,
            )}
          </p>
        </div>
      </td>

      {/* PRODUCT */}
      <td className="px-6 py-4">
        <div className="flex min-w-[260px] items-center gap-3">
          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100">
            {coverImage ? (
              <img
                src={coverImage}
                alt={
                  listing?.title ||
                  "Product"
                }
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
            <p className="max-w-[220px] truncate text-sm font-medium text-neutral-900">
              {listing?.title || "-"}
            </p>

            <p className="mt-1 max-w-[220px] truncate text-xs text-neutral-400">
              {listing?.brand || "-"}

              {listing?.category?.name
                ? ` • ${listing.category.name}`
                : ""}
            </p>
          </div>
        </div>
      </td>

      {/* PRICE */}
      <td className="px-6 py-4">
        <p className="whitespace-nowrap text-sm font-semibold text-neutral-900">
          {formatPrice(
            order.agreedPrice,
          )}
        </p>
      </td>

      {/* CARRIER */}
      <td className="px-6 py-4">
        <p className="whitespace-nowrap text-sm text-neutral-700">
          {shipment?.carrier || "-"}
        </p>
      </td>

      {/* TRACKING */}
      <td className="px-6 py-4">
        <p className="whitespace-nowrap font-mono text-sm font-medium text-neutral-900">
          {shipment?.trackingNumber ||
            "-"}
        </p>
      </td>

      {/* STATUS */}
      <td className="px-6 py-4">
        <ShipmentStatusBadge
          status={shipment?.status}
        />
      </td>

      {/* SHIPPED DATE */}
      <td className="px-6 py-4">
        <p className="min-w-[150px] text-sm text-neutral-600">
          {formatDate(
            shipment?.shippedAt ||
              shipment?.createdAt,
          )}
        </p>
      </td>
    </tr>
  );
}

function ShipmentStatusBadge({
  status,
}) {
  const statusConfig = {
    PENDING: {
      label: "รอดำเนินการ",
      className:
        "bg-neutral-100 text-neutral-600",
    },

    SHIPPED: {
      label: "จัดส่งแล้ว",
      className:
        "bg-blue-100 text-blue-600",
    },

    IN_TRANSIT: {
      label: "กำลังขนส่ง",
      className:
        "bg-blue-100 text-blue-600",
    },

    DELIVERED: {
      label: "จัดส่งสำเร็จ",
      className:
        "bg-green-100 text-green-700",
    },

    FAILED: {
      label: "จัดส่งไม่สำเร็จ",
      className:
        "bg-red-100 text-red-600",
    },
  };

  const config =
    statusConfig[status] ?? {
      label: status || "-",
      className:
        "bg-neutral-100 text-neutral-600",
    };

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
}

function formatPrice(price) {
  return `฿${Number(
    price || 0,
  ).toLocaleString("th-TH")}`;
}

function formatDate(date) {
  if (!date) return "-";

  return new Intl.DateTimeFormat(
    "th-TH",
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  ).format(new Date(date));
}

export default OrderSummary;