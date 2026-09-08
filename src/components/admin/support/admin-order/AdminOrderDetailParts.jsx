import { Mail, Phone } from "lucide-react";

import {
  formatDisplayValue,
  formatEnumLabel,
  getPersonName,
  ORDER_STATUS_STYLES,
} from "./adminOrderContext.utils";

function OrderStatusBadge({ status }) {
  const className =
    ORDER_STATUS_STYLES[status] || "bg-neutral-100 text-neutral-700";
  return (
    <span
      className={`inline-flex w-fit rounded-full px-2.5 py-1 text-[11px] font-bold ${className}`}
    >
      {formatEnumLabel(status || "Unknown")}
    </span>
  );
}

function DetailCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-neutral-200 p-4">
      <span className="flex size-9 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
        <Icon size={18} />
      </span>
      <p className="mt-3 text-xs font-semibold text-neutral-400">{label}</p>
      <p className="mt-1 break-words text-sm font-bold text-neutral-800">
        {formatDisplayValue(value) || "-"}
      </p>
    </div>
  );
}

function PersonCard({ icon: Icon, title, person }) {
  return (
    <InfoSection icon={Icon} title={title}>
      <div className="space-y-3">
        <p className="font-bold text-neutral-900">
          {getPersonName(person, `Unknown ${title}`)}
        </p>
        <div className="space-y-2 text-sm text-neutral-500">
          <p className="flex items-center gap-2 break-all">
            <Mail size={15} className="shrink-0 text-neutral-400" />
            {person?.email || "Email not available"}
          </p>
          <p className="flex items-center gap-2">
            <Phone size={15} className="shrink-0 text-neutral-400" />
            {person?.phone || person?.phoneNumber || "Phone not available"}
          </p>
        </div>
      </div>
    </InfoSection>
  );
}

function InfoSection({ icon: Icon, title, children }) {
  return (
    <section className="rounded-2xl border border-neutral-200 p-4">
      <div className="mb-4 flex items-center gap-2 border-b border-neutral-100 pb-3">
        <Icon size={18} className="text-orange-500" />
        <h3 className="text-sm font-bold text-neutral-900">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function ModalInfoRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-neutral-400">{label}</dt>
      <dd className="break-all text-right font-semibold text-neutral-800">
        {formatDisplayValue(value) || "-"}
      </dd>
    </div>
  );
}

function EmptyValue({ text }) {
  return <p className="text-sm text-neutral-400">{text}</p>;
}

export {
  DetailCard,
  EmptyValue,
  InfoSection,
  ModalInfoRow,
  OrderStatusBadge,
  PersonCard,
};
