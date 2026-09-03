function DashboardStatCard({
  title,
  value,
  icon: Icon,
  iconClassName,
  iconBackgroundClassName,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full cursor-pointer items-center justify-between rounded-2xl border border-base-300 bg-base-100 p-5 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
    >
      <div>
        <p className="text-sm font-bold text-base-content/70">
          {title}
        </p>

        <p className="mt-2 text-3xl font-black text-base-content">
          {value}
        </p>

        <p className="mt-1 text-xs text-base-content/50">
          รายการ
        </p>
      </div>

      <span
        className={`flex size-14 shrink-0 items-center justify-center rounded-2xl transition group-hover:scale-105 ${iconBackgroundClassName}`}
      >
        <Icon
          size={28}
          strokeWidth={1.8}
          className={iconClassName}
          aria-hidden="true"
        />
      </span>
    </button>
  );
}

export default DashboardStatCard;