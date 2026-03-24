import { Separator } from "@/components/ui/separator";
import Image from "next/image";

function Skeleton({ className }) {
  return (
    <div className={`animate-pulse rounded-md bg-gray-100 ${className}`} />
  );
}

function GhostCard({ className = "", children }) {
  return (
    <div
      className={`rounded-xl bg-white p-0 ${className}`}
      style={{ border: "2px solid #f3f4f6" }}
    >
      {children}
    </div>
  );
}

function GhostCardHeader({ children }) {
  return <div className="px-6 py-4">{children}</div>;
}

function GhostCardContent({ className = "", children }) {
  return <div className={`px-6 pb-6 ${className}`}>{children}</div>;
}

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header
        className="bg-background"
        style={{ borderBottom: "2px solid #f3f4f6" }}
      >
        <div className="max-w-screen-xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="https://www.taylor.com/hubfs/_Taylor.com%20-%20All%20file%20connected%20%20to%20main%20site%20and%20blogs/dev/Logo.svg"
              alt="Taylor"
              width={80}
              height={24}
              className="shrink-0"
              unoptimized
            />
            <Separator orientation="vertical" className="h-4" />
            <span className="text-sm font-semibold">
              Print on Demand Catalog
              <span className="text-muted-foreground font-normal mx-1.5">
                |
              </span>
              Cart Submissions
            </span>
          </div>
          <Skeleton className="w-36 h-3" />
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-6 py-8">
        {/* Title */}
        <div className="mb-6">
          <Skeleton className="w-32 h-6 mb-2" />
          <Skeleton className="w-48 h-3" />
        </div>

        <div className="mb-6" style={{ borderTop: "2px solid #f3f4f6" }} />

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[...Array(3)].map((_, i) => (
            <GhostCard key={i}>
              <GhostCardHeader>
                <div className="flex items-center justify-between">
                  <Skeleton className="w-28 h-3" />
                  <Skeleton className="w-4 h-4 rounded" />
                </div>
              </GhostCardHeader>
              <GhostCardContent>
                <Skeleton className="w-16 h-7 mb-2" />
                <Skeleton className="w-20 h-3" />
              </GhostCardContent>
            </GhostCard>
          ))}
        </div>

        {/* Chart */}
        <GhostCard className="mb-6">
          <GhostCardHeader>
            <Skeleton className="w-40 h-4 mb-2" />
            <Skeleton className="w-24 h-3" />
          </GhostCardHeader>
          <GhostCardContent>
            <Skeleton className="w-full h-[200px]" />
          </GhostCardContent>
        </GhostCard>

        {/* Filter bar */}
        <div className="flex gap-2 mb-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="w-24 h-8 rounded-md" />
          ))}
          <div className="h-5 w-px self-center bg-gray-100" />
          <Skeleton className="w-36 h-8 rounded-md" />
          <Skeleton className="w-36 h-8 rounded-md" />
        </div>

        {/* Table */}
        <GhostCard>
          <GhostCardHeader>
            <div className="flex items-center justify-between">
              <Skeleton className="w-24 h-4" />
              <Skeleton className="w-52 h-8 rounded-lg" />
            </div>
          </GhostCardHeader>
          <div>
            <div
              className="px-6 py-3 flex gap-8"
              style={{ borderTop: "2px solid #f3f4f6" }}
            >
              <Skeleton className="w-16 h-3" />
              <Skeleton className="w-16 h-3" />
              <Skeleton className="w-16 h-3" />
            </div>
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="px-6 py-3.5 flex items-center gap-8"
                style={{ borderTop: "2px solid #f3f4f6" }}
              >
                <div className="flex items-center gap-2.5 w-48">
                  <Skeleton className="w-7 h-7 rounded-full shrink-0" />
                  <Skeleton className="w-28 h-3" />
                </div>
                <Skeleton className="w-40 h-3" />
                <Skeleton className="w-32 h-3" />
              </div>
            ))}
          </div>
        </GhostCard>
      </main>
    </div>
  );
}
