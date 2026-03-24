"use client";

import { useState, useMemo, useEffect, useRef, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  X,
} from "lucide-react";
import DateFilter from "@/components/DateFilter";

function TableSkeleton() {
  return (
    <>
      {[...Array(4)].map((_, i) => (
        <TableRow key={i}>
          <TableCell>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-gray-100 animate-pulse shrink-0" />
              <div className="h-3 bg-gray-100 animate-pulse rounded w-32" />
            </div>
          </TableCell>
          <TableCell>
            <div className="h-3 bg-gray-100 animate-pulse rounded w-40" />
          </TableCell>
          <TableCell>
            <div className="h-3 bg-gray-100 animate-pulse rounded w-28" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

export default function SubmissionsTable({
  submissions,
  total,
  totalPages,
  currentPage,
  limit,
  initialSearch = "",
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(initialSearch);
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [sortKey, setSortKey] = useState("submitted_at");
  const [sortDir, setSortDir] = useState("desc");
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const debounceRef = useRef(null);

  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      setSearch(initialSearch);
    }
  }, []);

  function handleSearchChange(value) {
    setSearch(value);
    setIsDebouncing(true);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setIsDebouncing(false);
      const params = new URLSearchParams();
      if (value) params.set("search", value);
      params.set("page", "1");
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      });
    }, 400);
  }

  function clearSearch() {
    setSearch("");
    setIsDebouncing(false);
    clearTimeout(debounceRef.current);
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  }

  function goToPage(page) {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    params.set("page", page);
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }

  const isLoading = isDebouncing || isPending;

  const filtered = useMemo(() => {
    const { from, to } = dateRange;
    if (!from && !to) return submissions;
    return submissions.filter((s) => {
      const ts = new Date(s.submitted_at).getTime();
      if (from && ts < from.getTime()) return false;
      if (to && ts > to.getTime()) return false;
      return true;
    });
  }, [submissions, dateRange]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let aVal, bVal;
      if (sortKey === "submitted_at") {
        aVal = new Date(a.submitted_at).getTime();
        bVal = new Date(b.submitted_at).getTime();
      } else if (sortKey === "name") {
        aVal = `${a.first_name ?? ""} ${a.last_name ?? ""}`.toLowerCase();
        bVal = `${b.first_name ?? ""} ${b.last_name ?? ""}`.toLowerCase();
      } else if (sortKey === "email") {
        aVal = (a.email ?? "").toLowerCase();
        bVal = (b.email ?? "").toLowerCase();
      }
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [filtered, sortKey, sortDir]);

  function toggleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function SortIcon({ colKey }) {
    if (sortKey !== colKey)
      return <ChevronsUpDown className="w-3 h-3 text-muted-foreground" />;
    return sortDir === "asc" ? (
      <ChevronUp className="w-3 h-3" />
    ) : (
      <ChevronDown className="w-3 h-3" />
    );
  }

  return (
    <div>
      <DateFilter onChange={(range) => setDateRange(range)} />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <CardTitle className="text-sm font-semibold">
                Submissions
              </CardTitle>
              <span className="text-xs text-muted-foreground">
                {isLoading ? (
                  <span className="inline-block w-24 h-2.5 bg-gray-100 animate-pulse rounded" />
                ) : (
                  <>
                    {total} result{total !== 1 ? "s" : ""}
                    {search ? ` for "${search}"` : ""}
                    {totalPages > 1
                      ? ` · page ${currentPage} of ${totalPages}`
                      : ""}
                  </>
                )}
              </span>
            </div>
            <div className="relative w-56">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                placeholder="Search all submissions…"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-8 pr-8 h-8 text-sm"
              />
              {search && (
                <button
                  onClick={clearSearch}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                {[
                  { key: "name", label: "Name" },
                  { key: "email", label: "Email" },
                  { key: "submitted_at", label: "Submitted" },
                ].map((col) => (
                  <TableHead
                    key={col.key}
                    className="cursor-pointer select-none hover:text-foreground transition-colors"
                    onClick={() => toggleSort(col.key)}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      <SortIcon colKey={col.key} />
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableSkeleton />
              ) : sorted.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center pt-8 pb-4 text-muted-foreground"
                  >
                    {search
                      ? `No submissions found for "${search}"`
                      : "No submissions found"}
                  </TableCell>
                </TableRow>
              ) : (
                sorted.map((s) => {
                  const fullName =
                    [s.first_name, s.last_name].filter(Boolean).join(" ") ||
                    "—";
                  const initial = (
                    s.first_name?.[0] ??
                    s.last_name?.[0] ??
                    "?"
                  ).toUpperCase();
                  return (
                    <TableRow
                      key={s.submission_id}
                      className="cursor-pointer transition-colors"
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#f4f4f5")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "")
                      }
                      onClick={() =>
                        router.push(`/submissions/${s.submission_id}`)
                      }
                    >
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-black/10 flex items-center justify-center text-[10px] font-semibold text-black shrink-0">
                            {initial}
                          </div>
                          <span className="font-medium">{fullName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {s.email ?? "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground tabular-nums text-xs">
                        {formatDate(s.submitted_at)}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          {!isLoading && totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t">
              <p className="text-xs text-muted-foreground">
                Page {currentPage} of {totalPages} · {total} total
              </p>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(1)}
                  disabled={currentPage === 1}
                >
                  First
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  Last
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
