import { fetchSubmissions } from "@/lib/api";
import StatsCards from "@/components/StatsCards";
import SubmissionsChart from "@/components/SubmissionsChart";
import SubmissionsTable from "@/components/SubmissionsTable";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart } from "lucide-react";
import AutoRefresh from "@/components/AutoRefresh";

export const revalidate = 10;

export default async function DashboardPage() {
  let submissions = [];
  let error = null;

  try {
    submissions = await fetchSubmissions();
  } catch (e) {
    error = e.message;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header — not sticky */}
      <header className="bg-background border-b">
        <div className="max-w-screen-xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <ShoppingCart className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold">Cart Submissions</span>
          </div>
          <span className="text-xs text-muted-foreground">
            Auto-refreshes every 30s
          </span>
        </div>
      </header>
      <AutoRefresh intervalMs={30000} />

      <main className="max-w-screen-xl mx-auto px-6 py-8">
        {error && (
          <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-lg p-4 mb-6 text-sm">
            Failed to load submissions: {error}
          </div>
        )}

        <div className="mb-6">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            HubDB table · {submissions.length} total records
          </p>
        </div>

        <Separator className="mb-6" />

        <StatsCards submissions={submissions} />
        <SubmissionsChart submissions={submissions} />
        <SubmissionsTable submissions={submissions} />
      </main>
    </div>
  );
}
