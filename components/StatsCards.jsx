import { Users, TrendingUp, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchStats } from "@/lib/api";

// Server component — fetches stats directly
export default async function StatsCards({ totalSubmissions }) {
  let stats7d = null;
  let stats30d = null;

  try {
    [stats7d, stats30d] = await Promise.all([
      fetchStats("7d"),
      fetchStats("30d"),
    ]);
  } catch (e) {
    console.error("Failed to fetch stats:", e.message);
  }

  const cards = [
    {
      label: "Total Submissions",
      icon: Users,
      primary: totalSubmissions,
      primaryNote: "All time",
      extras: null,
    },
    {
      label: "Last 7 Days",
      icon: TrendingUp,
      primary: stats7d?.submissions ?? "—",
      primaryNote: "submissions",
      extras: stats7d
        ? [
            { label: "Products", value: stats7d.total_products },
            { label: "SKUs", value: stats7d.total_skus },
          ]
        : null,
    },
    {
      label: "Last 30 Days",
      icon: Clock,
      primary: stats30d?.submissions ?? "—",
      primaryNote: "submissions",
      extras: stats30d
        ? [
            { label: "Products", value: stats30d.total_products },
            { label: "SKUs", value: stats30d.total_skus },
          ]
        : null,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.label}
              </CardTitle>
              <Icon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold tabular-nums">
                {card.primary}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {card.primaryNote}
              </p>

              {card.extras && (
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border">
                  {card.extras.map((e) => (
                    <div key={e.label}>
                      <p className="text-sm font-semibold tabular-nums">
                        {e.value}
                      </p>
                      <p className="text-xs text-muted-foreground">{e.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
