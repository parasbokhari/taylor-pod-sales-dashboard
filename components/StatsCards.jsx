"use client";

import { Users, TrendingUp, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StatsCards({ submissions }) {
  const total = submissions.length;
  const now = Date.now();

  const last7Days = submissions.filter((s) => {
    const ts = new Date(s.submitted_at).getTime();
    return now - ts < 7 * 24 * 60 * 60 * 1000;
  }).length;

  const last30Days = submissions.filter((s) => {
    const ts = new Date(s.submitted_at).getTime();
    return now - ts < 30 * 24 * 60 * 60 * 1000;
  }).length;

  const stats = [
    { label: "Total Submissions", value: total, icon: Users, note: "All time" },
    {
      label: "Last 7 Days",
      value: last7Days,
      icon: TrendingUp,
      note: "Past week",
    },
    {
      label: "Last 30 Days",
      value: last30Days,
      icon: Clock,
      note: "Past month",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <Icon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold tabular-nums">
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{stat.note}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
