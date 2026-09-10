import {
  ArrowRight,
  LoaderCircle,
} from "lucide-react";
import { Link } from "react-router";

function DashboardSummary({
  items,
  orders,
  isPending,
  hasData,
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;

        /*
         * Count orders from statuses
         */
        const count = orders.filter(
          (order) =>
            item.statuses.includes(
              order.status,
            ),
        ).length;

        return (
          <Link
            key={item.title}
            to={item.path}
            className="
              group
              rounded-2xl
              border border-neutral-200
              bg-white
              p-5
              shadow-sm
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:border-orange-200
              hover:shadow-md
            "
          >
            <div className="flex items-center gap-4">
              {/* ICON */}
              <div
                className={`
                  flex size-12 shrink-0
                  items-center justify-center
                  rounded-xl
                  ${item.iconClassName}
                `}
              >
                <Icon size={22} />
              </div>

              {/* INFO */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-neutral-500">
                  {item.title}
                </p>

                <div className="mt-1 text-2xl font-bold text-neutral-900">
                  {isPending ? (
                    <LoaderCircle
                      size={23}
                      className="animate-spin text-orange-500"
                    />
                  ) : hasData ? (
                    count.toLocaleString(
                      "en-US",
                    )
                  ) : (
                    "—"
                  )}
                </div>
              </div>

              {/* ARROW */}
              <ArrowRight
                size={18}
                className="
                  shrink-0
                  text-neutral-400
                  transition-all
                  duration-200
                  group-hover:translate-x-1
                  group-hover:text-orange-500
                "
              />
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default DashboardSummary;