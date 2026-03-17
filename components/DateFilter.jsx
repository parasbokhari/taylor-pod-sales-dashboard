"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const PRESETS = [
  { label: "Today", days: 0 },
  { label: "Last 7 days", days: 7 },
  { label: "Last 30 days", days: 30 },
  { label: "Last 90 days", days: 90 },
];

export default function DateFilter({ onChange }) {
  const [activePreset, setActivePreset] = useState(null);
  const [range, setRange] = useState({ from: undefined, to: undefined });
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);

  const hasFilter = activePreset !== null || range.from || range.to;

  function applyPreset(days) {
    const to = new Date();
    const from = new Date();
    if (days === 0) {
      // Today: midnight to end of day
      from.setHours(0, 0, 0, 0);
    } else {
      from.setDate(to.getDate() - days);
      from.setHours(0, 0, 0, 0);
    }
    to.setHours(23, 59, 59, 999);
    setActivePreset(days);
    setRange({ from, to });
    onChange({ from, to });
  }

  function handleFromSelect(date) {
    const from = date ? new Date(date.setHours(0, 0, 0, 0)) : undefined;
    const newRange = { ...range, from };
    setRange(newRange);
    setActivePreset(null);
    setFromOpen(false);
    if (newRange.to) onChange(newRange);
  }

  function handleToSelect(date) {
    const to = date ? new Date(date.setHours(23, 59, 59, 999)) : undefined;
    const newRange = { ...range, to };
    setRange(newRange);
    setActivePreset(null);
    setToOpen(false);
    if (newRange.from) onChange(newRange);
  }

  function clearFilter() {
    setActivePreset(null);
    setRange({ from: undefined, to: undefined });
    onChange({ from: null, to: null });
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      {/* Preset buttons */}
      {PRESETS.map((p) => (
        <Button
          key={p.days}
          variant={activePreset === p.days ? "default" : "outline"}
          size="sm"
          onClick={() => applyPreset(p.days)}
          className={activePreset === p.days ? "shadow-sm" : ""}
        >
          {p.label}
        </Button>
      ))}

      <div className="h-5 w-px bg-border" />

      {/* From date picker */}
      <Popover open={fromOpen} onOpenChange={setFromOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "w-36 justify-start text-left font-normal gap-2",
              range.from
                ? "border-foreground text-foreground font-medium"
                : "text-muted-foreground",
            )}
          >
            <CalendarIcon className="w-3.5 h-3.5 shrink-0" />
            {range.from ? format(range.from, "MMM d, yyyy") : "From"}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 z-50 bg-white shadow-md border border-border"
          align="start"
          sideOffset={4}
        >
          <Calendar
            mode="single"
            selected={range.from}
            onSelect={handleFromSelect}
            disabled={(date) => (range.to ? date > range.to : false)}
            captionLayout="dropdown"
            fromYear={2020}
            toYear={new Date().getFullYear()}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {/* To date picker */}
      <Popover open={toOpen} onOpenChange={setToOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "w-36 justify-start text-left font-normal gap-2",
              range.to
                ? "border-foreground text-foreground font-medium"
                : "text-muted-foreground",
            )}
          >
            <CalendarIcon className="w-3.5 h-3.5 shrink-0" />
            {range.to ? format(range.to, "MMM d, yyyy") : "To"}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 z-50 bg-white shadow-md border border-border"
          align="start"
          sideOffset={4}
        >
          <Calendar
            mode="single"
            selected={range.to}
            onSelect={handleToSelect}
            disabled={(date) => (range.from ? date < range.from : false)}
            captionLayout="dropdown"
            fromYear={2020}
            toYear={new Date().getFullYear()}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {/* Active filter pill */}
      {hasFilter && (
        <div className="flex items-center gap-1.5 bg-black text-white text-xs font-medium px-3 py-1.5 rounded-full">
          <span>
            {activePreset
              ? PRESETS.find((p) => p.days === activePreset)?.label
              : `${range.from ? format(range.from, "MMM d") : "…"} → ${range.to ? format(range.to, "MMM d") : "…"}`}
          </span>
          <button
            onClick={clearFilter}
            className="hover:opacity-70 transition-opacity ml-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}
