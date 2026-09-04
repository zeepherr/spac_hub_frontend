import {Clock3,PackageCheck,ShoppingBag,ShoppingCart,Truck,} from "lucide-react";
import { useNavigate } from "react-router";
import DashboardStatCard from "@/components/userDashboard/DashboardStatCard";
import PendingReceipt from "@/components/userDashboard/PendingReceipt";
import RecentMessages from "@/components/userDashboard/RecentMessages";
import RecentOrders from "@/components/userDashboard/RecentOrders";
import { useBuyingOrders } from "@/hook/order/useBuyingOrders";
import useAuthStore from "@/stores/auth.store";

const FINISHED_ORDER_STATUSES = new Set([
  "COMPLETED",
  "CANCELLED",
  "REJECTED",
  "REFUNDED",
]);

/*
 * Mock เฉพาะข้อมูลที่ Backend ยังไม่มี API
 * เมื่อมี API แล้วค่อยลบและเปลี่ยนเป็น Query จริง
 */

const recentMessagesMock = [
  {
    id: 1,
    senderName: "Tech Corner",
    senderImageUrl: "",
    message: "สวัสดีครับ สินค้าพร้อมจัดส่งแล้วนะครับ",
    timeText: "20 นาทีที่แล้ว",
    isUnread: true,
  },
  {
    id: 2,
    senderName: "NextGen Gadget",
    senderImageUrl: "",
    message: "ขอบคุณครับผม 🙏",
    timeText: "2 ชั่วโมงที่แล้ว",
    isUnread: true,
  },
];


function mapOrderForDashboard(order) {
  const images = order.listing?.images ?? [];

  const coverImage =images.find((image) => image.isCover) ??images[0];

  return {
    id: order.id,
    orderNumber: order.orderNumber,
    productName:
      order.listing?.title ||
      [order.listing?.brand, order.listing?.model]
        .filter(Boolean)
        .join(" ") ||
      "ไม่พบชื่อสินค้า",

    productImageUrl:
      coverImage?.imageUrl ||
      coverImage?.url ||
      "",

    price: Number(order.agreedPrice ?? 0),
    status: order.status,
    createdAt: order.createdAt,
  };
}

function Buy() {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user,);

  const {
    data: buyingOrders = [],
    isPending,
    isError,
    refetch,
  } = useBuyingOrders();

  const displayName = user?.firstName || user?.email || "ผู้ใช้งาน";

  /*จำนวนคำสั่งซื้อทั้งหมด*/
  const totalOrders = buyingOrders.length;

  /*กำลังดำเนินการ: นับรายการที่ยังไม่อยู่ในสถานะสิ้นสุด */
  const processingOrders =
    buyingOrders.filter(
      (order) => !FINISHED_ORDER_STATUSES.has( order.status )).length;


  /* กำลังจัดส่ง: ต้องมี deliveryShipment และยังไม่มีวันที่ส่งถึงผู้ซื้อ */
  const shippingOrders =
    buyingOrders.filter((order) => {
      const shipment = order.deliveryShipment;

      return (
        shipment && !shipment.deliveredAt);
    }).length;


  /* หาคำสั่งซื้อที่สินค้าถึงแล้ว แต่ผู้ซื้อยังไม่ได้ยืนยันรับสินค้า*/
  const orderWaitingForReceipt =
    buyingOrders.find((order) => {
      const shipment =
        order.deliveryShipment;

      return (
        shipment?.deliveredAt && order.status !== "COMPLETED" );
    });


  /* แปลงข้อมูลสำหรับ PendingReceipt */
  const pendingReceipt =
    orderWaitingForReceipt
      ? {
          id: orderWaitingForReceipt.id,
          orderNumber:
            orderWaitingForReceipt.orderNumber,
          productName:
            orderWaitingForReceipt.listing
              ?.title ||
            "สินค้าที่สั่งซื้อ",
          message:
            "สินค้าถูกจัดส่งถึงแล้ว กรุณายืนยันการรับสินค้า",
        }
      : null;

  /* Backend เรียง createdAt desc มาแล้ว จึงเลือก 3 รายการแรกได้เลย */
  const recentOrders = buyingOrders
    .slice(0, 3)
    .map(mapOrderForDashboard);

    
  const stats = [
    {
      id: "cart",
      label: "สินค้าในตะกร้า",
      value: 0,
      unit: "รายการ",
      icon: ShoppingCart,
      iconClassName:
        "bg-emerald-50 text-emerald-600",
      onClick: () => navigate("/cart"),
    },
    {
      id: "all-orders",
      label: "คำสั่งซื้อทั้งหมด",
      value: totalOrders,
      unit: "รายการ",
      icon: ShoppingBag,
      iconClassName:
        "bg-orange-50 text-orange-600",
      onClick: () =>
        navigate("/user/orders"),
    },
    {
      id: "processing",
      label: "กำลังดำเนินการ",
      value: processingOrders,
      unit: "รายการ",
      icon: Clock3,
      iconClassName:
        "bg-amber-50 text-amber-600",
      onClick: () =>
        navigate(
          "/user/orders?status=processing",
        ),
    },
    {
      id: "shipping",
      label: "กำลังจัดส่ง",
      value: shippingOrders,
      unit: "รายการ",
      icon: Truck,
      iconClassName:
        "bg-blue-50 text-blue-600",
      onClick: () =>
        navigate(
          "/user/orders?status=shipping",
        ),
    },
  ];

  if (isPending) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <Clock3
          size={30}
          className="animate-pulse text-orange-500"
        />

        <span className="ml-3 text-sm text-neutral-500">
          กำลังโหลด Dashboard...
        </span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-96 flex-col items-center justify-center gap-4">
        <p className="text-sm text-red-500">
          ไม่สามารถโหลดข้อมูลคำสั่งซื้อได้
        </p>

        <button
          type="button"
          onClick={() => refetch()}
          className="cursor-pointer rounded-xl border border-orange-500 px-5 py-2.5 text-sm font-semibold text-orange-500 transition hover:bg-orange-50"
        >
          ลองอีกครั้ง
        </button>
      </div>
    );
  }

  return (
    <section className="min-h-full bg-neutral-50 px-5 py-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* หัวข้อและปุ่มเลือกซื้อสินค้า */}
        <header className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">
              สวัสดี, {displayName} 👋
            </h1>

            <p className="mt-2 text-sm text-neutral-500">
              ติดตามคำสั่งซื้อและกิจกรรมของคุณ
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/listings")
            }
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-orange-600"
          >
            <ShoppingBag size={20} />
            เลือกซื้อสินค้า
          </button>
        </header>

        {/* การ์ดสรุป 4 ใบ */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <DashboardStatCard
              key={stat.id}
              label={stat.label}
              value={stat.value}
              unit={stat.unit}
              icon={stat.icon}
              iconClassName={
                stat.iconClassName
              }
              onClick={stat.onClick}
            />
          ))}
        </div>

        {/* สิ่งที่ต้องดำเนินการ + ข้อความล่าสุด */}
        <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
          <PendingReceipt
            order={pendingReceipt}
            icon={PackageCheck}
            onConfirm={(orderId) => {
              /*
               * ตอนนี้ Backend ยังไม่มี API ยืนยันรับสินค้า
               * จึงเปิดหน้ารายละเอียดคำสั่งซื้อก่อน
               */
              navigate(
                `/user/orders/${orderId}`,
              );
            }}
          />

          <RecentMessages
            messages={recentMessagesMock}
            onViewAll={() =>
              navigate("/messages")
            }
          />
        </div>

        {/* คำสั่งซื้อล่าสุด */}
        <div className="mt-5">
          <RecentOrders
            orders={recentOrders}
            onViewAll={() =>
              navigate("/user/orders")
            }
            onSelectOrder={(orderId) =>
              navigate(
                `/user/orders/${orderId}`,
              )
            }
          />
        </div>
      </div>
    </section>
  );
}

export default Buy;