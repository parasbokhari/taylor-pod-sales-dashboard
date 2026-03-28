import { fetchBestsellers } from "@/lib/api";
import BestSellersTable from "@/components/BestSellersTable";
import AppNav from "@/components/AppNav";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export const revalidate = 60;

export const metadata = {
  title: "Best Sellers | Print on Demand Catalog | Taylor",
};

export default async function BestSellersPage() {
  let initialData = null;
  let error = null;

  try {
    initialData = await fetchBestsellers("30d", 40);
  } catch (e) {
    error = e.message;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b">
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

      {/* Tab nav */}
      <AppNav />

      <main className="max-w-screen-xl mx-auto px-6 py-8">
        {error && (
          <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-lg p-4 mb-6 text-sm">
            Failed to load bestsellers: {error}
          </div>
        )}

        <div className="mb-6">
          <h1 className="text-xl font-semibold">Best Sellers</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Top 40 products by cart submissions
          </p>
        </div>

        <Separator className="mb-6" />

        <BestSellersTable initialData={initialData} initialRange="30d" />
      </main>
    </div>
  );
}
