import { useState } from "react";
import {
  ArrowLeft,
  LoaderCircle,
} from "lucide-react";
import {
  useNavigate,
  useParams,
} from "react-router";

import ShippingDetailContent from "@/components/admin/order/ready-to-ship/ShippingDetailContent";
import ShippingForm from "@/components/admin/order/ready-to-ship/ShippingForm";

import { useAdminOrderById } from "@/hook/order/useAdminOrderById";
import { useShipOrderToBuyer } from "@/hook/order/useShipOrderToBuyer";
import { useReturnOrderToSeller } from "@/hook/order/useReturnToSeller";

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
          Loading order details...
        </span>
      </div>
    );
  }

  if (orderQuery.isError || !order) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-red-500">
            Unable to load order details
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
            Back
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
     * Ship product to Buyer
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
     * Return product to Seller
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
          Back to Ready to Ship
        </button>

        {/* HEADER */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">
              {isVerified
                ? "Ship Product to Buyer"
                : "Return Product to Seller"}
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
          <ShippingDetailContent
            order={order}
            isVerified={isVerified}
            isRejected={isRejected}
            buyerName={buyerName}
            sellerName={sellerName}
          />

          <ShippingForm
            order={order}
            seller={seller}
            buyerName={buyerName}
            sellerName={sellerName}
            isVerified={isVerified}
            isRejected={isRejected}
            isPending={isPending}
            form={form}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={() =>
              navigate(
                "/admin/orders/ready-to-ship",
              )
            }
          />
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  if (status === "VERIFIED") {
    return (
      <span className="rounded-full bg-green-100 px-4 py-2 text-xs font-semibold text-green-700">
        Inspection Passed
      </span>
    );
  }

  if (status === "REJECTED") {
    return (
      <span className="rounded-full bg-red-100 px-4 py-2 text-xs font-semibold text-red-600">
        Inspection Failed
      </span>
    );
  }

  return (
    <span className="rounded-full bg-neutral-100 px-4 py-2 text-xs font-semibold text-neutral-600">
      {status}
    </span>
  );
}

export default ShippingDetail;