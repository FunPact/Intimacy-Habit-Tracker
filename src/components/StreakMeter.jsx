import React from "react";

export default function StreakMeter({ value = 0, target = 7 }) {
  const pct = Math.min(100, Math.round((value / target) * 100));
  return (
    <div style={{ width: "100%", maxWidth: 480 }}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-gray-600">Streak: {value} days</span>
        <span className="text-sm text-gray-600">Next: {target} days</span>
      </div>
      <div className="w-full bg-gray-200 rounded h-3">
        <div
          className="bg-green-500 h-3 rounded"
          style={{ width: `${pct}%`, transition: "width 300ms ease" }}
        />
      </div>
    </div>
  );
}
