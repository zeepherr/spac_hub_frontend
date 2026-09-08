import { useState } from "react";
import {
  ArrowLeft,
  ImageIcon,
  LoaderCircle,
  MapPin,
  Package,
  UserRound,
} from "lucide-react";
import {
  useNavigate,
  useParams,
} from "react-router";

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
  const navigate = useNavigate();
  const { orderId } = useParams();

  const orderQuery =
    useAdminOrderById(orderId);

  const shipMutation =
    useShipOrderToBuyer();

  const returnMutation =
    useReturnOrderToSeller();

  const [form, setForm] = useState({
    carrier: "",
    trackingNumber: "",
  });

  const order = orderQuery.data;

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
            ไม่สามารถโหลดข้อมูล Order ได้
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/admin/orders/ready-to-ship",
              )
            }
            className="mt-4 rounded-xl bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white"
          >
            กลับ
          </button>
        </div>
      </div>
    );
  }

  const isVerified =
    order.status === "VERIFIED";

  const isRejected =
    order.status === "REJECTED";

  const isPending =
    shipMutation.isPending ||
    returnMutation.isPending;

  const listing = order.listing;

  const buyer = order.buyer;
  const seller = order.seller;

  const buyerName = [
    buyer?.firstName,
    buyer?.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  const sellerName = [
    seller?.firstName,
    seller?.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  const images = listing?.images ?? [];

  const coverImage =
    images.find((image) => image.isCover) ||
    images[0];

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const payload = {
      carrier: form.carrier,
      trackingNumber:
        form.trackingNumber.trim(),
    };

    /*
     * ===========================
     * ส่งสินค้าให้ Buyer
     * ===========================
     */
    if (isVerified) {
      shipMutation.mutate(
        {
          orderId: Number(orderId),
          payload,
        },
        {
          onSuccess: () => {
            navigate(
              "/admin/orders/summary",
            );
          },
        },
      );

      return;
    }

    /*
     * ===========================
     * คืนสินค้าให้ Seller
     * ===========================
     */
    if (isRejected) {
      returnMutation.mutate(
        {
          orderId: Number(orderId),
          payload,
        },
        {
          onSuccess: () => {
            navigate(
              "/admin/orders/summary",
            );
          },
        },
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F4] px-6 py-6">
      <div className="mx-auto w-full max-w-[1450px]">
        {/* BACK */}
        <button
          type="button"
          onClick={() =>
            navigate(
              "/admin/orders/ready-to-ship",
            )
          }
          className="mb-5 flex items-center gap-2 text-sm font-medium text-neutral-500 transition hover:text-neutral-900"
        >
          <ArrowLeft size={17} />
          กลับไปหน้าพร้อมจัดส่ง
        </button>

        {/* HEADER */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">
              {isVerified
                ? "จัดส่งสินค้าให้ผู้ซื้อ"
                : "คืนสินค้าให้ผู้ขาย"}
            </h1>

            <p className="mt-1 text-sm text-neutral-500">
              {order.orderNumber}
            </p>
          </div>

          <StatusBadge
            status={order.status}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_420px]">
          {/* ======================
              LEFT
          ======================= */}
          <div className="space-y-5">
            {/* ORDER */}
            <Card
              title="ข้อมูลออเดอร์"
              icon={Package}
            >
              <InfoGrid>
                <Info
                  label="Order Number"
                  value={order.orderNumber}
                />

                <Info
                  label="ราคาซื้อขาย"
                  value={formatPrice(
                    order.agreedPrice,
                  )}
                />

                <Info
                  label="สถานะ"
                  value={
                    isVerified
                      ? "ผ่านการตรวจ"
                      : "ไม่ผ่านการตรวจ"
                  }
                />

                <Info
                  label="วันที่สร้าง"
                  value={formatDate(
                    order.createdAt,
                  )}
                />
              </InfoGrid>
            </Card>

            {/* BUYER */}
            {isVerified && (
              <Card
                title="ข้อมูลผู้ซื้อ"
                icon={UserRound}
              >
                <InfoGrid>
                  <Info
                    label="ชื่อผู้ซื้อ"
                    value={buyerName}
                  />

                  <Info
                    label="ชื่อผู้รับ"
                    value={
                      order.deliveryAddress
                        ?.recipientName
                    }
                  />

                  <Info
                    label="เบอร์โทรศัพท์"
                    value={
                      order.deliveryAddress
                        ?.phone
                    }
                  />

                  <Info
                    label="ที่อยู่จัดส่ง"
                    value={
                      order.deliveryAddress
                        ?.address
                    }
                    full
                  />
                </InfoGrid>
              </Card>
            )}

            {/* SELLER */}
            {isRejected && (
              <Card
                title="ข้อมูลผู้ขาย"
                icon={UserRound}
              >
                <InfoGrid>
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

                  <Info
                    label="ที่อยู่สำหรับคืนสินค้า"
                    value={seller?.address}
                    full
                  />
                </InfoGrid>
              </Card>
            )}

            {/* PRODUCT */}
            <Card
              title="ข้อมูลสินค้า"
              icon={Package}
            >
              <div className="flex flex-col gap-5 md:flex-row">
                <div className="h-40 w-40 shrink-0 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100">
                  {coverImage?.imageUrl ? (
                    <img
                      src={
                        coverImage.imageUrl
                      }
                      alt={
                        listing?.title ||
                        "Product"
                      }
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <ImageIcon
                        size={32}
                        className="text-neutral-300"
                      />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-neutral-900">
                    {listing?.title || "-"}
                  </h3>

                  <p className="mt-1 text-sm text-neutral-500">
                    {listing?.brand || "-"}
                    {listing?.category?.name
                      ? ` • ${listing.category.name}`
                      : ""}
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-4">
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
                      value={
                        listing?.category
                          ?.name
                      }
                    />

                    <Info
                      label="ราคาซื้อขาย"
                      value={formatPrice(
                        order.agreedPrice,
                      )}
                    />

                    <Info
                      label="สภาพที่ประเมิน"
                      value={
                        listing?.estimatedCondition
                      }
                    />

                    {isVerified && (
                      <>
                        <Info
                          label="สภาพที่ตรวจสอบ"
                          value={
                            order.inspection
                              ?.verifiedCondition
                          }
                        />

                        <Info
                          label="คะแนน"
                          value={
                            order.inspection
                              ?.verifiedScore !==
                            null
                              ? `${order.inspection?.verifiedScore}/100`
                              : "-"
                          }
                        />
                      </>
                    )}

                    <Info
                      label="สถานที่"
                      value={
                        listing?.location
                      }
                    />
                  </div>

                  {listing?.description && (
                    <div className="mt-5">
                      <p className="text-xs font-medium text-neutral-400">
                        รายละเอียดสินค้า
                      </p>

                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-neutral-700">
                        {
                          listing.description
                        }
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* IMAGES */}
            <Card
              title="รูปภาพสินค้า"
              icon={ImageIcon}
            >
              {images.length === 0 ? (
                <p className="text-sm text-neutral-400">
                  ไม่มีรูปภาพสินค้า
                </p>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {images.map((image) => (
                    <div
                      key={image.id}
                      className="relative h-28 w-28 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100"
                    >
                      <img
                        src={image.imageUrl}
                        alt="Product"
                        className="h-full w-full object-cover"
                      />

                      {image.isCover && (
                        <span className="absolute bottom-2 left-2 rounded-md bg-orange-500 px-2 py-1 text-[10px] font-semibold text-white">
                          รูปปก
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* ======================
              RIGHT
          ======================= */}
          <div>
            <form
              onSubmit={handleSubmit}
              className="sticky top-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-neutral-900">
                {isVerified
                  ? "ข้อมูลการจัดส่ง"
                  : "ข้อมูลการคืนสินค้า"}
              </h2>

              <p className="mt-1 text-xs text-neutral-500">
                {isVerified
                  ? "กรอกข้อมูลพัสดุสำหรับจัดส่งให้ผู้ซื้อ"
                  : "กรอกข้อมูลพัสดุสำหรับส่งคืนให้ผู้ขาย"}
              </p>

              {/* CARRIER */}
              <div className="mt-6">
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  บริษัทขนส่ง
                </label>

                <select
                  name="carrier"
                  value={form.carrier}
                  onChange={handleChange}
                  required
                  className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm text-neutral-800 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                >
                  <option value="">
                    เลือกบริษัทขนส่ง
                  </option>

                  {THAI_CARRIERS.map(
                    (carrier) => (
                      <option
                        key={carrier}
                        value={carrier}
                      >
                        {carrier}
                      </option>
                    ),
                  )}
                </select>
              </div>

              {/* TRACKING */}
              <div className="mt-5">
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Tracking Number
                </label>

                <textarea
                  name="trackingNumber"
                  value={
                    form.trackingNumber
                  }
                  onChange={handleChange}
                  required
                  minLength={
                    isVerified ? 5 : 3
                  }
                  maxLength={
                    isVerified
                      ? 100
                      : 150
                  }
                  rows={3}
                  placeholder="เช่น TH123456789"
                  className="w-full resize-none rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 outline-none transition placeholder:text-neutral-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              {/* FAILED INSPECTION NOTE */}
              {isRejected && (
                <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-4">
                  <p className="text-sm font-semibold text-red-600">
                    หมายเหตุจากการตรวจสินค้า
                  </p>

                  <p className="mt-1 text-xs text-red-400">
                    หมายเหตุที่ Admin
                    ระบุไว้ตอนตรวจสินค้า
                  </p>

                  <div className="mt-3 min-h-24 rounded-lg border border-red-100 bg-white p-3">
                    <p className="whitespace-pre-wrap text-sm leading-6 text-neutral-700">
                      {order.inspection
                        ?.notes ||
                        "ไม่มีหมายเหตุ"}
                    </p>
                  </div>
                </div>
              )}

              {/* DESTINATION */}
              <div className="mt-5 rounded-xl bg-neutral-50 p-4">
                <div className="flex gap-3">
                  <MapPin
                    size={18}
                    className={
                      isVerified
                        ? "mt-0.5 shrink-0 text-orange-500"
                        : "mt-0.5 shrink-0 text-red-500"
                    }
                  />

                  <div>
                    <p className="text-sm font-semibold text-neutral-800">
                      {isVerified
                        ? "จัดส่งไปยัง"
                        : "ส่งคืนไปยัง"}
                    </p>

                    <p className="mt-2 text-sm font-medium text-neutral-700">
                      {isVerified
                        ? order
                            .deliveryAddress
                            ?.recipientName ||
                          buyerName ||
                          "-"
                        : sellerName ||
                          "-"}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-neutral-500">
                      {isVerified
                        ? order
                            .deliveryAddress
                            ?.address ||
                          "-"
                        : seller?.address ||
                          "-"}
                    </p>

                    <p className="mt-1 text-xs text-neutral-500">
                      {isVerified
                        ? order
                            .deliveryAddress
                            ?.phone ||
                          "-"
                        : seller?.phone ||
                          "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* ACTION */}
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() =>
                    navigate(
                      "/admin/orders/ready-to-ship",
                    )
                  }
                  className="flex-1 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-600 transition hover:bg-neutral-50 disabled:opacity-50"
                >
                  ยกเลิก
                </button>

                <button
                  type="submit"
                  disabled={isPending}
                  className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                    isVerified
                      ? "bg-orange-500 hover:bg-orange-600"
                      : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  {isPending
                    ? "กำลังดำเนินการ..."
                    : isVerified
                      ? "ยืนยันการจัดส่ง"
                      : "ยืนยันคืนสินค้า"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({
  title,
  icon: Icon,
  children,
}) {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        {Icon && (
          <Icon
            size={18}
            className="text-orange-500"
          />
        )}

        <h2 className="text-base font-semibold text-neutral-900">
          {title}
        </h2>
      </div>

      {children}
    </section>
  );
}

function InfoGrid({ children }) {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
      {children}
    </div>
  );
}

function Info({
  label,
  value,
  full = false,
}) {
  return (
    <div
      className={
        full ? "sm:col-span-2" : ""
      }
    >
      <p className="text-xs font-medium text-neutral-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-medium text-neutral-800">
        {value || "-"}
      </p>
    </div>
  );
}

function StatusBadge({ status }) {
  if (status === "VERIFIED") {
    return (
      <span className="rounded-full bg-green-100 px-4 py-2 text-xs font-semibold text-green-700">
        ผ่านการตรวจ
      </span>
    );
  }

  if (status === "REJECTED") {
    return (
      <span className="rounded-full bg-red-100 px-4 py-2 text-xs font-semibold text-red-600">
        ไม่ผ่านการตรวจ
      </span>
    );
  }

  return (
    <span className="rounded-full bg-neutral-100 px-4 py-2 text-xs font-semibold text-neutral-600">
      {status}
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

  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export default ShippingDetail;