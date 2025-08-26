"use client";

import React from "react";
import { Eye, Type } from "lucide-react";
import Image from "next/image";
import hf_logo from "@/assets/hf-logo.png";

interface FilterState {
  search: string;
  showVisionModels: boolean;
  showTextModels: boolean;
  showOpenWeight: boolean;
}

interface FilterBarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export const FilterBar = ({ filters, onFiltersChange }: FilterBarProps) => {
  return (
    <div className="flex flex-wrap items-center gap-6 mb-4">
      {/* Search Bar - Made shorter */}
      <div className="w-64">
        <input
          type="text"
          placeholder="Search models..."
          value={filters.search}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      {/* Filter Checkboxes */}
      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-1 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.showVisionModels}
            onChange={(e) => onFiltersChange({ ...filters, showVisionModels: e.target.checked })}
            className="rounded"
          />
          <Eye className="w-4 h-4 text-blue-600" />
          <span className="text-sm">Vision Models</span>
        </label>
        
        <label className="flex items-center gap-1 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.showTextModels}
            onChange={(e) => onFiltersChange({ ...filters, showTextModels: e.target.checked })}
            className="rounded"
          />
          <Type className="w-4 h-4 text-gray-600" />
          <span className="text-sm">Text-Only Models</span>
        </label>
        
        <label className="flex items-center gap-1 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.showOpenWeight}
            onChange={(e) => onFiltersChange({ ...filters, showOpenWeight: e.target.checked })}
            className="rounded"
          />
          <Image
            src={hf_logo}
            alt="Hugging Face"
            width={16}
            height={16}
            className="flex-shrink-0"
          />
          <span className="text-sm">Open-Weight Models</span>
        </label>
      </div>
    </div>
  );
};

export type { FilterState };