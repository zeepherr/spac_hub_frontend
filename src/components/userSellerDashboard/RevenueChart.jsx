import React, { useMemo } from "react";

// เดียวกับ GLASS_PANEL ที่ใช้ทั้งเว็บ
const GLASS_PANEL =
  "border border-neutral-200/70 bg-white/50 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_8px_24px_rgba(0,0,0,0.06)]";

export function RevenueChart({ monthlyData }) {
  const chartPoints = useMemo(() => {
    if (!monthlyData || monthlyData.length === 0)
      return { pathD: "", areaD: "", points: [] };

    const maxVal = Math.max(...monthlyData.map((d) => d.total), 1);
    const width = 800;
    const height = 180;
    const paddingY = 20;

    const points = monthlyData.map((item, index) => {
      const x = (index / (monthlyData.length - 1)) * width;
      const y =
        height - paddingY - (item.total / maxVal) * (height - paddingY * 2);
      return { x, y, ...item };
    });

    if (points.length === 1) {
      return {
        pathD: `M 0 ${points[0].y} L ${width} ${points[0].y}`,
        areaD: "",
        points,
      };
    }

    let pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      const controlX = (curr.x + next.x) / 2;
      pathD += ` C ${controlX} ${curr.y}, ${controlX} ${next.y}, ${next.x} ${next.y}`;
    }

    const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`;

    return { pathD, areaD, points };
  }, [monthlyData]);

  return (
    <div className={`rounded-3xl p-6 space-y-4 ${GLASS_PANEL}`}>
      <div className="flex items-center justify-between border-b border-neutral-200/70 pb-3">
        <div>
          <h2 className="font-bold text-base text-neutral-900">
            Revenue Performance Trend
          </h2>
          <p className="text-xs text-neutral-500">
            6-Month sales growth visualization
          </p>
        </div>
        <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full">
          Monthly Revenue (฿)
        </span>
      </div>

      <div className="relative w-full pt-4">
        <div className="h-52 w-full relative">
          <svg
            className="w-full h-full overflow-visible"
            viewBox="0 0 800 180"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            <line
              x1="0"
              y1="20"
              x2="800"
              y2="20"
              stroke="currentColor"
              className="text-neutral-200"
              strokeDasharray="4"
            />
            <line
              x1="0"
              y1="90"
              x2="800"
              y2="90"
              stroke="currentColor"
              className="text-neutral-200"
              strokeDasharray="4"
            />
            <line
              x1="0"
              y1="160"
              x2="800"
              y2="160"
              stroke="currentColor"
              className="text-neutral-200"
              strokeDasharray="4"
            />

            {chartPoints.areaD && (
              <path d={chartPoints.areaD} fill="url(#areaGradient)" />
            )}
            {chartPoints.pathD && (
              <path
                d={chartPoints.pathD}
                fill="none"
                stroke="#10b981"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            )}

            {chartPoints.points.map((pt, idx) => (
              <g key={idx} className="group/point cursor-pointer">
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="6"
                  className="fill-white stroke-emerald-500 stroke-[3] group-hover/point:r-8 transition-all duration-200"
                />
              </g>
            ))}
          </svg>

          <div className="absolute inset-0 flex justify-between pointer-events-none">
            {chartPoints.points.map((pt, idx) => (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center justify-between group pointer-events-auto"
              >
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-800 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-md whitespace-nowrap z-30 -translate-y-2">
                  ฿{pt.total.toLocaleString()} ({pt.count} orders)
                </div>
                <span className="text-xs font-bold text-neutral-500 mt-2">
                  {pt.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
