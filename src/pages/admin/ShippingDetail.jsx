import { useState } from "react";
import {
  ArrowLeft,
  ClipboardCheck,
  ImageIcon,
  LoaderCircle,
  MapPin,
  Package,
  RotateCcw,
  Truck,
  UserRound,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";

import { useAdminOrderById } from "@/hook/order/useAdminOrderById";
import { useShipOrderToBuyer } from "@/hook/order/useShipOrderToBuyer";
import { useReturnOrderToSeller } from "@/hook/order/useReturnToSeller";

const THAI_CARRIERS = [
  "Thailand Post",
  "Kerry Express",
  "Flash Express",
  "J&T Express",
  "Ninja Van",
  "Shopee Xpress",
  "DHL Express",
  "SCG Express",
];

function ShippingDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const orderQuery = useAdminOrderById(orderId);

  const shipMutation = useShipOrderToBuyer();
  const returnMutation = useReturnOrderToSeller();

  const [form, setForm] = useState({
    carrier: "",
    trackingNumber: "",
  });

  const order = orderQuery.data;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!order) return;

    const payload = {
      carrier: form.carrier,
      trackingNumber: form.trackingNumber.trim(),
    };

    // ผ่านการตรวจ → ส่งให้ผู้ซื้อ
    if (order.status === "VERIFIED") {
      shipMutation.mutate(
        {
          orderId: Number(orderId),
          payload,
        },
        {
          onSuccess: () => {
            navigate("/admin/orders/ready-to-ship");
          },
        },
      );

      return;
    }

    // ไม่ผ่านการตรวจ → คืนให้ผู้ขาย
    if (order.status === "REJECTED") {
      returnMutation.mutate(
        {
          orderId: Number(orderId),
          payload,
        },
        {
          onSuccess: () => {
            navigate("/admin/orders/ready-to-ship");
          },
        },
      );
    }
  };

  if (orderQuery.isPending) {
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

  if (orderQuery.isError || !order) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-red-500">
            ไม่สามารถโหลดข้อมูลคำสั่งซื้อได้
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/admin/orders/ready-to-ship")
            }
            className="mt-4 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-orange-600"
          >
            กลับหน้าพร้อมจัดส่ง
          </button>
        </div>
      </div>
    );
  }

  const listing = order.listing;
  const seller = order.seller;
  const buyer = order.buyer;

  const images = listing?.images ?? [];

  const coverImage =
    images.find((image) => image.isCover)?.imageUrl ||
    images[0]?.imageUrl ||
    null;

  const sellerName =
    `${seller?.firstName ?? ""} ${seller?.lastName ?? ""}`.trim() || "-";

  const buyerName =
    `${buyer?.firstName ?? ""} ${buyer?.lastName ?? ""}`.trim() || "-";

  const isVerified = order.status === "VERIFIED";
  const isRejected = order.status === "REJECTED";

  const isPending =
    shipMutation.isPending ||
    returnMutation.isPending;

  return (
    <div className="min-h-screen bg-[#F5F5F4] px-6 py-6">
      <div className="mx-auto w-full max-w-[1450px]">
        {/* BACK */}
        <button
          type="button"
          onClick={() =>
            navigate("/admin/orders/ready-to-ship")
          }
          className="mb-5 flex items-center gap-2 text-sm text-neutral-500 transition hover:text-neutral-900"
        >
          <ArrowLeft size={17} />
          กลับหน้าพร้อมจัดส่ง
        </button>

        {/* HEADER */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                isVerified
                  ? "bg-orange-100"
                  : "bg-red-100"
              }`}
            >
              {isVerified ? (
                <Truck
                  size={22}
                  className="text-orange-500"
                />
              ) : (
                <RotateCcw
                  size={22}
                  className="text-red-500"
                />
              )}
            </div>

            <div>
              <h1 className="text-xl font-semibold text-neutral-900">
                {isVerified
                  ? "จัดส่งสินค้าให้ผู้ซื้อ"
                  : "คืนสินค้าให้ผู้ขาย"}
              </h1>

              <p className="mt-1 text-xs text-neutral-500">
                {order.orderNumber}
              </p>
            </div>
          </div>

          <StatusBadge status={order.status} />
        </div>

        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
          {/* ================= LEFT ================= */}
          <div className="space-y-4">
            {/* ORDER */}
            <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2 border-b border-neutral-100 pb-3">
                <ClipboardCheck size={18} />

                <h2 className="text-sm font-semibold text-neutral-900">
                  ข้อมูลออเดอร์
                </h2>
              </div>

              <div className="grid gap-x-12 gap-y-4 md:grid-cols-2">
                <Info
                  label="เลขที่ออเดอร์"
                  value={order.orderNumber}
                />

                <Info
                  label="ราคาซื้อขาย"
                  value={formatPrice(order.agreedPrice)}
                />

                <Info
                  label="วันที่สร้างออเดอร์"
                  value={formatDate(order.createdAt)}
                />

                <div>
                  <p className="text-xs text-neutral-400">
                    สถานะ
                  </p>

                  <div className="mt-1.5">
                    <StatusBadge status={order.status} />
                  </div>
                </div>
              </div>
            </section>

            {/* BUYER */}
            {isVerified && (
              <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2 border-b border-neutral-100 pb-3">
                  <UserRound size={18} />

                  <h2 className="text-sm font-semibold text-neutral-900">
                    ข้อมูลผู้ซื้อ
                  </h2>
                </div>

                <div className="grid gap-x-12 gap-y-4 md:grid-cols-2">
                  <Info
                    label="ชื่อผู้ซื้อ"
                    value={buyerName}
                  />

                  <Info
                    label="ชื่อผู้รับ"
                    value={
                      order.deliveryAddress?.recipientName
                    }
                  />

                  <Info
                    label="เบอร์โทรศัพท์"
                    value={order.deliveryAddress?.phone}
                  />

                  <div className="md:col-span-2">
                    <Info
                      label="ที่อยู่จัดส่ง"
                      value={order.deliveryAddress?.address}
                    />
                  </div>
                </div>
              </section>
            )}

            {/* SELLER */}
            {isRejected && (
              <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2 border-b border-neutral-100 pb-3">
                  <UserRound size={18} />

                  <h2 className="text-sm font-semibold text-neutral-900">
                    ข้อมูลผู้ขาย
                  </h2>
                </div>

                <div className="grid gap-x-12 gap-y-4 md:grid-cols-2">
                  <Info
                    label="ชื่อผู้ขาย"
                    value={sellerName}
                  />

                  <Info
                    label="Seller ID"
                    value={seller?.id}
                  />

                  <Info
                    label="เบอร์โทรศัพท์"
                    value={seller?.phone}
                  />

                  <div className="md:col-span-2">
                    <Info
                      label="ที่อยู่สำหรับคืนสินค้า"
                      value={seller?.address}
                    />
                  </div>
                </div>
              </section>
            )}

            {/* PRODUCT */}
            <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2 border-b border-neutral-100 pb-3">
                <Package size={18} />

                <h2 className="text-sm font-semibold text-neutral-900">
                  ข้อมูลสินค้า
                </h2>
              </div>

              <div className="grid gap-5 md:grid-cols-[190px_1fr]">
                {/* COVER */}
                <div className="overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100">
                  {coverImage ? (
                    <img
                      src={coverImage}
                      alt={listing?.title || "Product"}
                      className="aspect-[4/3] h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex aspect-[4/3] items-center justify-center">
                      <ImageIcon
                        size={32}
                        className="text-neutral-300"
                      />
                    </div>
                  )}
                </div>

                {/* PRODUCT DATA */}
                <div>
                  <h3 className="text-base font-semibold text-neutral-900">
                    {listing?.title || "-"}
                  </h3>

                  <p className="mt-1 text-xs text-neutral-400">
                    {listing?.brand || "-"}
                    {listing?.category?.name
                      ? ` • ${listing.category.name}`
                      : ""}
                  </p>

                  <div className="mt-5 grid gap-x-10 gap-y-4 sm:grid-cols-2">
                    <Info
                      label="Brand"
                      value={listing?.brand}
                    />

                    <Info
                      label="Model"
                      value={listing?.model}
                    />

                    <Info
                      label="Category"
                      value={listing?.category?.name}
                    />

                    <Info
                      label="ราคาซื้อขาย"
                      value={formatPrice(
                        order.agreedPrice,
                      )}
                    />

                    <Info
                      label="สภาพก่อนตรวจ"
                      value={
                        listing?.estimatedCondition
                      }
                    />

                    {isVerified && (
                      <>
                        <Info
                          label="สภาพหลังตรวจ"
                          value={
                            order.inspection
                              ?.verifiedCondition
                          }
                        />

                        <Info
                          label="คะแนนสภาพสินค้า"
                          value={
                            order.inspection
                              ?.verifiedScore ?? "-"
                          }
                        />
                      </>
                    )}

                    <Info
                      label="สถานที่สินค้า"
                      value={listing?.location}
                    />
                  </div>
                </div>
              </div>

              {listing?.description && (
                <div className="mt-5 border-t border-neutral-100 pt-4">
                  <p className="text-xs font-semibold text-neutral-700">
                    รายละเอียดสินค้า
                  </p>

                  <p className="mt-2 text-xs leading-5 text-neutral-500">
                    {listing.description}
                  </p>
                </div>
              )}
            </section>

            {/* IMAGES */}
            <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2 border-b border-neutral-100 pb-3">
                <ImageIcon size={18} />

                <h2 className="text-sm font-semibold text-neutral-900">
                  รูปภาพสินค้าทั้งหมด
                </h2>

                <span className="text-xs text-neutral-400">
                  ({images.length} รูป)
                </span>
              </div>

              {images.length === 0 ? (
                <div className="flex h-28 items-center justify-center rounded-xl bg-neutral-50">
                  <span className="text-sm text-neutral-400">
                    ไม่มีรูปภาพสินค้า
                  </span>
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {images.map((image, index) => (
                    <div
                      key={image.id ?? index}
                      className="relative h-28 w-28 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100"
                    >
                      <img
                        src={image.imageUrl}
                        alt={`${listing?.title || "Product"} ${
                          index + 1
                        }`}
                        className="h-full w-full object-cover"
                      />

                      {image.isCover && (
                        <span className="absolute bottom-1.5 left-1.5 rounded-md bg-orange-500 px-2 py-1 text-[10px] font-semibold text-white">
                          รูปปก
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* ================= RIGHT ================= */}
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm xl:sticky xl:top-6"
          >
            {/* FORM HEADER */}
            <div className="flex items-center gap-2 border-b border-neutral-100 pb-4">
              {isVerified ? (
                <Truck
                  size={19}
                  className="text-orange-500"
                />
              ) : (
                <RotateCcw
                  size={19}
                  className="text-red-500"
                />
              )}

              <h2 className="text-sm font-semibold text-neutral-900">
                {isVerified
                  ? "ข้อมูลการจัดส่ง"
                  : "ข้อมูลการคืนสินค้า"}
              </h2>
            </div>

            {/* CARRIER */}
            <div className="mt-5">
              <label className="text-sm font-medium text-neutral-800">
                บริษัทขนส่ง
                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>

              <select
                name="carrier"
                value={form.carrier}
                onChange={handleChange}
                required
                className={`mt-2 h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none transition ${
                  isVerified
                    ? "focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                    : "focus:border-red-400 focus:ring-2 focus:ring-red-100"
                }`}
              >
                <option value="">
                  เลือกบริษัทขนส่ง
                </option>

                {THAI_CARRIERS.map((carrier) => (
                  <option
                    key={carrier}
                    value={carrier}
                  >
                    {carrier}
                  </option>
                ))}
              </select>
            </div>

            {/* TRACKING */}
            <div className="mt-5">
              <label className="text-sm font-medium text-neutral-800">
                เลขพัสดุ
                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>

              <textarea
                name="trackingNumber"
                value={form.trackingNumber}
                onChange={handleChange}
                required
                minLength={isVerified ? 5 : 3}
                maxLength={isVerified ? 100 : 150}
                rows={3}
                placeholder="เช่น TH123456789"
                className={`mt-2 w-full resize-none rounded-xl border border-neutral-200 p-3 text-sm outline-none transition placeholder:text-neutral-400 ${
                  isVerified
                    ? "focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                    : "focus:border-red-400 focus:ring-2 focus:ring-red-100"
                }`}
              />

              <p className="mt-1 text-right text-xs text-neutral-400">
                {form.trackingNumber.length}/
                {isVerified ? 100 : 150}
              </p>
            </div>

            {/* 
              แสดงหมายเหตุเฉพาะ REJECTED เท่านั้น
              และเป็นข้อมูลจากที่ Admin กรอกตอนตรวจสินค้า
            */}
            {isRejected && (
              <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-4">
                <p className="text-sm font-semibold text-red-600">
                  หมายเหตุจากการตรวจสินค้า
                </p>

                <p className="mt-1 text-xs text-red-400">
                  หมายเหตุที่ Admin ระบุไว้ตอนตรวจสินค้า
                </p>

                <div className="mt-3 min-h-24 rounded-lg border border-red-100 bg-white p-3">
                  <p className="whitespace-pre-wrap text-sm leading-6 text-neutral-700">
                    {order.inspection?.notes ||
                      "ไม่มีหมายเหตุ"}
                  </p>
                </div>
              </div>
            )}

            {/* DESTINATION */}
            <div className="mt-5 rounded-xl bg-neutral-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <MapPin
                  size={15}
                  className="text-neutral-500"
                />

                <p className="text-xs font-semibold text-neutral-600">
                  {isVerified
                    ? "ปลายทางผู้ซื้อ"
                    : "ปลายทางผู้ขาย"}
                </p>
              </div>

              {isVerified ? (
                <>
                  <p className="text-sm font-semibold text-neutral-900">
                    {order.deliveryAddress
                      ?.recipientName || buyerName}
                  </p>

                  <p className="mt-1 text-xs text-neutral-500">
                    {order.deliveryAddress?.phone ||
                      "-"}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-neutral-500">
                    {order.deliveryAddress?.address ||
                      "-"}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm font-semibold text-neutral-900">
                    {sellerName}
                  </p>

                  <p className="mt-1 text-xs text-neutral-500">
                    {seller?.phone || "-"}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-neutral-500">
                    {seller?.address || "-"}
                  </p>
                </>
              )}
            </div>

            {/* ACTION */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/admin/orders/ready-to-ship",
                  )
                }
                disabled={isPending}
                className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                ยกเลิก
              </button>

              <button
                type="submit"
                disabled={
                  isPending ||
                  !form.carrier ||
                  !form.trackingNumber.trim()
                }
                className={`rounded-xl px-4 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  isVerified
                    ? "bg-orange-500 hover:bg-orange-600"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {isPending
                  ? "กำลังบันทึก..."
                  : isVerified
                    ? "ยืนยันการจัดส่ง"
                    : "ยืนยันคืนสินค้า"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  if (status === "VERIFIED") {
    return (
      <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
        ผ่านการตรวจ
      </span>
    );
  }

  if (status === "REJECTED") {
    return (
      <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">
        ไม่ผ่านการตรวจ
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-600">
      {status}
    </span>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs text-neutral-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-medium text-neutral-900">
        {value ?? "-"}
      </p>
    </div>
  );
}

function formatPrice(price) {
  return `฿${Number(
    price || 0,
  ).toLocaleString("th-TH")}`;
}

function formatDate(date) {
  if (!date) return "-";

  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export default ShippingDetail;