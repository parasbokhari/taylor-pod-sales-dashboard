"use client";

import { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Package, ExternalLink, CalendarIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";

const API_BASE =
  "https://parasbokhari1--ce4a306c26fe11f1a7f242dde27851f2.web.val.run";
const PRODUCT_BASE_URL = "https://taylor.com/product-guide/";

const PRESETS = [
  { label: "7 days", value: "7d" },
  { label: "30 days", value: "30d" },
  { label: "90 days", value: "90d" },
  { label: "365 days", value: "365d" },
];

function SkeletonRow() {
  return (
    <TableRow>
      <TableCell className="pl-5">
        <div className="h-3 w-6 bg-gray-100 animate-pulse rounded" />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-gray-100 animate-pulse shrink-0" />
          <div className="h-3 bg-gray-100 animate-pulse rounded w-48" />
        </div>
      </TableCell>
      <TableCell>
        <div className="h-3 bg-gray-100 animate-pulse rounded w-12" />
      </TableCell>
      <TableCell>
        <div className="h-3 bg-gray-100 animate-pulse rounded w-12" />
      </TableCell>
      <TableCell>
        <div className="h-3 bg-gray-100 animate-pulse rounded w-8" />
      </TableCell>
    </TableRow>
  );
}

export default function BestSellersTable({
  initialData,
  initialRange = "30d",
}) {
  const [activePreset, setActivePreset] = useState(initialRange);
  const [customRange, setCustomRange] = useState({
    from: undefined,
    to: undefined,
  });
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  const hasCustomRange = customRange.from || customRange.to;

  async function fetchData(params) {
    setLoading(true);
    try {
      const url = new URL(API_BASE);
      url.searchParams.set("mode", "bestsellers");
      url.searchParams.set("top", "40");
      Object.entries(params).forEach(
        ([k, v]) => v && url.searchParams.set(k, v),
      );
      const res = await fetch(url.toString());
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error("Failed to fetch bestsellers:", e);
    } finally {
      setLoading(false);
    }
  }

  function handlePreset(value) {
    setActivePreset(value);
    setCustomRange({ from: undefined, to: undefined });
    fetchData({ range: value });
  }

  function handleFromSelect(date) {
    const from = date ? new Date(date.setHours(0, 0, 0, 0)) : undefined;
    const newRange = { ...customRange, from };
    setCustomRange(newRange);
    setActivePreset(null);
    setFromOpen(false);
    if (newRange.to) {
      fetchData({
        from: format(newRange.from, "yyyy-MM-dd"),
        to: format(newRange.to, "yyyy-MM-dd"),
      });
    }
  }

  function handleToSelect(date) {
    const to = date ? new Date(date.setHours(23, 59, 59, 999)) : undefined;
    const newRange = { ...customRange, to };
    setCustomRange(newRange);
    setActivePreset(null);
    setToOpen(false);
    if (newRange.from) {
      fetchData({
        from: format(newRange.from, "yyyy-MM-dd"),
        to: format(newRange.to, "yyyy-MM-dd"),
      });
    }
  }

  function clearCustomRange() {
    setCustomRange({ from: undefined, to: undefined });
    setActivePreset("30d");
    fetchData({ range: "30d" });
  }

  const products = data?.products ?? [];

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="text-sm font-semibold">Best Sellers</CardTitle>

          <div className="flex flex-wrap items-center gap-2">
            {/* Preset pills */}
            <div className="flex items-center gap-1.5">
              {PRESETS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => handlePreset(p.value)}
                  className={`px-3 py-1.5 text-xs rounded-lg border transition-colors cursor-pointer ${
                    activePreset === p.value
                      ? "bg-gray-100 text-foreground border-gray-300 font-medium"
                      : "bg-white text-muted-foreground border-border hover:border-gray-300 hover:text-foreground"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="h-5 w-px bg-border" />

            {/* Custom From picker */}
            <Popover open={fromOpen} onOpenChange={setFromOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-8 text-xs gap-1.5 w-32 justify-start font-normal",
                    customRange.from
                      ? "border-foreground text-foreground font-medium"
                      : "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="w-3 h-3 shrink-0" />
                  {customRange.from
                    ? format(customRange.from, "MMM d, yyyy")
                    : "From"}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 z-50 bg-white shadow-md border border-border"
                align="start"
                sideOffset={4}
              >
                <Calendar
                  mode="single"
                  selected={customRange.from}
                  onSelect={handleFromSelect}
                  disabled={(date) =>
                    date > new Date() ||
                    (customRange.to ? date > customRange.to : false)
                  }
                  captionLayout="dropdown"
                  fromYear={2020}
                  toYear={new Date().getFullYear()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            {/* Custom To picker */}
            <Popover open={toOpen} onOpenChange={setToOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-8 text-xs gap-1.5 w-32 justify-start font-normal",
                    customRange.to
                      ? "border-foreground text-foreground font-medium"
                      : "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="w-3 h-3 shrink-0" />
                  {customRange.to
                    ? format(customRange.to, "MMM d, yyyy")
                    : "To"}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 z-50 bg-white shadow-md border border-border"
                align="start"
                sideOffset={4}
              >
                <Calendar
                  mode="single"
                  selected={customRange.to}
                  onSelect={handleToSelect}
                  disabled={(date) =>
                    date > new Date() ||
                    (customRange.from ? date < customRange.from : false)
                  }
                  captionLayout="dropdown"
                  fromYear={2020}
                  toYear={new Date().getFullYear()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            {/* Clear custom range */}
            {hasCustomRange && (
              <div className="flex items-center gap-1.5 bg-black text-white text-xs font-medium px-3 py-1.5 rounded-full">
                <span>
                  {customRange.from ? format(customRange.from, "MMM d") : "…"}
                  {" → "}
                  {customRange.to ? format(customRange.to, "MMM d") : "…"}
                </span>
                <button
                  onClick={clearCustomRange}
                  className="hover:opacity-70 transition-opacity ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 pl-5">#</TableHead>
              <TableHead>Product</TableHead>
              <TableHead className="text-right">Submissions</TableHead>
              <TableHead className="text-right">SKUs</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [...Array(10)].map((_, i) => <SkeletonRow key={i} />)
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center pt-8 pb-4 text-muted-foreground"
                >
                  No bestseller data available
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow
                  key={product.slug}
                  className="transition-colors"
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f4f4f5")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "")
                  }
                >
                  <TableCell className="pl-5">
                    <span
                      className={`text-sm font-semibold tabular-nums ${
                        product.rank <= 3
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {product.rank}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                        {product.image_url ? (
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            width={32}
                            height={32}
                            className="object-cover w-full h-full"
                            unoptimized
                          />
                        ) : (
                          <Package className="w-3.5 h-3.5 text-gray-400" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {product.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-sm text-muted-foreground">
                    {product.submission_count}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-sm text-muted-foreground">
                    {product.sku_count}
                  </TableCell>
                  <TableCell>
                    <a
                      href={`${PRODUCT_BASE_URL}${product.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
