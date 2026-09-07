import { useState } from "react";
import {
  ArrowLeft,
  ClipboardCheck,
  FileText,
  ImageIcon,
  LoaderCircle,
  Package,
  UserRound,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";

import { useAdminOrderById } from "@/hook/order/useAdminOrderById";
import { useCompleteOrderInspection } from "@/hook/order/useCompleteOrderInspection";

function InspectionDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const orderQuery = useAdminOrderById(orderId);
  const completeInspectionMutation = useCompleteOrderInspection();

  const [form, setForm] = useState({
    result: "",
    verifiedCondition: "",
    verifiedScore: "",
    notes: "",
  });

  const order = orderQuery.data;

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "result") {
      setForm((prev) => ({
        ...prev,
        result: value,
        verifiedCondition:
          value === "PASSED" ? prev.verifiedCondition : "",
        verifiedScore:
          value === "PASSED" ? prev.verifiedScore : "",
      }));

      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    let payload;

    if (form.result === "PASSED") {
      payload = {
        result: "PASSED",
        verifiedCondition: form.verifiedCondition,
        verifiedScore: Number(form.verifiedScore),
      };

      if (form.notes.trim()) {
        payload.notes = form.notes.trim();
      }
    } else {
      payload = {
        result: form.result,
        notes: form.notes.trim(),
      };
    }

    completeInspectionMutation.mutate(
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
            onClick={() => navigate("/admin/orders/inspection")}
            className="mt-4 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-orange-600"
          >
            กลับหน้ารอตรวจ
          </button>
        </div>
      </div>
    );
  }

  const listing = order.listing;
  const seller = order.seller;
  const images = listing?.images ?? [];

  const sellerName =
    `${seller?.firstName ?? ""} ${seller?.lastName ?? ""}`.trim() || "-";

  const coverImage =
    images.find((image) => image.isCover)?.imageUrl ||
    images[0]?.imageUrl ||
    null;

  return (
    <div className="min-h-screen bg-[#F5F5F4] px-8 py-6">
      <div className="mx-auto w-full max-w-[1450px]">
        {/* BACK */}
        <button
          type="button"
          onClick={() => navigate("/admin/orders/inspection")}
          className="mb-5 flex items-center gap-2 text-sm text-neutral-500 transition hover:text-neutral-900"
        >
          <ArrowLeft size={17} />
          กลับหน้ารอตรวจ
        </button>

        {/* HEADER */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100">
            <ClipboardCheck
              size={22}
              className="text-orange-500"
            />
          </div>

          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">
              ตรวจสอบสินค้า
            </h1>

            <p className="mt-1 text-sm text-neutral-500">
              {order.orderNumber}
            </p>
          </div>
        </div>

        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_400px]">
          {/* LEFT */}
          <div className="space-y-5">
            {/* ORDER */}
            <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-2">
                <FileText size={19} />

                <h2 className="font-semibold text-neutral-900">
                  ข้อมูลออเดอร์
                </h2>
              </div>

              <div className="grid gap-x-14 gap-y-5 md:grid-cols-2">
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
                    สถานะปัจจุบัน
                  </p>

                  <div className="mt-2">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-600">
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* SELLER */}
            <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-2">
                <UserRound size={19} />

                <h2 className="font-semibold text-neutral-900">
                  ข้อมูลผู้ขาย
                </h2>
              </div>

              <div className="grid gap-x-14 gap-y-5 md:grid-cols-2">
                <Info
                  label="ชื่อผู้ขาย"
                  value={sellerName}
                />

                <Info
                  label="Email"
                  value={seller?.email}
                />

                <Info
                  label="เบอร์โทรศัพท์"
                  value={seller?.phone}
                />

                <Info
                  label="Seller ID"
                  value={seller?.id}
                />
              </div>
            </section>

            {/* PRODUCT */}
            <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-2">
                <Package size={19} />

                <h2 className="font-semibold text-neutral-900">
                  ข้อมูลสินค้า
                </h2>
              </div>

              <div className="grid gap-6 md:grid-cols-[230px_1fr]">
                {/* COVER */}
                <div className="overflow-hidden rounded-xl bg-neutral-100">
                  {coverImage ? (
                    <img
                      src={coverImage}
                      alt={listing?.title || "Product"}
                      className="aspect-[4/3] h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex aspect-[4/3] items-center justify-center">
                      <ImageIcon
                        size={36}
                        className="text-neutral-300"
                      />
                    </div>
                  )}
                </div>

                {/* INFO */}
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900">
                    {listing?.title || "-"}
                  </h3>

                  <div className="mt-6 grid gap-x-12 gap-y-5 sm:grid-cols-2">
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
                      value={formatPrice(order.agreedPrice)}
                    />

                    <div>
                      <p className="text-xs text-neutral-400">
                        สภาพโดยประมาณ
                      </p>

                      <div className="mt-2">
                        <ConditionBadge
                          condition={listing?.estimatedCondition}
                        />
                      </div>
                    </div>

                    <Info
                      label="สถานที่สินค้า"
                      value={listing?.location}
                    />
                  </div>
                </div>
              </div>

              {listing?.description && (
                <div className="mt-5 border-t border-neutral-100 pt-4">
                  <p className="text-sm font-semibold text-neutral-800">
                    รายละเอียดสินค้า
                  </p>

                  <p className="mt-2 text-sm leading-6 text-neutral-600">
                    {listing.description}
                  </p>
                </div>
              )}
            </section>

            {/* IMAGES */}
            <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-2">
                <ImageIcon size={19} />

                <h2 className="font-semibold text-neutral-900">
                  รูปภาพสินค้าทั้งหมด
                </h2>

                <span className="text-sm text-neutral-500">
                  ({images.length} รูป)
                </span>
              </div>

              {images.length === 0 ? (
                <div className="flex h-32 items-center justify-center rounded-xl bg-neutral-50">
                  <span className="text-sm text-neutral-400">
                    ไม่มีรูปภาพสินค้า
                  </span>
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {images.map((image, index) => (
                    <div
                      key={image.id ?? index}
                      className="h-32 w-32 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100"
                    >
                      <img
                        src={image.imageUrl}
                        alt={`${listing?.title || "Product"} ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* RIGHT */}
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm xl:sticky xl:top-6"
          >
            <div className="flex items-center gap-2">
              <ClipboardCheck
                size={20}
                className="text-orange-500"
              />

              <h2 className="text-base font-semibold text-neutral-900">
                ผลการตรวจสินค้า
              </h2>
            </div>

            <p className="mt-2 text-xs text-neutral-500">
              ระบุผลการตรวจสอบสินค้าที่ได้รับจากผู้ขาย
            </p>

            {/* RESULT */}
            <div className="mt-6">
              <label className="text-sm font-medium text-neutral-800">
                ผลการตรวจ
                <span className="ml-1 text-red-500">*</span>
              </label>

              <select
                name="result"
                value={form.result}
                onChange={handleChange}
                required
                className="mt-2 h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              >
                <option value="">
                  เลือกผลการตรวจ
                </option>

                <option value="PASSED">
                  ผ่านการตรวจ
                </option>

                <option value="FAILED">
                  ไม่ผ่านการตรวจ
                </option>

                <option value="NEEDS_REVIEW">
                  ต้องตรวจสอบเพิ่มเติม
                </option>
              </select>
            </div>

            {/* CONDITION */}
            {form.result === "PASSED" && (
              <div className="mt-5">
                <label className="text-sm font-medium text-neutral-800">
                  สภาพสินค้าที่ตรวจพบ
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <select
                  name="verifiedCondition"
                  value={form.verifiedCondition}
                  onChange={handleChange}
                  required
                  className="mt-2 h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                >
                  <option value="">
                    เลือกสภาพสินค้า
                  </option>

                  <option value="LIKE_NEW">
                    LIKE NEW
                  </option>

                  <option value="GOOD">
                    GOOD
                  </option>

                  <option value="FAIR">
                    FAIR
                  </option>

                  <option value="POOR">
                    POOR
                  </option>
                </select>
              </div>
            )}

            {/* SCORE */}
            {form.result === "PASSED" && (
              <div className="mt-5">
                <label className="text-sm font-medium text-neutral-800">
                  คะแนนสภาพสินค้า
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <input
                  type="number"
                  name="verifiedScore"
                  value={form.verifiedScore}
                  onChange={handleChange}
                  min={0}
                  max={100}
                  required
                  placeholder="0 - 100"
                  className="mt-2 h-11 w-full rounded-xl border border-neutral-200 px-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
              </div>
            )}

            {/* NOTES */}
            {form.result && (
              <div className="mt-5">
                <label className="text-sm font-medium text-neutral-800">
                  หมายเหตุ

                  {form.result !== "PASSED" && (
                    <span className="ml-1 text-red-500">*</span>
                  )}
                </label>

                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  required={form.result !== "PASSED"}
                  rows={6}
                  maxLength={2000}
                  placeholder={
                    form.result === "PASSED"
                      ? "ระบุหมายเหตุเพิ่มเติม (ถ้ามี)"
                      : "ระบุสาเหตุหรือรายละเอียดที่ตรวจพบ"
                  }
                  className="mt-2 w-full resize-none rounded-xl border border-neutral-200 p-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />

                <p className="mt-1 text-right text-xs text-neutral-400">
                  {form.notes.length}/2000
                </p>
              </div>
            )}

            {/* BUTTON */}
            <div className="mt-7 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => navigate("/admin/orders/inspection")}
                disabled={completeInspectionMutation.isPending}
                className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                ยกเลิก
              </button>

              <button
                type="submit"
                disabled={
                  completeInspectionMutation.isPending ||
                  !form.result
                }
                className="rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {completeInspectionMutation.isPending
                  ? "กำลังบันทึก..."
                  : "ยืนยันผลตรวจ"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
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

function ConditionBadge({ condition }) {
  if (!condition) {
    return (
      <span className="text-sm text-neutral-500">
        -
      </span>
    );
  }

  return (
    <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
      {condition}
    </span>
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

export default InspectionDetail;