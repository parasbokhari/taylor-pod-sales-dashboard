"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Search, ChevronUp, ChevronDown, ChevronsUpDown, ArrowUpRight } from "lucide-react";

const PAGE_SIZE = 20;

export default function SubmissionsTable({ submissions }) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("submitted_at");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return submissions.filter((s) => {
      const { first_name = "", last_name = "", email = "" } = s.values ?? {};
      return (
        first_name.toLowerCase().includes(q) ||
        last_name.toLowerCase().includes(q) ||
        email.toLowerCase().includes(q)
      );
    });
  }, [submissions, search]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let aVal, bVal;
      if (sortKey === "submitted_at") {
        aVal = a.values?.submitted_at ?? 0;
        bVal = b.values?.submitted_at ?? 0;
      } else if (sortKey === "name") {
        aVal = `${a.values?.first_name ?? ""} ${a.values?.last_name ?? ""}`.toLowerCase();
        bVal = `${b.values?.first_name ?? ""} ${b.values?.last_name ?? ""}`.toLowerCase();
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

  function SortIcon({ colKey }) {
    if (sortKey !== colKey) return <ChevronsUpDown className="w-3 h-3 text-[#b8b8b2]" />;
    return sortDir === "asc"
      ? <ChevronUp className="w-3 h-3 text-[#2458f1]" />
      : <ChevronDown className="w-3 h-3 text-[#2458f1]" />;
  }

  return (
    <div className="bg-white border border-[#e8e8e6] rounded-xl" style={{ boxShadow: "var(--shadow-xs)" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#e8e8e6]">
        <div className="flex items-baseline gap-2">
          <h2 className="text-sm font-semibold text-[#1a1a18]">Submissions</h2>
          <span className="text-xs text-[#9c9c96]">{filtered.length} records</span>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#b8b8b2]" />
          <input
            type="text"
            placeholder="Search…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-8 pr-3 py-1.5 text-sm border border-[#e8e8e6] rounded-lg outline-none focus:border-[#2458f1] focus:ring-2 focus:ring-[#f0f4ff] transition text-[#1a1a18] placeholder-[#b8b8b2] w-52 bg-[#f8f8f7]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#e8e8e6]">
              {[
                { key: "name", label: "Name" },
                { key: "email", label: "Email" },
                { key: "submitted_at", label: "Submitted" },
              ].map((col) => (
                <th
                  key={col.key}
                  className="text-left px-5 py-3 text-xs font-medium text-[#9c9c96] cursor-pointer select-none hover:text-[#5c5c58] transition-colors"
                  onClick={() => toggleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    <SortIcon colKey={col.key} />
                  </div>
                </th>
              ))}
              <th className="px-5 py-3 text-xs font-medium text-[#9c9c96] text-right">Status</th>
              <th className="px-4 py-3 w-10" />
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-16 text-[#b8b8b2] text-sm">
                  No submissions found
                </td>
              </tr>
            ) : (
              paginated.map((s) => {
                const { first_name, last_name, email, submitted_at } = s.values ?? {};
                const fullName = [first_name, last_name].filter(Boolean).join(" ") || "—";
                const initial = (first_name?.[0] ?? last_name?.[0] ?? "?").toUpperCase();
                return (
                  <tr
                    key={s.id}
                    className="border-b border-[#e8e8e6] last:border-0 hover:bg-[#f8f8f7] transition-colors group"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#f0f4ff] flex items-center justify-center text-[10px] font-semibold text-[#2458f1] shrink-0">
                          {initial}
                        </div>
                        <span className="font-medium text-[#1a1a18]">{fullName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[#5c5c58]">{email ?? "—"}</td>
                    <td className="px-5 py-3.5 text-[#9c9c96] tabular-nums text-xs">{formatDate(submitted_at)}</td>
                    <td className="px-5 py-3.5 text-right">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
                          s.publishStatus === "PUBLISHED"
                            ? "bg-[#f0fdf4] text-[#16a34a]"
                            : "bg-[#f8f8f7] text-[#9c9c96]"
                        }`}
                      >
                        {s.publishStatus ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <Link
                        href={`/submissions/${s.id}`}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-[#f0f4ff] inline-flex items-center justify-center"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5 text-[#2458f1]" />
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#e8e8e6]">
          <p className="text-xs text-[#9c9c96]">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 text-xs border border-[#e8e8e6] rounded-lg text-[#5c5c58] hover:bg-[#f8f8f7] disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 text-xs border border-[#e8e8e6] rounded-lg text-[#5c5c58] hover:bg-[#f8f8f7] disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
