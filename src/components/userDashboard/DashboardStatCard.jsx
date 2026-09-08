function DashboardStatCard({
  label,
  value,
  unit,
  icon: Icon,
  iconClassName = "",
  cardClassName = "",
  watermarkClassName = "",
  actionText,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative min-h-32 w-full cursor-pointer overflow-hidden rounded-2xl border p-5 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md ${cardClassName}`}
    >
      {/* ไอคอนลายน้ำด้านหลัง */}
      {/* <Icon
        size={76}
        strokeWidth={1.5}
        className={`pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 opacity-10 ${watermarkClassName}`}
        aria-hidden="true"
      /> */}

      <div className="relative z-10 flex h-full items-center gap-5">
        {/* ไอคอนด้านซ้าย */}
        <span
          className={`flex size-14 shrink-0 items-center justify-center rounded-2xl ${iconClassName}`}
        >
          <Icon size={28} strokeWidth={2.2} />
        </span>

        {/* ข้อมูล */}
        <div className="min-w-0">
          <div className="flex items-end gap-2">
            <p className="text-3xl font-bold text-neutral-900">
              {value}
            </p>

            <span className="mb-1 text-xs text-neutral-400">
              {unit}
            </span>
          </div>

          <h2 className="mt-1 text-sm font-semibold text-neutral-700">
            {label}
          </h2>

          {actionText && (
            <p className="mt-2 text-xs font-semibold text-orange-500 transition group-hover:text-orange-600">
              {actionText} →
            </p>
          )}
        </div>
      </div>
    </button>
  );
}

export default DashboardStatCard;