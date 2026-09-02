import { Heart, ShieldCheck, Trash2 } from "lucide-react";

function formatPrice(amount) {
  return `฿${amount.toLocaleString()}`;
}

function ProductCartCard({ item }) {
  return (
    <div className="flex gap-4 border-b border-neutral-100 pb-4 last:border-0 last:pb-0">
      <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-box bg-neutral-50">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="h-full w-full bg-neutral-100" />
        )}
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <p className="line-clamp-1 font-semibold text-neutral-900">
            {item.title}
          </p>
          <p className="shrink-0 text-xl font-bold text-neutral-900">
            {formatPrice(item.price)}
          </p>
        </div>

        <p className="hardware-label mt-1 normal-case text-secondary">
          สภาพ: {item.condition} • จำนวน: {item.qty}
        </p>

        <span className="mt-2 flex w-fit items-center gap-1 rounded-field bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
          <ShieldCheck size={12} />
          ผู้ขายยืนยันตัวตนแล้ว: {item.sellerName}
        </span>

        <div className="mt-auto flex items-center gap-4 pt-3">
          <button
            type="button"
            className="flex items-center gap-1 text-xs font-medium text-neutral-500 hover:text-[#dc2626]"
          >
            <Trash2 size={14} />
            ลบ
          </button>
          <span className="text-neutral-200">|</span>
          <button
            type="button"
            className="flex items-center gap-1 text-xs font-medium text-neutral-500 hover:text-[#f97316]"
          >
            <Heart size={14} />
            บันทึกไว้ก่อน
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCartCard;
