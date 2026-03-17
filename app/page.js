import { fetchSubmissions } from "@/lib/api";
import StatsCards from "@/components/StatsCards";
import SubmissionsChart from "@/components/SubmissionsChart";
import SubmissionsTable from "@/components/SubmissionsTable";

export const revalidate = 60;

export default async function DashboardPage() {
  let submissions = [];
  let error = null;

  try {
    submissions = await fetchSubmissions();
  } catch (e) {
    error = e.message;
  }

  return (
    <div className="min-h-screen bg-[#f8f8f7]">
      {/* Header */}
      <header className="bg-white border-b border-[#e8e8e6] sticky top-0 z-10">
        <div className="max-w-[1280px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-md bg-[#2458f1] flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1h2l1.5 6h5l1-4H3.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="5.5" cy="10.5" r="0.75" fill="white"/>
                <circle cx="9" cy="10.5" r="0.75" fill="white"/>
              </svg>
            </div>
            <span className="text-sm font-semibold text-[#1a1a18]">Cart Submissions</span>
          </div>
          <span className="text-xs text-[#b8b8b2]">Auto-refreshes every 60s</span>
        </div>
      </header>

      <main className="max-w-[1280px] mx-auto px-6 py-8">
        {error && (
          <div className="bg-[#fef2f2] border border-[#fecaca] text-[#dc2626] rounded-xl p-4 mb-6 text-sm">
            Failed to load submissions: {error}
          </div>
        )}

        <div className="mb-6">
          <h1 className="text-xl font-semibold text-[#1a1a18]">Dashboard</h1>
          <p className="text-sm text-[#9c9c96] mt-0.5">HubDB table · {submissions.length} total records</p>
        </div>

        <StatsCards submissions={submissions} />
        <SubmissionsChart submissions={submissions} />
        <SubmissionsTable submissions={submissions} />
      </main>
    </div>
  );
}
