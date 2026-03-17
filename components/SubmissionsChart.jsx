"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getLast30Days } from "@/lib/utils";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#e8e8e6] rounded-lg px-3 py-2 text-sm" style={{ boxShadow: "var(--shadow-md)" }}>
        <p className="text-[#9c9c96] text-xs mb-0.5">{label}</p>
        <p className="text-[#1a1a18] font-semibold tabular-nums">
          {payload[0].value} {payload[0].value === 1 ? "submission" : "submissions"}
        </p>
      </div>
    );
  }
  return null;
};

export default function SubmissionsChart({ submissions }) {
  const data = getLast30Days(submissions);

  const formatted = data.map((d) => ({
    ...d,
    label: new Date(d.date + "T00:00:00").toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }));

  return (
    <div className="bg-white border border-[#e8e8e6] rounded-xl p-5 mb-6" style={{ boxShadow: "var(--shadow-xs)" }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-sm font-semibold text-[#1a1a18]">Submissions over time</h2>
          <p className="text-xs text-[#9c9c96] mt-0.5">Last 30 days</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={formatted} margin={{ top: 2, right: 4, left: -24, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0ee" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "#b8b8b2", fontFamily: "Inter" }}
            tickLine={false}
            axisLine={false}
            interval={4}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#b8b8b2", fontFamily: "Inter" }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8f8f7" }} />
          <Bar dataKey="count" fill="#2458f1" radius={[3, 3, 0, 0]} maxBarSize={28} opacity={0.85} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
