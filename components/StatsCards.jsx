"use client";

import { Users, TrendingUp, Clock, CheckCircle } from "lucide-react";

export default function StatsCards({ submissions }) {
  const total = submissions.length;
  const now = Date.now();

  const last7Days = submissions.filter((s) => {
    const ts = s.values?.submitted_at ?? new Date(s.createdAt).getTime();
    return now - ts < 7 * 24 * 60 * 60 * 1000;
  }).length;

  const last30Days = submissions.filter((s) => {
    const ts = s.values?.submitted_at ?? new Date(s.createdAt).getTime();
    return now - ts < 30 * 24 * 60 * 60 * 1000;
  }).length;

  const published = submissions.filter((s) => s.publishStatus === "PUBLISHED").length;

  const stats = [
    { label: "Total Submissions", value: total, icon: Users, note: "All time" },
    { label: "Last 7 Days", value: last7Days, icon: TrendingUp, note: "Past week" },
    { label: "Last 30 Days", value: last30Days, icon: Clock, note: "Past month" },
    { label: "Published", value: published, icon: CheckCircle, note: "Active rows" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="bg-white border border-[#e8e8e6] rounded-xl p-5"
            style={{ boxShadow: "var(--shadow-xs)" }}
          >
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs font-medium text-[#9c9c96] uppercase tracking-wide">{stat.label}</p>
              <Icon className="w-4 h-4 text-[#b8b8b2] shrink-0" />
            </div>
            <p className="text-2xl font-semibold text-[#1a1a18] tabular-nums">{stat.value}</p>
            <p className="text-xs text-[#b8b8b2] mt-1">{stat.note}</p>
          </div>
        );
      })}
    </div>
  );
}
