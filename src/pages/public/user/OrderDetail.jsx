import {
  ArrowLeft,
  Box,
  CalendarDays,
  CircleDollarSign,
  ClipboardCheck,
  LoaderCircle,
  MapPin,
  PackageCheck,
  Phone,
  Store,
  Truck,
} from "lucide-react";
import {
  useNavigate,
  useParams,
} from "react-router";

import { useOrderById } from "@/hook/order/useOrderById";
import { useConfirmOrderDelivery } from "@/hook/order/useConfirmOrderDelivery";

const ORDER_STATUS = {
  AWAITING_PAYMENT: {
    label: "รอชำระเงิน",
    className:
      "bg-orange-50 text-orange-600",
  },
  PAID: {
    label: "ชำระเงินแล้ว",
    className:
      "bg-emerald-50 text-emerald-600",
  },
  SELLER_SHIPPING: {
    label: "ผู้ขายกำลังส่งสินค้าไปตรวจ",
    className:
      "bg-amber-50 text-amber-600",
  },
  SHIPPING_TO_BUYER: {
    label: "กำลังจัดส่งให้ผู้ซื้อ",
    className:
      "bg-blue-50 text-blue-600",
  },
  COMPLETED: {
    label: "สำเร็จ",
    className:
      "bg-emerald-50 text-emerald-600",
  },
  CANCELLED: {
    label: "ยกเลิกแล้ว",
    className:
      "bg-red-50 text-red-600",
  },
  REJECTED: {
    label: "ไม่ผ่านการตรวจสอบ",
    className:
      "bg-red-50 text-red-600",
  },
};

const CONFIRMABLE_SHIPMENT_STATUSES =
  new Set([
    "SHIPPED",
    "IN_TRANSIT",
    "DELIVERED",
  ]);

function OrderDetail() {
  const navigate = useNavigate();
  const { orderId } = useParams();

  const {
    data: order,
    isPending,
    isError,
    error,
    refetch,
  } = useOrderById(orderId);

  const confirmDeliveryMutation =
    useConfirmOrderDelivery();

  if (isPending) {
    return (
      <div className="flex min-h-96 items-center justify-center gap-3">
        <LoaderCircle
          size={28}
          className="animate-spin text-orange-500"
        />

        <span className="text-sm text-neutral-500">
          กำลังโหลดรายละเอียด...
        </span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-96 flex-col items-center justify-center gap-4">
        <p className="text-red-500">
          {error?.response?.data?.message ||
            "ไม่สามารถโหลดรายละเอียดคำสั่งซื้อได้"}
        </p>

        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-xl border border-orange-500 px-5 py-2.5 font-semibold text-orange-500 hover:bg-orange-50"
        >
          ลองอีกครั้ง
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-96 items-center justify-center text-neutral-500">
        ไม่พบคำสั่งซื้อ
      </div>
    );
  }

  const listing = order.listing;
  const shipment =
    order.deliveryShipment;
  const address =
    order.deliveryAddress;
  const inspection = order.inspection;

  /*
   * Backend ใช้ toListingResponse()
   * รูปจึงอยู่ใน imageUrl
   */
  const images = listing?.images ?? [];
  const coverImage =
    images.find((image) => image.isCover) ??
    images[0];

  const imageUrl =
    coverImage?.imageUrl || "";

  const productName =
    listing?.title ||
    [listing?.brand, listing?.model]
      .filter(Boolean)
      .join(" ") ||
    "ไม่พบชื่อสินค้า";

  const sellerName =
    [
      order.seller?.firstName,
      order.seller?.lastName,
    ]
      .filter(Boolean)
      .join(" ") ||
    "ไม่พบข้อมูลผู้ขาย";

  const status =
    ORDER_STATUS[order.status] ?? {
      label: order.status,
      className:
        "bg-neutral-100 text-neutral-600",
    };

  const canConfirmDelivery =
    order.status ===
      "SHIPPING_TO_BUYER" &&
    shipment &&
    CONFIRMABLE_SHIPMENT_STATUSES.has(
      shipment.status,
    );

  function handleConfirmDelivery() {
    const confirmed = window.confirm(
      "ยืนยันว่าคุณได้รับสินค้าแล้วใช่หรือไม่?",
    );

    if (!confirmed) return;

    confirmDeliveryMutation.mutate({
      orderId: order.id,
    });
  }

  return (
    <section className="min-h-full bg-neutral-50 px-5 py-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        {/* ย้อนกลับ */}
        <button
          type="button"
          onClick={() =>
            navigate("/user/orders")
          }
          className="mb-6 inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-neutral-500 hover:text-orange-500"
        >
          <ArrowLeft size={18} />
          กลับไปคำสั่งซื้อของฉัน
        </button>

        {/* หัวข้อ */}
        <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-orange-500">
              Order detail
            </p>

            <h1 className="mt-1 text-3xl font-bold text-neutral-900">
              รายละเอียดคำสั่งซื้อ
            </h1>

            <p className="mt-2 text-sm text-neutral-500">
              {order.orderNumber}
            </p>
          </div>

          <span
            className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${status.className}`}
          >
            {status.label}
          </span>
        </header>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
          {/* ฝั่งซ้าย */}
          <div className="space-y-6">
            {/* สินค้า */}
            <article className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-lg font-bold text-neutral-900">
                ข้อมูลสินค้า
              </h2>

              <div className="flex flex-col gap-5 sm:flex-row">
                <div className="flex size-36 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={productName}
                      className="size-full object-cover"
                    />
                  ) : (
                    <Box
                      size={44}
                      className="text-neutral-400"
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-xl font-bold text-neutral-900">
                    {productName}
                  </h3>

                  <p className="mt-2 text-sm text-neutral-500">
                    {[listing?.brand, listing?.model]
                      .filter(Boolean)
                      .join(" ") ||
                      "ไม่พบข้อมูลยี่ห้อและรุ่น"}
                  </p>

                  {listing?.description && (
                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-neutral-500">
                      {listing.description}
                    </p>
                  )}

                  <p className="mt-5 text-2xl font-bold text-orange-500">
                    ฿
                    {Number(
                      order.agreedPrice ?? 0,
                    ).toLocaleString(
                      "th-TH",
                    )}
                  </p>
                </div>
              </div>
            </article>

            {/* การจัดส่ง */}
            <Card title="ข้อมูลการจัดส่ง">
              <InfoRow
                icon={Truck}
                label="บริษัทขนส่ง"
                value={shipment?.carrier}
                emptyText="ยังไม่มีข้อมูลบริษัทขนส่ง"
              />

              <InfoRow
                icon={PackageCheck}
                label="เลขติดตามพัสดุ"
                value={
                  shipment?.trackingNumber
                }
                emptyText="ยังไม่มีเลขพัสดุ"
              />

              <InfoRow
                icon={Box}
                label="สถานะพัสดุ"
                value={shipment?.status}
                emptyText="ยังไม่มีข้อมูลการจัดส่ง"
              />

              {canConfirmDelivery && (
                <button
                  type="button"
                  onClick={
                    handleConfirmDelivery
                  }
                  disabled={
                    confirmDeliveryMutation.isPending
                  }
                  className="mt-2 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {confirmDeliveryMutation.isPending ? (
                    <>
                      <LoaderCircle
                        size={18}
                        className="animate-spin"
                      />
                      กำลังยืนยัน...
                    </>
                  ) : (
                    <>
                      <PackageCheck
                        size={18}
                      />
                      ยืนยันการรับสินค้า
                    </>
                  )}
                </button>
              )}
            </Card>

            {/* ผลตรวจสินค้า */}
            {inspection && (
              <Card title="ผลการตรวจสอบสินค้า">
                <InfoRow
                  icon={ClipboardCheck}
                  label="ผลการตรวจ"
                  value={inspection.result}
                />

                <InfoRow
                  icon={PackageCheck}
                  label="สภาพที่ตรวจสอบได้"
                  value={
                    inspection.verifiedCondition
                  }
                />

                <InfoRow
                  icon={CircleDollarSign}
                  label="คะแนนสินค้า"
                  value={
                    inspection.verifiedScore !==
                      null &&
                    inspection.verifiedScore !==
                      undefined
                      ? `${inspection.verifiedScore}/100`
                      : null
                  }
                />
              </Card>
            )}
          </div>

          {/* ฝั่งขวา */}
          <aside className="space-y-6">
            <Card title="สรุปคำสั่งซื้อ">
              <InfoRow
                icon={CalendarDays}
                label="วันที่สั่งซื้อ"
                value={formatDate(
                  order.createdAt,
                )}
              />

              <InfoRow
                icon={CircleDollarSign}
                label="การชำระเงิน"
                value={
                  order.checkout?.payment
                    ?.status ||
                  order.checkout?.status
                }
                emptyText="ยังไม่มีข้อมูลการชำระเงิน"
              />

              <InfoRow
                icon={Store}
                label="ผู้ขาย"
                value={sellerName}
              />
            </Card>

            <Card title="ที่อยู่จัดส่ง">
              {address ? (
                <>
                  <InfoRow
                    icon={MapPin}
                    label="ชื่อผู้รับ"
                    value={
                      address.recipientName
                    }
                  />

                  <InfoRow
                    icon={Phone}
                    label="เบอร์โทรศัพท์"
                    value={address.phone}
                  />

                  <div className="rounded-xl bg-neutral-50 p-4 text-sm leading-7 text-neutral-600">
                    {address.address}
                  </div>
                </>
              ) : (
                <p className="text-sm text-neutral-400">
                  ยังไม่มีข้อมูลที่อยู่จัดส่ง
                </p>
              )}
            </Card>
          </aside>
        </div>
      </div>
    </section>
  );
}

function Card({ title, children }) {
  return (
    <article className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-lg font-bold text-neutral-900">
        {title}
      </h2>

      <div className="space-y-4">
        {children}
      </div>
    </article>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  emptyText = "ไม่พบข้อมูล",
}) {
  const hasValue =
    value !== null &&
    value !== undefined &&
    String(value).trim() !== "";

  return (
    <div className="flex items-start gap-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-500">
        <Icon size={19} />
      </span>

      <div className="min-w-0">
        <p className="text-xs text-neutral-400">
          {label}
        </p>

        <p
          className={`mt-1 break-words text-sm font-medium ${
            hasValue
              ? "text-neutral-700"
              : "text-neutral-400"
          }`}
        >
          {hasValue ? value : emptyText}
        </p>
      </div>
    </div>
  );
}

function formatDate(date) {
  if (!date) return "ไม่พบข้อมูล";

  return new Intl.DateTimeFormat(
    "th-TH",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  ).format(new Date(date));
}

export default OrderDetail;