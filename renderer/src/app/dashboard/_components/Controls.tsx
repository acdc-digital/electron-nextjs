// HEATMAP CONTROLS 
// /Users/matthewsimon/Documents/Github/electron-nextjs/renderer/src/app/dashboard/_components/Controls.tsx

"use client";

import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  FilterIcon,
  Download,
} from "lucide-react";

// Components
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Store & Types
import { useFeedStore, RightSidebarTab } from "@/store/feedStore";

// Import your new YearSelector
import { YearSelector } from "./YearSelector";

// Define the legend items locally or import from utils
const legendItems = [
  { label: "90-100", color: "bg-indigo-400" },
  { label: "80-89", color: "bg-blue-400" },
  { label: "70-79", color: "bg-sky-400" },
  { label: "60-69", color: "bg-teal-400" },
  { label: "50-59", color: "bg-green-400" },
  { label: "40-49", color: "bg-lime-400" },
  { label: "30-39", color: "bg-yellow-400" },
  { label: "20-29", color: "bg-amber-500" },
  { label: "10-19", color: "bg-orange-500" },
  { label: "0-9", color: "bg-rose-600" },
  { label: "No Log", color: "bg-zinc-800/30 border border-zinc-700/50" },
];

type ControlsProps = {
  selectedYear: string;
  onYearChange: (year: string) => void;
  onLegendFilterChange: (selectedLegend: string | null) => void;
  selectedLegend: string | null;
};

export default function Controls({
  selectedYear,
  onYearChange,
  onLegendFilterChange,
  selectedLegend,
}: ControlsProps) {
  // --- State from Feed Store ---
  const activeTab = useFeedStore((state) => state.activeTab);
  const setActiveTab = useFeedStore((state) => state.setActiveTab);

  // Define your year range however you like
  const minYear = 1970;
  const maxYear = new Date().getFullYear() + 10;

  // Handlers for arrow buttons
  const handlePrevYear = () => {
    const current = parseInt(selectedYear, 10);
    if (current > minYear) {
      onYearChange(String(current - 1));
    }
  };

  const handleNextYear = () => {
    const current = parseInt(selectedYear, 10);
    if (current < maxYear) {
      onYearChange(String(current + 1));
    }
  };

  const handleTabChange = (value: string) => {
    if (value === "log" || value === "feed") {
      setActiveTab(value as RightSidebarTab);
    }
  };

  return (
    <div className="flex items-center gap-3 justify-between flex-wrap sm:flex-nowrap">

      {/* ----- Left Side: Year Navigation ----- */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrevYear}
          disabled={+selectedYear <= minYear}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Use your custom YearSelector component */}
        <YearSelector
          selectedYear={selectedYear}
          onYearChange={onYearChange}
          minYear={minYear}
          maxYear={maxYear}
          className="w-28 h-8 font-medium"
        />

        <Button
          variant="outline"
          size="icon"
          onClick={handleNextYear}
          disabled={+selectedYear >= maxYear}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* ----- Right Side: Filter, Export, and Tabs ----- */}
      <div className="flex items-center gap-2">
        {/* Legend Filter Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 flex items-center gap-1.5">
              <FilterIcon className="h-3.5 w-3.5 text-zinc-500" />
              <span className="hidden sm:inline">
                {selectedLegend ? `Filter: ${selectedLegend}` : "Filter"}
              </span>
              {selectedLegend && (
                <Badge
                  variant="secondary"
                  className="ml-1 h-5 px-1 rounded-sm cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLegendFilterChange(null);
                  }}
                >
                  ✕
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-60 p-2">
            <div className="space-y-1.5 py-1">
              <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2 px-1">
                Filter by score range:
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {legendItems.map((item) => (
                  <div
                    key={item.label}
                    className={`flex items-center gap-1.5 text-xs rounded-sm px-2 py-1.5 cursor-pointer transition-colors ${
                      selectedLegend === item.label
                        ? "bg-zinc-100 dark:bg-zinc-800 font-medium"
                        : "hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50"
                    }`}
                    onClick={() =>
                      onLegendFilterChange(
                        selectedLegend === item.label ? null : item.label
                      )
                    }
                  >
                    <div className={`w-3 h-3 rounded-sm flex-shrink-0 ${item.color}`} />
                    <span className="text-zinc-700 dark:text-zinc-300">{item.label}</span>
                  </div>
                ))}
              </div>
              {selectedLegend && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-2 h-7 text-xs"
                  onClick={() => onLegendFilterChange(null)}
                >
                  Clear Filter
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* Tabs for Right Sidebar View */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-[150px]">
          <TabsList className="grid w-full grid-cols-2 h-8">
            <TabsTrigger value="log" className="text-xs h-7">
              Log
            </TabsTrigger>
            <TabsTrigger value="feed" className="text-xs h-7">
              Feed
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Export Button */}
        <Button variant="outline" size="icon" className="h-8 w-8">
          <Download className="h-4 w-4" />
          <span className="sr-only">Export Data</span>
        </Button>
      </div>
    </div>
  );
}