import {
  ClipboardCheck,
  PackageCheck,
  ScanLine,
  TriangleAlert,
} from "lucide-react";
import { Link } from "react-router";

const mockOrders = [
  {
    id: 1,
    orderNumber: "ORD-4824",
    productName: "ASUS ROG RTX 4070 Ti",
    sellerName: "J. Smith",
    price: 25900,
    status: "AWAITING_RECEIPT",
  },
  {
    id: 2,
    orderNumber: "ORD-4823",
    productName: "Corsair RM850x",
    sellerName: "M. Chen",
    price: 4299,
    status: "INSPECTION_PENDING",
  },
  {
    id: 3,
    orderNumber: "ORD-4822",
    productName: "Ryzen 9 7950X",
    sellerName: "A. Wong",
    price: 14500,
    status: "INSPECTING",
  },
  {
    id: 4,
    orderNumber: "ORD-4821",
    productName: "Kingston Fury 32GB",
    sellerName: "P. Tech",
    price: 3200,
    status: "VERIFIED",
  },
];

const summaryItems = [
  {
    title: "พัสดุรอสแกนรับ",
    value: 12,
    path: "/admin/orders/awaiting-receipt",
    icon: ScanLine,
  },
  {
    title: "รอตรวจสภาพ",
    value: 8,
    path: "/admin/orders/inspection",
    icon: ClipboardCheck,
  },
  {
    title: "พร้อมจัดส่ง",
    value: 5,
    path: "/admin/orders/ready-to-ship",
    icon: PackageCheck,
  },
  {
    title: "ต้องดำเนินการ",
    value: 3,
    path: "/admin/orders/action-required",
    icon: TriangleAlert,
  },
];

const statusConfig = {
  AWAITING_RECEIPT: {
    label: "รอสแกนรับ",
    className: "bg-orange-50 text-orange-600",
  },
  INSPECTION_PENDING: {
    label: "รอตรวจสภาพ",
    className: "bg-orange-50 text-orange-600",
  },
  INSPECTING: {
    label: "กำลังตรวจ",
    className: "bg-orange-50 text-orange-600",
  },
  VERIFIED: {
    label: "พร้อมจัดส่ง",
    className: "bg-orange-50 text-orange-600",
  },
};

const mockActivities = [
  {
    id: 1,
    message: "Admin received order ORD-4824",
    time: "Just now",
  },
  {
    id: 2,
    message: "Inspection started for ORD-4822",
    time: "15 minutes ago",
  },
  {
    id: 3,
    message: "ORD-4821 passed inspection",
    time: "1 hour ago",
  },
  {
    id: 4,
    message: "Order ORD-4820 requires action",
    time: "2 hours ago",
  },
];

function Dashboard() {
  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 py-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">หน้าหลัก</h1>

        <p className="mt-1 text-sm text-gray-500">
          ภาพรวมคำสั่งซื้อที่ต้องดำเนินการโดยผู้ดูแลระบบ
        </p>
      </div>

      {/* Summary cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryItems.map((item) => {
          const Icon = item.icon;

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

              <p className="mt-3 text-2xl font-bold text-gray-900">
                {item.value}
              </p>
            </Link>
          );
        })}
      </div>

      {/* Latest orders */}
      <section className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">รายการล่าสุด</h2>

            <p className="mt-1 text-sm text-gray-500">
              คำสั่งซื้อที่กำลังรอผู้ดูแลระบบดำเนินการ
            </p>
          </div>

          <p className="text-sm text-gray-500">28 รายการ</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
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
              {mockOrders.map((order) => {
                const status = statusConfig[order.status];

                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-5 font-semibold text-gray-900">
                      {order.orderNumber}
                    </td>

                    <td className="px-6 py-5 text-gray-700">
                      {order.productName}
                    </td>

                    <td className="px-6 py-5 text-gray-600">
                      {order.sellerName}
                    </td>

                    <td className="px-6 py-5 font-medium text-gray-900">
                      ฿{order.price.toLocaleString("th-TH")}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <button
                        type="button"
                        className="cursor-default font-medium text-orange-500"
                      >
                        ดู
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Recent activities */}
      <section className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-5">
          <h2 className="text-lg font-bold text-gray-900">กิจกรรมล่าสุด</h2>
        </div>

        <div className="space-y-6 px-6 py-5">
          {mockActivities.map((activity) => (
            <div key={activity.id} className="flex gap-3">
              <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-orange-500" />

              <div>
                <p className="text-sm text-gray-700">{activity.message}</p>

                <p className="mt-1 text-xs text-gray-400">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
