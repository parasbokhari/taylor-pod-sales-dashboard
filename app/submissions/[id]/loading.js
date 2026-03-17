function Skeleton({ className }) {
  return (
    <div className={`animate-pulse rounded-md bg-gray-100 ${className}`} />
  );
}

function GhostCard({ className = "", children }) {
  return (
    <div
      className={`rounded-xl bg-white ${className}`}
      style={{ border: "2px solid #f3f4f6" }}
    >
      {children}
    </div>
  );
}

export default function SubmissionDetailLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header
        className="bg-background"
        style={{ borderBottom: "2px solid #f3f4f6" }}
      >
        <div className="max-w-screen-xl mx-auto px-6 h-14 flex items-center gap-3">
          <Skeleton className="w-24 h-8 rounded-lg" />
          <div className="h-4 w-px bg-gray-100" />
          <Skeleton className="w-32 h-4" />
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left column */}
          <div className="space-y-4">
            {/* Contact card */}
            <GhostCard>
              <div className="pt-6 px-6 pb-6 flex flex-col items-center">
                <Skeleton className="w-16 h-16 rounded-full mb-4" />
                <Skeleton className="w-36 h-5 mb-2" />
                <Skeleton className="w-44 h-3 mb-4" />
                <div
                  className="w-full pt-4 flex justify-center"
                  style={{ borderTop: "2px solid #f3f4f6" }}
                >
                  <Skeleton className="w-32 h-3" />
                </div>
                <Skeleton className="w-24 h-5 rounded-full mt-3" />
              </div>
            </GhostCard>

            {/* Metadata */}
            <GhostCard>
              <div className="px-6 pt-4 pb-2">
                <Skeleton className="w-20 h-4" />
              </div>
              <div className="px-6 pb-6 space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i}>
                    <Skeleton className="w-24 h-2.5 mb-1.5" />
                    <Skeleton className="w-40 h-3.5" />
                  </div>
                ))}
              </div>
            </GhostCard>

            {/* All field values */}
            <GhostCard>
              <div className="px-6 pt-4 pb-2">
                <Skeleton className="w-28 h-4" />
              </div>
              <div>
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="px-6 py-2.5 flex gap-6"
                    style={{ borderTop: "2px solid #f3f4f6" }}
                  >
                    <Skeleton className="w-24 h-3" />
                    <Skeleton className="w-32 h-3" />
                  </div>
                ))}
              </div>
            </GhostCard>

            {/* Raw JSON */}
            <GhostCard>
              <div className="px-6 py-4 flex items-center justify-between">
                <Skeleton className="w-20 h-4" />
                <Skeleton className="w-8 h-3" />
              </div>
            </GhostCard>
          </div>

          {/* Right column — cart data */}
          <div className="lg:col-span-2 space-y-4">
            <GhostCard>
              <div className="px-6 pt-4 pb-2 flex items-center justify-between">
                <Skeleton className="w-24 h-4" />
                <Skeleton className="w-36 h-3" />
              </div>
              <div className="px-6 pb-6 space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="rounded-lg px-4 py-3 flex items-center justify-between"
                    style={{ border: "2px solid #f3f4f6" }}
                  >
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-7 h-7 rounded-md shrink-0" />
                      <div>
                        <Skeleton className="w-48 h-3.5 mb-1.5" />
                        <Skeleton className="w-32 h-2.5" />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-16 h-5 rounded-full" />
                      <Skeleton className="w-4 h-4 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </GhostCard>
          </div>
        </div>
      </main>
    </div>
  );
}
