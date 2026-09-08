import { useState } from "react";
import {
  ArrowLeft,
  ClipboardCheck,
  LoaderCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";

import { useAdminOrderById } from "@/hook/order/useAdminOrderById";
import { useCompleteOrderInspection } from "@/hook/order/useCompleteOrderInspection";

import InspectionDetailContent from "@/components/admin/order/inspection/InspectionDetailContent";
import InspectionResultForm from "@/components/admin/order/inspection/InspectionResultForm";

function InspectionDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const orderQuery =
    useAdminOrderById(orderId);

  const completeInspectionMutation =
    useCompleteOrderInspection();

  const [form, setForm] = useState({
    result: "",
    verifiedCondition: "",
    verifiedScore: "",
    notes: "",
  });

  const order = orderQuery.data;

  const handleChange = (event) => {
    const { name, value } =
      event.target;

    if (name === "result") {
      setForm((prev) => ({
        ...prev,
        result: value,
        verifiedCondition:
          value === "PASSED"
            ? prev.verifiedCondition
            : "",
        verifiedScore:
          value === "PASSED"
            ? prev.verifiedScore
            : "",
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
        verifiedCondition:
          form.verifiedCondition,
        verifiedScore: Number(
          form.verifiedScore,
        ),
      };

      if (form.notes.trim()) {
        payload.notes =
          form.notes.trim();
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
          navigate(
            "/admin/orders/ready-to-ship",
          );
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
          Loading order details...
        </span>
      </div>
    );
  }

  if (
    orderQuery.isError ||
    !order
  ) {
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
                "/admin/orders/inspection",
              )
            }
            className="mt-4 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-orange-600"
          >
            Back to Inspection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F4] px-8 py-6">
      <div className="mx-auto w-full max-w-[1450px]">
        {/* BACK */}
        <button
          type="button"
          onClick={() =>
            navigate(
              "/admin/orders/inspection",
            )
          }
          className="mb-5 flex items-center gap-2 text-sm text-neutral-500 transition hover:text-neutral-900"
        >
          <ArrowLeft size={17} />
          Back to Inspection
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
              Product Inspection
            </h1>

            <p className="mt-1 text-sm text-neutral-500">
              {order.orderNumber}
            </p>
          </div>
        </div>

        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_400px]">
          <InspectionDetailContent
            order={order}
          />

          <InspectionResultForm
            form={form}
            onChange={handleChange}
            onSubmit={handleSubmit}
            isPending={
              completeInspectionMutation.isPending
            }
            onCancel={() =>
              navigate(
                "/admin/orders/inspection",
              )
            }
          />
        </div>
      </div>
    </div>
  );
}

export default InspectionDetail;