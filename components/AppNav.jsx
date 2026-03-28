"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/" },
  { label: "Best Sellers", href: "/best-sellers" },
];

export default function AppNav() {
  const pathname = usePathname();

  return (
    <div className="border-b bg-background">
      <div className="max-w-screen-xl mx-auto px-6">
        <nav className="flex items-center gap-6">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "py-3 text-sm transition-colors",
                  isActive
                    ? "text-foreground font-bold"
                    : "text-muted-foreground hover:text-foreground font-normal",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
