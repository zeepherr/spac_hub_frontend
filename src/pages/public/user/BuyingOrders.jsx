import { useBuyingOrders } from "@/hook/order/useBuyingOrders";
import { ChevronRight, LoaderCircle, PackageOpen } from "lucide-react";
import { useNavigate } from "react-router";

function BuyingOrders() {
  const navigate = useNavigate();

  const { data: orders = [], isPending, isError, refetch } = useBuyingOrders();

  if (isPending) {
    return (
      <div className="flex min-h-96 items-center justify-center gap-3">
        <LoaderCircle size={28} className="animate-spin text-orange-500" />

        <span className="text-sm text-neutral-500">กำลังโหลดคำสั่งซื้อ...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-96 flex-col items-center justify-center gap-4">
        <p className="text-red-500">ไม่สามารถโหลดคำสั่งซื้อได้</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-lg border border-orange-500 px-4 py-2 text-sm font-semibold text-orange-500 hover:bg-orange-50"
        >
          ลองอีกครั้ง
        </button>
      </div>
    );
  }

  return (
    <section className="min-h-full bg-neutral-50 px-5 py-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-7">
          <h1 className="text-3xl font-bold text-neutral-900">
            คำสั่งซื้อของฉัน
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            ดูและติดตามสถานะคำสั่งซื้อทั้งหมด
          </p>
        </header>

        {orders.length === 0 ? (
          <EmptyOrders />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
            {orders.map((order) => (
              <OrderRow
                key={order.id}
                order={order}
                onClick={() => navigate(`/user/orders/${order.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
function OrderRow({ order, onClick }) {
  const images = order.listing?.images ?? [];
  const coverImage = images.find((image) => image.isCover) ?? images[0];

  const imageUrl = coverImage?.imageUrl || coverImage?.url || "";

  const productName =
    order.listing?.title ||
    [order.listing?.brand, order.listing?.model].filter(Boolean).join(" ") ||
    "ไม่พบชื่อสินค้า";

  const createdAt = order.createdAt
    ? new Intl.DateTimeFormat("th-TH", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(order.createdAt))
    : "-";

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full cursor-pointer items-center gap-4 border-b border-neutral-200 p-5 text-left transition last:border-b-0 hover:bg-orange-50/40"
    >
      <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-neutral-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={productName}
            className="size-full object-cover"
          />
        ) : (
          <PackageOpen size={30} className="text-neutral-400" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs text-neutral-400">{order.orderNumber}</p>

        <h2 className="mt-1 truncate font-semibold text-neutral-900">
          {productName}
        </h2>

        <p className="mt-1 text-sm text-neutral-500">
          สั่งซื้อเมื่อ {createdAt}
        </p>
      </div>

      <div className="hidden text-right sm:block">
        <p className="font-bold text-neutral-900">
          ฿{Number(order.agreedPrice ?? 0).toLocaleString("th-TH")}
        </p>

        <span className="mt-2 inline-block rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
          {order.status}
        </span>
      </div>

      <ChevronRight size={20} className="shrink-0 text-neutral-400" />
    </button>
  );
}

function EmptyOrders() {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-neutral-200 bg-white p-8 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-orange-50 text-orange-500">
        <PackageOpen size={30} />
      </span>

      <h2 className="mt-4 text-lg font-bold text-neutral-900">
        ยังไม่มีคำสั่งซื้อ
      </h2>

      <p className="mt-2 text-sm text-neutral-500">
        เมื่อซื้อสินค้า คำสั่งซื้อจะแสดงที่หน้านี้
      </p>
    </div>
  );
}

export default BuyingOrders;
