import AppNav from "@/components/AppNav";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

function Skeleton({ className }) {
  return (
    <div className={`animate-pulse rounded-md bg-gray-100 ${className}`} />
  );
}

function GhostCard({ children }) {
  return (
    <div
      className="rounded-xl bg-white"
      style={{ border: "2px solid #f3f4f6" }}
    >
      {children}
    </div>
  );
}

export default function BestSellersLoading() {
  return (
    <div className="min-h-screen bg-background">
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
        </div>
      </header>

      <AppNav />

      <main className="max-w-screen-xl mx-auto px-6 py-8">
        <div className="mb-6">
          <Skeleton className="w-32 h-6 mb-2" />
          <Skeleton className="w-52 h-3" />
        </div>

        <div className="mb-6" style={{ borderTop: "2px solid #f3f4f6" }} />

        <GhostCard>
          <div
            className="px-6 py-4 flex items-center justify-between"
            style={{ borderBottom: "2px solid #f3f4f6" }}
          >
            <Skeleton className="w-24 h-4" />
            <div className="flex gap-1.5">
              <Skeleton className="w-16 h-7 rounded-md" />
              <Skeleton className="w-16 h-7 rounded-md" />
              <Skeleton className="w-16 h-7 rounded-md" />
            </div>
          </div>
          <div>
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="px-6 py-3.5 flex items-center gap-4"
                style={{ borderBottom: "2px solid #f3f4f6" }}
              >
                <Skeleton className="w-6 h-3 shrink-0" />
                <div className="flex items-center gap-3 flex-1">
                  <Skeleton className="w-8 h-8 rounded-md shrink-0" />
                  <Skeleton className="h-3 w-56" />
                </div>
                <Skeleton className="w-10 h-3" />
                <Skeleton className="w-10 h-3" />
                <Skeleton className="w-4 h-4" />
              </div>
            ))}
          </div>
        </GhostCard>
      </main>
    </div>
  );
}
