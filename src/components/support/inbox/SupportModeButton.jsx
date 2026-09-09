function SupportModeButton({
  icon: Icon,
  label,
  count,
  unreadCount,
  isActive,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={`relative flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold transition ${
        isActive
          ? "bg-neutral-900 text-white shadow-sm"
          : "text-neutral-500 hover:bg-orange-50 hover:text-orange-600"
      }`}
    >
      <Icon size={18} />
      {label}
      <span
        className={`inline-flex min-w-6 items-center justify-center rounded-full px-1.5 py-0.5 text-[11px] ${
          isActive
            ? "bg-white/15 text-white"
            : "bg-neutral-100 text-neutral-500"
        }`}
      >
        {count}
      </span>

      {unreadCount > 0 && (
        <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-orange-500 px-1.5 py-0.5 text-[10px] font-black text-white">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  );
}

export default SupportModeButton;
