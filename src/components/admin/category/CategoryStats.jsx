import {
  CircleCheck,
  CircleOff,
  ListTree,
} from "lucide-react";

function CategoryStats({ stats }) {
  const statItems = [
    {
      title: "Total Categories",
      number: stats.total,
      icon: ListTree,
      iconClassName: "bg-orange-50 text-orange-500",
    },
    {
      title: "Active",
      number: stats.active,
      icon: CircleCheck,
      iconClassName: "bg-green-50 text-green-600",
    },
    {
      title: "Disabled",
      number: stats.disabled,
      icon: CircleOff,
      iconClassName: "bg-neutral-100 text-neutral-500",
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
      {statItems.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="
              rounded-2xl
              border border-neutral-200
              bg-white
              p-5
              shadow-sm
            "
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-2xl font-bold text-neutral-900">
                  {item.number}
                </p>

                <p className="mt-1 text-xs font-medium text-neutral-500">
                  {item.title}
                </p>
              </div>

              <div
                className={`
                  flex size-11 shrink-0
                  items-center justify-center
                  rounded-xl
                  ${item.iconClassName}
                `}
              >
                <Icon size={20} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default CategoryStats;