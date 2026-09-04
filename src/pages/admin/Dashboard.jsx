import {
  ClipboardCheck,
  LoaderCircle,
  PackageCheck,
  RefreshCw,
  ScanLine,
  TriangleAlert,
} from "lucide-react";
import { Link } from "react-router";

import { useAdminOrders } from "@/hook/order/useAdminOrder";

const summaryItems = [
  {
    title: "พัสดุรอสแกนรับ",
    statuses: ["SELLER_SHIPPING"],
    path: "/admin/orders/awaiting-receipt",
    icon: ScanLine,
  },
  {
    title: "รอตรวจสภาพ",
    statuses: ["INSPECTION_PENDING", "INSPECTING"],
    path: "/admin/orders/inspection",
    icon: ClipboardCheck,
  },
  {
    title: "พร้อมจัดส่ง",
    statuses: ["VERIFIED"],
    path: "/admin/orders/ready-to-ship",
    icon: PackageCheck,
  },
  {
    title: "ต้องดำเนินการ",
    statuses: ["NEEDS_REVIEW", "REJECTED"],
    path: "/admin/orders/action-required",
    icon: TriangleAlert,
  },
];

const dashboardStatuses = summaryItems.flatMap((item) => item.statuses);

const statusConfig = {
  SELLER_SHIPPING: {
    label: "รอสแกนรับ",
    className: "bg-orange-50 text-orange-600",
  },
  INSPECTION_PENDING: {
    label: "รอตรวจสภาพ",
    className: "bg-orange-50 text-orange-600",
  },
  INSPECTING: {
    label: "กำลังตรวจ",
    className: "bg-blue-50 text-blue-600",
  },
  VERIFIED: {
    label: "พร้อมจัดส่ง",
    className: "bg-green-50 text-green-600",
  },
  NEEDS_REVIEW: {
    label: "ต้องตรวจสอบเพิ่ม",
    className: "bg-amber-50 text-amber-700",
  },
  REJECTED: {
    label: "ตรวจไม่ผ่าน",
    className: "bg-red-50 text-red-600",
  },
};

const priceFormatter = new Intl.NumberFormat("th-TH", {
  style: "currency",
  currency: "THB",
  maximumFractionDigits: 2,
});

function formatPrice(value) {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  const amount = Number(value);

  return Number.isFinite(amount) ? priceFormatter.format(amount) : "—";
}

function getCreatedTime(order) {
  const time = Date.parse(order.createdAt);

  return Number.isNaN(time) ? 0 : time;
}

function Dashboard() {
  const ordersQuery = useAdminOrders({
    statuses: dashboardStatuses,
  });

  const orders = ordersQuery.data ?? [];
  const hasData = ordersQuery.data !== undefined;
  // console.log(orders);
  const latestOrders = [...orders]
    .sort((a, b) => getCreatedTime(b) - getCreatedTime(a))
    .slice(0, 10);

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 py-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">หน้าหลัก</h1>

          <p className="mt-1 text-sm text-gray-500">
            ภาพรวมคำสั่งซื้อที่ต้องดำเนินการโดยผู้ดูแลระบบ
          </p>
        </div>

        <button
          type="button"
          onClick={() => ordersQuery.refetch()}
          disabled={ordersQuery.isFetching}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 transition hover:border-orange-300 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={16}
            className={ordersQuery.isFetching ? "animate-spin" : ""}
          />

          {ordersQuery.isFetching ? "กำลังโหลด..." : "รีเฟรช"}
        </button>
      </div>

      {/* Error: keep previously loaded data visible */}
      {ordersQuery.isError && (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <p className="font-medium">
            {hasData
              ? "อัปเดตข้อมูลไม่สำเร็จ กำลังแสดงข้อมูลที่โหลดไว้ก่อนหน้า"
              : "โหลดข้อมูลคำสั่งซื้อไม่สำเร็จ"}
          </p>

          <p className="mt-1">
            {ordersQuery.error?.response?.data?.message ||
              "กรุณาลองกดรีเฟรชอีกครั้ง"}
          </p>
        </div>
      )}

      {/* Summary cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryItems.map((item) => {
          const Icon = item.icon;

          const count = orders.filter((order) =>
            item.statuses.includes(order.status),
          ).length;

          return (
            <Link
              key={item.title}
              to={item.path}
              className="rounded-xl border border-gray-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">{item.title}</p>

                <Icon size={19} className="text-orange-500" />
              </div>

              <div className="mt-3 text-2xl font-bold text-gray-900">
                {ordersQuery.isPending ? (
                  <LoaderCircle
                    size={24}
                    aria-label="กำลังโหลดจำนวนออเดอร์"
                    className="animate-spin text-orange-500"
                  />
                ) : hasData ? (
                  count.toLocaleString("th-TH")
                ) : (
                  "—"
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Latest orders */}
      <section className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">รายการล่าสุด</h2>

            <p className="mt-1 text-sm text-gray-500">
              คำสั่งซื้อที่รอดำเนินการ เรียงตามวันที่สร้างล่าสุด
            </p>
          </div>

          {hasData && (
            <p className="text-sm text-gray-500">
              ทั้งหมด {orders.length.toLocaleString("th-TH")} รายการ
            </p>
          )}
        </div>

        {ordersQuery.isPending ? (
          <div
            role="status"
            className="flex min-h-52 items-center justify-center gap-3"
          >
            <LoaderCircle size={26} className="animate-spin text-orange-500" />

            <p className="text-sm text-gray-500">กำลังโหลดคำสั่งซื้อ...</p>
          </div>
        ) : !hasData ? (
          <div className="px-6 py-16 text-center text-sm text-gray-500">
            ไม่สามารถแสดงข้อมูลได้ กรุณาลองใหม่
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16">
            <PackageCheck size={36} className="text-gray-300" />

            <p className="mt-3 font-medium text-gray-700">
              ยังไม่มีคำสั่งซื้อที่ต้องดำเนินการ
            </p>

            <p className="mt-1 text-sm text-gray-500">
              เมื่อผู้ขายแจ้งส่งสินค้า รายการจะแสดงที่นี่
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">คำสั่งซื้อ</th>
                    <th className="px-6 py-4 font-medium">สินค้า</th>
                    <th className="px-6 py-4 font-medium">ผู้ขาย</th>
                    <th className="px-6 py-4 font-medium">ราคา</th>
                    <th className="px-6 py-4 font-medium">สถานะ</th>
                    <th className="px-6 py-4 font-medium">จัดการ</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {latestOrders.map((order) => {
                    const status = statusConfig[order.status] ?? {
                      label: order.status || "ไม่ทราบสถานะ",
                      className: "bg-gray-100 text-gray-600",
                    };

                    const sellerName = [
                      order.seller?.firstName,
                      order.seller?.lastName,
                    ]
                      .filter(Boolean)
                      .join(" ");

                    const queue = summaryItems.find((item) =>
                      item.statuses.includes(order.status),
                    );

                    return (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-5 font-semibold text-gray-900">
                          {order.orderNumber || `#${order.id}`}
                        </td>

                        <td className="px-6 py-5 text-gray-700">
                          <p className="max-w-[260px] break-words">
                            {order.listing?.title || "ไม่พบชื่อสินค้า"}
                          </p>
                        </td>

                        <td className="px-6 py-5 text-gray-600">
                          {sellerName || "ไม่ระบุชื่อ"}
                        </td>

                        <td className="whitespace-nowrap px-6 py-5 font-medium text-gray-900">
                          {formatPrice(order.agreedPrice)}
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${status.className}`}
                          >
                            {status.label}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          {queue ? (
                            <Link
                              to={queue.path}
                              className="whitespace-nowrap font-medium text-orange-500 hover:text-orange-600 hover:underline"
                            >
                              ไปหน้าจัดการ
                            </Link>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="border-t border-gray-200 px-6 py-4 text-sm text-gray-500">
              แสดง {latestOrders.length} จาก{" "}
              {orders.length.toLocaleString("th-TH")} รายการ
            </div>
          </>
        )}
      </section>

      {/* Activity history is not available yet
      <section className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-5">
          <h2 className="text-lg font-bold text-gray-900">กิจกรรมล่าสุด</h2>
        </div>

        <div className="px-6 py-10 text-center text-sm text-gray-500">
          ประวัติกิจกรรมยังไม่พร้อมใช้งาน
        </div>
      </section> */}
    </div>
  );
}

export default Dashboard;
