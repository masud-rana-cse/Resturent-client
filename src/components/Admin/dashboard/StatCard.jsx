import { useEffect, useState } from "react";

export function StatCard({
  label,
  value,
  prefix,
  suffix,
  gradient,
  icon,
  change,
  up,
}) {
  const [displayed, setDisplayed] = useState(0);

  // Count-up animation on mount
  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 900;
    const step = Math.ceil(end / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setDisplayed(end);
        clearInterval(timer);
      } else setDisplayed(start);
    }, 16);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <div
      className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100
      hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-5"
    >
      {/* Icon bubble */}
      <div
        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient}
        flex items-center justify-center flex-shrink-0 shadow-lg`}
      >
        {icon}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-500 font-medium mb-1">{label}</p>
        <p className="text-3xl font-extrabold text-[#1e2a3a] tracking-tight leading-none">
          {prefix}
          {displayed.toLocaleString()}
          {suffix}
        </p>
        {change && (
          <p
            className={`text-xs mt-1.5 font-medium flex items-center gap-1
            ${up === true ? "text-emerald-600" : up === false ? "text-red-500" : "text-gray-400"}`}
          >
            {up === true && "↑"}
            {up === false && "↓"}
            {change}
          </p>
        )}
      </div>
    </div>
  );
}
