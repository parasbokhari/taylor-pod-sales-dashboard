"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
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
import { Search, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import DateFilter from "@/components/DateFilter";

const PAGE_SIZE = 20;

export default function SubmissionsTable({ submissions }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("submitted_at");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);
  const [dateRange, setDateRange] = useState({ from: null, to: null });

  const dateFiltered = useMemo(() => {
    const { from, to } = dateRange;
    if (!from && !to) return submissions;
    return submissions.filter((s) => {
      const ts = s.values?.submitted_at ?? new Date(s.createdAt).getTime();
      if (from && ts < from.getTime()) return false;
      if (to && ts > to.getTime()) return false;
      return true;
    });
  }, [submissions, dateRange]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return dateFiltered.filter((s) => {
      const { first_name = "", last_name = "", email = "" } = s.values ?? {};
      return (
        first_name.toLowerCase().includes(q) ||
        last_name.toLowerCase().includes(q) ||
        email.toLowerCase().includes(q)
      );
    });
  }, [dateFiltered, search]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let aVal, bVal;
      if (sortKey === "submitted_at") {
        aVal = a.values?.submitted_at ?? 0;
        bVal = b.values?.submitted_at ?? 0;
      } else if (sortKey === "name") {
        aVal =
          `${a.values?.first_name ?? ""} ${a.values?.last_name ?? ""}`.toLowerCase();
        bVal =
          `${b.values?.first_name ?? ""} ${b.values?.last_name ?? ""}`.toLowerCase();
      } else if (sortKey === "email") {
        aVal = (a.values?.email ?? "").toLowerCase();
        bVal = (b.values?.email ?? "").toLowerCase();
      }
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function toggleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  }

  function handleDateChange(range) {
    setDateRange(range);
    setPage(1);
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
      <DateFilter onChange={handleDateChange} />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <CardTitle className="text-sm font-semibold">
                Submissions
              </CardTitle>
              <span className="text-xs text-muted-foreground">
                {filtered.length} records
              </span>
            </div>
            <div className="relative w-52">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                placeholder="Search…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-8 h-8 text-sm"
              />
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
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center pt-8 pb-4 text-muted-foreground"
                  >
                    No submissions found
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((s) => {
                  const {
                    first_name,
                    last_name,
                    email,
                    submitted_at,
                    submission_id,
                  } = s.values ?? {};
                  const fullName =
                    [first_name, last_name].filter(Boolean).join(" ") || "—";
                  const initial = (
                    first_name?.[0] ??
                    last_name?.[0] ??
                    "?"
                  ).toUpperCase();
                  const slug = submission_id ?? s.id;
                  return (
                    <TableRow
                      key={s.id}
                      className="cursor-pointer transition-colors"
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#f4f4f5")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "")
                      }
                      onClick={() => router.push(`/submissions/${slug}`)}
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
                        {email ?? "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground tabular-nums text-xs">
                        {formatDate(submitted_at)}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t">
              <p className="text-xs text-muted-foreground">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
