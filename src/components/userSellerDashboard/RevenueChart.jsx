import React, { useMemo } from "react";

// GLASS_PANEL
const GLASS_PANEL =
  "border border-neutral-200/70 bg-white/50 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_8px_24px_rgba(0,0,0,0.06)]";

export function RevenueChart({ monthlyData }) {
  const chartPoints = useMemo(() => {
    if (!monthlyData || monthlyData.length === 0)
      return { pathD: "", areaD: "", points: [], width: 800 };

    const maxVal = Math.max(...monthlyData.map((d) => d.total), 1);
    const width = 800;
    const height = 130; // 🟢 ปรับลดความสูงจำลอง SVG ให้กระชับขึ้น (จากเดิม 180)
    const paddingY = 18; // 🟢 ปรับลด Padding Y
    const paddingX = 45; // 🟢 เว้นระยะขอบซ้าย-ขวาอย่างพอดี

    const usableWidth = width - paddingX * 2;

    const points = monthlyData.map((item, index) => {
      const x =
        monthlyData.length === 1
          ? width / 2
          : paddingX + (index / (monthlyData.length - 1)) * usableWidth;
      
      const y =
        height - paddingY - (item.total / maxVal) * (height - paddingY * 2);

      const xPercent = (x / width) * 100;

      return { x, y, xPercent, ...item };
    });

    if (points.length === 1) {
      return {
        pathD: `M ${paddingX} ${points[0].y} L ${width - paddingX} ${points[0].y}`,
        areaD: "",
        points,
        width,
      };
    }

    let pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      const controlX = (curr.x + next.x) / 2;
      pathD += ` C ${controlX} ${curr.y}, ${controlX} ${next.y}, ${next.x} ${next.y}`;
    }

    const areaD = `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

    return { pathD, areaD, points, width, height };
  }, [monthlyData]);

  return (
    <div className={`rounded-3xl p-5 space-y-3 ${GLASS_PANEL}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200/70 pb-2.5">
        <div>
          <h2 className="font-bold text-sm sm:text-base text-neutral-900">
            Revenue Performance Trend
          </h2>
          <p className="text-[11px] sm:text-xs text-neutral-500">
            6-Month sales growth visualization
          </p>
        </div>
        <span className="text-[11px] font-bold text-emerald-600 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
          Monthly Revenue (฿)
        </span>
      </div>

      {/* Chart Area */}
      <div className="relative w-full pt-1 pb-4">
        {/* 🟢 ปรับความสูง Container ให้กระชับที่ h-36 (144px) จากเดิม h-52 (208px) */}
        <div className="h-36 w-full relative">
          <svg
            className="w-full h-full overflow-visible"
            viewBox="0 0 800 130"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            <line
              x1="0"
              y1="18"
              x2="800"
              y2="18"
              stroke="currentColor"
              className="text-neutral-200/70"
              strokeDasharray="4"
            />
            <line
              x1="0"
              y1="65"
              x2="800"
              y2="65"
              stroke="currentColor"
              className="text-neutral-200/70"
              strokeDasharray="4"
            />
            <line
              x1="0"
              y1="112"
              x2="800"
              y2="112"
              stroke="currentColor"
              className="text-neutral-200/70"
              strokeDasharray="4"
            />

            {/* Area & Line Path */}
            {chartPoints.areaD && (
              <path d={chartPoints.areaD} fill="url(#areaGradient)" />
            )}
            {chartPoints.pathD && (
              <path
                d={chartPoints.pathD}
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                strokeLinecap="round"
              />
            )}

            {/* SVG Circle Points */}
            {chartPoints.points.map((pt, idx) => (
              <g key={idx}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="5"
                  className="fill-white stroke-emerald-500 stroke-[3] transition-all duration-200"
                />
              </g>
            ))}
          </svg>

          {/* HTML Overlay สำหรับ Tooltip และ Label เดือน */}
          <div className="absolute inset-0 pointer-events-none">
            {chartPoints.points.map((pt, idx) => (
              <div
                key={idx}
                className="absolute top-0 bottom-0 flex flex-col justify-between items-center -translate-x-1/2 pointer-events-auto group"
                style={{ left: `${pt.xPercent}%` }}
              >
                {/* Tooltip บนจุด */}
                <div
                  className="opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-800 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-md whitespace-nowrap z-30 pointer-events-none absolute"
                  style={{
                    top: `${(pt.y / 130) * 100}%`,
                    transform: "translateY(-125%)",
                  }}
                >
                  ฿{pt.total.toLocaleString()} ({pt.count} orders)
                </div>

                {/* Label ชื่อเดือน */}
                <span className="text-[11px] font-bold text-neutral-500 absolute -bottom-5 whitespace-nowrap">
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