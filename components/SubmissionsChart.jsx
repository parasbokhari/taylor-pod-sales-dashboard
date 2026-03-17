"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { getLast30Days } from "@/lib/utils";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-border rounded-lg px-3 py-2 text-sm shadow-md">
        <p className="text-muted-foreground text-xs mb-0.5">{label}</p>
        <p className="font-semibold tabular-nums">
          {payload[0].value}{" "}
          {payload[0].value === 1 ? "submission" : "submissions"}
        </p>
      </div>
    );
  }
  return null;
};

export default function SubmissionsChart({ submissions }) {
  const data = getLast30Days(submissions).map((d) => ({
    ...d,
    label: new Date(d.date + "T00:00:00").toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }));

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-sm font-semibold">
          Submissions over time
        </CardTitle>
        <CardDescription>Last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        {/* [&_svg]:outline-none removes the blue focus outline Recharts puts on the SVG */}
        <div className="[&_svg]:outline-none [&_svg]:focus:outline-none">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart
              data={data}
              margin={{ top: 4, right: 4, left: -24, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                tick={{
                  fontSize: 11,
                  fill: "hsl(var(--muted-foreground))",
                  fontFamily: "Inter",
                }}
                tickLine={false}
                axisLine={false}
                interval={4}
              />
              <YAxis
                tick={{
                  fontSize: 11,
                  fill: "hsl(var(--muted-foreground))",
                  fontFamily: "Inter",
                }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: "hsl(var(--border))", strokeWidth: 1 }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#000000"
                strokeWidth={1.5}
                dot={false}
                activeDot={{ r: 4, fill: "#000000", strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
