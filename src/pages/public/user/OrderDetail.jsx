import {
  AlertTriangle,
  Box,
  CalendarDays,
  CircleDollarSign,
  ClipboardCheck,
  LoaderCircle,
  MapPin,
  MessageSquareText,
  PackageCheck,
  PackageSearch,
  Phone,
  Store,
  Truck,
  X,
} from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router";

import BuyerOrderSupport from "@/components/support/BuyerOrderSupport";
import { hasUnreadSupportMessage } from "@/components/support/support.constants";
import { useConfirmOrderDelivery } from "@/hook/order/useConfirmOrderDelivery";
import { useOrderById } from "@/hook/order/useOrderById";
import { useMySupportCases } from "@/hook/support/useMySupportCases";
import useAuthStore from "@/stores/auth.store";
import BackButton from "./BackButton";

// bg หลักมาตรฐานของทั้งเว็บ (เดียวกับที่ตั้งไว้ใน PublicLayout.jsx) - ใช้กับพื้นหลังหลักของหน้าเท่านั้น
const PAGE_BG =
  "bg-[linear-gradient(180deg,rgba(59,130,246,0.12)_0%,transparent_35%),linear-gradient(0deg,rgba(59,130,246,0.12)_0%,transparent_35%),linear-gradient(180deg,#fafafa_0%,#f0f0f0_100%)]";
// เดียวกับ GLASS_PANEL ที่ใช้ทั้งเว็บ - การ์ด/แผงทุกอันในหน้านี้เป็น liquid card หมดแล้ว
const GLASS_PANEL =
  "border border-neutral-200/70 bg-white/50 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_8px_24px_rgba(0,0,0,0.06)]";
const CTA_GLASS =
  "bg-orange-500 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_4px_12px_rgba(249,115,22,0.3)] hover:bg-orange-600";
// Modal ต้องทึบกว่าการ์ดปกติหน่อย เพราะลอยทับเนื้อหาเยอะ ต้องอ่านง่ายชัดเจน (เดียวกับ dropdown ผลค้นหา
// ใน SiteHeader.jsx ที่ใช้ bg-white/95)
const GLASS_MODAL =
  "border border-neutral-200/80 bg-white/92 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_20px_40px_rgba(0,0,0,0.14)]";

const ORDER_STATUS = {
  AWAITING_PAYMENT: {
    label: "Awaiting Payment",
    className: "bg-orange-50 text-orange-600",
  },

  PAID: {
    label: "Paid",
    className: "bg-emerald-50 text-emerald-600",
  },

  SELLER_SHIPPING: {
    label: "Seller Shipping to Inspection",
    className: "bg-amber-50 text-amber-600",
  },

  SHIPPING_TO_ADMIN: {
    label: "Shipping to Admin",
    className: "bg-amber-50 text-amber-600",
  },

  RECEIVED_BY_ADMIN: {
    label: "Received by Admin",
    className: "bg-violet-50 text-violet-600",
  },

  INSPECTING: {
    label: "Inspecting",
    className: "bg-purple-50 text-purple-600",
  },

  INSPECTION_PASSED: {
    label: "Inspection Passed",
    className: "bg-teal-50 text-teal-600",
  },

  SHIPPING_TO_BUYER: {
    label: "Shipping to Buyer",
    className: "bg-blue-50 text-blue-600",
  },

  COMPLETED: {
    label: "Completed",
    className: "bg-emerald-50 text-emerald-600",
  },

  CANCELLED: {
    label: "Cancelled",
    className: "bg-red-50 text-red-600",
  },

  REJECTED: {
    label: "Inspection Failed",
    className: "bg-red-50 text-red-600",
  },

  REFUNDED: {
    label: "Refunded",
    className: "bg-neutral-100 text-neutral-600",
  },
};

const CONFIRMABLE_SHIPMENT_STATUSES = new Set([
  "SHIPPED",
  "IN_TRANSIT",
  "DELIVERED",
]);

function OrderDetail() {
  const { orderId } = useParams();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState("details");

  const currentUser = useAuthStore((state) => state.user);

  const { data: mySupportCases = [] } = useMySupportCases();

  /* ดึงรายละเอียด Order จาก Backend*/
  const {
    data: order,
    isPending,
    isError,
    error,
    refetch,
  } = useOrderById(orderId);

  const confirmDeliveryMutation = useConfirmOrderDelivery();
  if (isPending) {
    return (
      <div className="flex min-h-96 items-center justify-center gap-3">
        <LoaderCircle size={28} className="animate-spin text-orange-500" />

        <span className="text-sm text-neutral-500">
          Loading order details...
        </span>
      </div>
    );
  }

  /* โหลดข้อมูลไม่สำเร็จ*/
  if (isError) {
    return (
      <div className="flex min-h-96 flex-col items-center justify-center gap-4">
        <p className="text-red-500">
          {error?.response?.data?.message || "Unable to load order details"}
        </p>

        <button
          type="button"
          onClick={() => refetch()}
          className="cursor-pointer rounded-xl border border-orange-500 px-5 py-2.5 font-semibold text-orange-500 transition hover:bg-orange-50"
        >
          Try Again
        </button>
      </div>
    );
  }

  /* Backend ไม่ส่งข้อมูล Order กลับมา */
  if (!order) {
    return (
      <div className="flex min-h-96 items-center justify-center text-neutral-500">
        Order not found
      </div>
    );
  }

  const orderSupportCase = mySupportCases.find(
    (supportCase) => Number(supportCase.orderId) === Number(order.id),
  );

  const hasUnreadSupport = hasUnreadSupportMessage(
    orderSupportCase,
    currentUser?.id,
  );

  /* แยกข้อมูลออกมาเพื่อเรียกใช้ง่ายขึ้น */
  const listing = order.listing;
  const shipment = order.deliveryShipment;
  const address = order.deliveryAddress;
  const inspection = order.inspection;

  /* หารูปปกสินค้าถ้าไม่มีรูปปกให้ใช้รูปแรก */
  const images = listing?.images ?? [];
  const coverImage = images.find((image) => image.isCover) ?? images[0];

  const imageUrl = coverImage?.imageUrl || coverImage?.url || "";

  /*หาชื่อสินค้า */
  const productName =
    listing?.title ||
    [listing?.brand, listing?.model].filter(Boolean).join(" ") ||
    "Untitled Item";

  /* รวมชื่อและนามสกุลผู้ขาย */
  const sellerName =
    [order.seller?.firstName, order.seller?.lastName]
      .filter(Boolean)
      .join(" ") || "Unknown Seller";

  /* เลือกข้อความและสีตามสถานะ Order */
  const status = ORDER_STATUS[order.status] ?? {
    label: order.status || "Unknown",
    className: "bg-neutral-100 text-neutral-600",
  };

  /*
   * ปุ่ม Confirm Delivery จะแสดงเมื่อ:  1. Order กำลังส่งให้ผู้ซื้อ  2. มี deliveryShipment 3. Shipment เป็น SHIPPED, IN_TRANSIT หรือ DELIVERED */
  const canConfirmDelivery =
    order.status === "SHIPPING_TO_BUYER" &&
    Boolean(shipment) &&
    CONFIRMABLE_SHIPMENT_STATUSES.has(shipment.status);

  /* เปิด Modal */
  function handleOpenConfirmModal() {
    setIsConfirmModalOpen(true);
  }

  /*ปิด Modal ถ้ากำลังเรียก API อยู่ จะไม่อนุญาตให้ปิด */
  function handleCloseConfirmModal() {
    if (confirmDeliveryMutation.isPending) {
      return;
    }
    setIsConfirmModalOpen(false);
  }

  /* เรียก API ยืนยันรับสินค้า */
  function handleConfirmDelivery() {
    confirmDeliveryMutation.mutate(
      {
        orderId: order.id,
      },
      {
        onSuccess: () => {
          setIsConfirmModalOpen(false);
        },
      },
    );
  }

  return (
    <section
      className={`px-5 py-8 lg:px-10 ${PAGE_BG} ${
        activeTab === "support"
          ? "h-full min-h-0 overflow-hidden"
          : "min-h-full"
      }`}
    >
      <div
        className={`mx-auto max-w-6xl ${
          activeTab === "support" ? "flex h-full min-h-0 flex-col" : ""
        }`}
      >
        <div className="shrink-0">
          <BackButton fallbackPath="/user/orders" />
        </div>
        <nav
          aria-label="Order detail sections"
          className={`mb-6 flex shrink-0 gap-1 rounded-xl p-1 ${GLASS_PANEL}`}
        >
          <button
            type="button"
            onClick={() => setActiveTab("details")}
            className={`inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition ${
              activeTab === "details"
                ? "bg-neutral-900 text-white shadow-sm"
                : "text-neutral-500 hover:bg-neutral-100/70 hover:text-neutral-900"
            }`}
          >
            <PackageSearch size={18} />
            Order Details
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("support")}
            className={`relative inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition ${
              activeTab === "support"
                ? "bg-orange-500 text-white shadow-sm"
                : "text-neutral-500 hover:bg-orange-50/70 hover:text-orange-600"
            }`}
          >
            <MessageSquareText size={18} />
            Support
            {hasUnreadSupport && activeTab !== "support" && (
              <span className="relative ml-1 flex size-2.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-orange-400 opacity-60" />

                <span className="relative inline-flex size-2.5 rounded-full bg-orange-500" />
              </span>
            )}
          </button>
        </nav>
        {activeTab === "details" && (
          <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-orange-500">
                Order detail
              </p>

              <h1 className="mt-1 text-3xl font-bold text-neutral-900">
                Order Details
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
        )}

        {activeTab === "details" ? (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
            {/* คอลัมน์ด้านซ้าย */}
            <div className="space-y-6">
              {/* ข้อมูลสินค้า */}
              <article className={`rounded-2xl p-6 ${GLASS_PANEL}`}>
                <h2 className="mb-5 text-lg font-bold text-neutral-900">
                  Item Information
                </h2>

                <div className="flex flex-col gap-5 sm:flex-row">
                  {/* รูปสินค้า */}
                  <div className="flex size-36 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-neutral-200/70 bg-neutral-100">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={productName}
                        className="size-full object-cover"
                      />
                    ) : (
                      <Box size={44} className="text-neutral-400" />
                    )}
                  </div>

                  {/* รายละเอียดสินค้า */}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xl font-bold text-neutral-900">
                      {productName}
                    </h3>

                    <p className="mt-2 text-sm text-neutral-500">
                      {[listing?.brand, listing?.model]
                        .filter(Boolean)
                        .join(" ") || "Brand/Model details unavailable"}
                    </p>

                    {listing?.description && (
                      <p className="mt-4 line-clamp-3 text-sm leading-6 text-neutral-500">
                        {listing.description}
                      </p>
                    )}

                    <p className="mt-5 text-2xl font-bold text-orange-500">
                      ฿{Number(order.agreedPrice ?? 0).toLocaleString("en-US")}
                    </p>
                  </div>
                </div>
              </article>

              {/* ข้อมูลการจัดส่ง */}
              <Card title="Shipping Information">
                <InfoRow
                  icon={Truck}
                  label="Carrier"
                  value={shipment?.carrier}
                  emptyText="Carrier info not available"
                />

                <InfoRow
                  icon={PackageCheck}
                  label="Tracking Number"
                  value={shipment?.trackingNumber}
                  emptyText="No tracking number"
                />

                <InfoRow
                  icon={Box}
                  label="Shipment Status"
                  value={shipment?.status}
                  emptyText="No shipping information"
                />

                {/* ปุ่มยืนยันรับสินค้า */}
                {canConfirmDelivery && (
                  <button
                    type="button"
                    onClick={handleOpenConfirmModal}
                    disabled={confirmDeliveryMutation.isPending}
                    className={`mt-2 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${CTA_GLASS}`}
                  >
                    <PackageCheck size={18} />
                    Confirm Delivery
                  </button>
                )}
              </Card>

              {/* ผลการตรวจสอบสินค้า */}
              {inspection && (
                <Card title="Inspection Results">
                  <InfoRow
                    icon={ClipboardCheck}
                    label="Result"
                    value={inspection.result}
                  />

                  <InfoRow
                    icon={PackageCheck}
                    label="Verified Condition"
                    value={inspection.verifiedCondition}
                  />

                  <InfoRow
                    icon={CircleDollarSign}
                    label="Condition Score"
                    value={
                      inspection.verifiedScore !== null &&
                      inspection.verifiedScore !== undefined
                        ? `${inspection.verifiedScore}/100`
                        : null
                    }
                  />
                </Card>
              )}
            </div>

            {/* คอลัมน์ด้านขวา */}
            <aside className="space-y-6">
              {/* สรุปคำสั่งซื้อ */}
              <Card title="Order Summary">
                <InfoRow
                  icon={CalendarDays}
                  label="Order Date"
                  value={formatDate(order.createdAt)}
                />

                <InfoRow
                  icon={CircleDollarSign}
                  label="Payment Status"
                  value={
                    order.checkout?.payment?.status || order.checkout?.status
                  }
                  emptyText="No payment information"
                />

                <InfoRow icon={Store} label="Seller" value={sellerName} />
              </Card>

              {/* ที่อยู่จัดส่ง */}
              <Card title="Shipping Address">
                {address ? (
                  <>
                    <InfoRow
                      icon={MapPin}
                      label="Recipient"
                      value={address.recipientName}
                    />

                    <InfoRow
                      icon={Phone}
                      label="Phone Number"
                      value={address.phone}
                    />

                    <div className="rounded-xl border border-neutral-200/50 bg-white/40 p-4 text-sm leading-7 text-neutral-600 backdrop-blur-sm">
                      {address.address}
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-neutral-400">
                    No shipping address available
                  </p>
                )}
              </Card>
            </aside>
          </div>
        ) : (
          <div className="min-h-0 flex-1">
            <BuyerOrderSupport order={order} />
          </div>
        )}
      </div>

      {/* Modal ยืนยันรับสินค้า */}
      <ConfirmDeliveryModal
        isOpen={isConfirmModalOpen}
        isPending={confirmDeliveryMutation.isPending}
        onClose={handleCloseConfirmModal}
        onConfirm={handleConfirmDelivery}
      />
    </section>
  );
}

/* Modal สำหรับยืนยันรับสินค้า */
function ConfirmDeliveryModal({ isOpen, isPending, onClose, onConfirm }) {
  /* ถ้าไม่ได้เปิด ไม่ต้องแสดง Modal */
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        /* กดบริเวณพื้นหลังสีดำเพื่อปิด Modal */
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-delivery-title"
        className={`w-full max-w-md rounded-2xl p-6 ${GLASS_MODAL}`}
      >
        {/* ไอคอนและปุ่มปิด */}
        <div className="flex items-start justify-between gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-500">
            <PackageCheck size={24} />
          </span>

          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            aria-label="Close modal"
            className="cursor-pointer rounded-lg p-1.5 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <X size={20} />
          </button>
        </div>

        {/* หัวข้อ Modal */}
        <div className="mt-4">
          <h2
            id="confirm-delivery-title"
            className="text-xl font-bold text-neutral-900"
          >
            Confirm Delivery
          </h2>

          <p className="mt-2 text-sm leading-6 text-neutral-500">
            Have you received the product and checked that everything is
            correct?
          </p>
        </div>

        {/* คำเตือน */}
        <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50 p-4 text-amber-800">
          <AlertTriangle size={20} className="mt-0.5 shrink-0" />

          <p className="text-sm leading-5">
            After confirmation, the order will be completed and the payment may
            be released to the seller.
          </p>
        </div>

        {/* ปุ่มด้านล่าง */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="cursor-pointer rounded-xl border border-neutral-300 bg-white/70 px-5 py-2.5 text-sm font-semibold text-neutral-700 backdrop-blur-sm transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className={`inline-flex min-w-36 cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${CTA_GLASS}`}
          >
            {isPending ? (
              <>
                <LoaderCircle size={18} className="animate-spin" />
                Confirming...
              </>
            ) : (
              <>
                <PackageCheck size={18} />
                Yes, Confirm
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* กล่อง Card ที่ใช้ซ้ำในหน้า */
function Card({ title, children }) {
  return (
    <article className={`rounded-2xl p-6 ${GLASS_PANEL}`}>
      <h2 className="mb-5 text-lg font-bold text-neutral-900">{title}</h2>
      <div className="space-y-4">{children}</div>
    </article>
  );
}

/* แถวข้อมูลที่มีไอคอน หัวข้อ และค่า */
function InfoRow({ icon: Icon, label, value, emptyText = "-" }) {
  const hasValue = value !== null && value !== undefined && value !== "";

  return (
    <div className="flex items-start gap-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-500">
        <Icon size={18} />
      </span>

      <div className="min-w-0">
        <p className="text-xs text-neutral-400">{label}</p>

        <p
          className={`mt-1 wrap-break-word text-sm font-medium ${
            hasValue ? "text-neutral-800" : "text-neutral-400"
          }`}
        >
          {hasValue ? value : emptyText}
        </p>
      </div>
    </div>
  );
}

/* แปลงวันที่ให้อ่านง่าย */
function formatDate(date) {
  if (!date) {
    return "-";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsedDate);
}

export default OrderDetail;
