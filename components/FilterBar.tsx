"use client";

import React from "react";
// TODO: Uncomment for later release - Type filter imports
// import { Type, Square } from "lucide-react";
// import hf_logo from "@/assets/hf-logo.png";
// import Image from "next/image";

interface FilterState {
  search: string;
  showTextModels: boolean;
  showOpenWeight: boolean;
  showFlagship: boolean;
  selectedProviders: string[];
  modelSizes: {
    standard: boolean;
    mini: boolean;
    nano: boolean;
  };
}

interface FilterBarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  // TODO: Uncomment for later release
  // hideTextOnly?: boolean;
}

export const FilterBar = ({ filters, onFiltersChange /* , hideTextOnly = false */ }: FilterBarProps) => {

  return (
    <div className="flex flex-wrap items-center gap-0.5 sm:gap-2 p-1 sm:p-2 bg-gray-50/30 rounded-lg border border-border opacity-60 hover:opacity-100 transition-opacity duration-200">
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search..."
        value={filters.search}
        onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
        className="w-16 sm:w-32 md:w-40 px-1 sm:px-2 py-1 border border-gray-200 rounded-md bg-white/50 hover:bg-white hover:border-gray-300 focus:outline-none focus:border-gray-400 transition-colors text-xs text-gray-600 placeholder:text-gray-400"
      />
      
      {/* Vertical Separator - Hidden on mobile */}
      <div className="hidden lg:block h-6 w-px bg-gray-200"></div>
      
      {/* Model Size Filter Group */}
      <div className="flex items-center gap-0.5 sm:gap-2 ml-2">
        <span className="text-xs text-gray-500 hidden sm:inline">Size:</span>
        <div className="flex gap-0.5 sm:gap-2">
          <label className="flex items-center gap-0.5 sm:gap-1 cursor-pointer hover:text-gray-700 transition-colors">
            <input
              type="checkbox"
              checked={filters.modelSizes.standard}
              onChange={(e) => onFiltersChange({ 
                ...filters, 
                modelSizes: { ...filters.modelSizes, standard: e.target.checked }
              })}
              className="w-3 h-3 rounded border-gray-300 text-blue-600 focus:ring-0"
            />
            <span className="text-xs text-gray-600">Standard</span>
          </label>
          
          <label className="flex items-center gap-0.5 sm:gap-1 cursor-pointer hover:text-gray-700 transition-colors">
            <input
              type="checkbox"
              checked={filters.modelSizes.mini}
              onChange={(e) => onFiltersChange({ 
                ...filters, 
                modelSizes: { ...filters.modelSizes, mini: e.target.checked }
              })}
              className="w-3 h-3 rounded border-gray-300 text-blue-600 focus:ring-0"
            />
            <span className="text-xs text-gray-600">Mini</span>
          </label>
          
          <label className="flex items-center gap-0.5 sm:gap-1 cursor-pointer hover:text-gray-700 transition-colors">
            <input
              type="checkbox"
              checked={filters.modelSizes.nano}
              onChange={(e) => onFiltersChange({ 
                ...filters, 
                modelSizes: { ...filters.modelSizes, nano: e.target.checked }
              })}
              className="w-3 h-3 rounded border-gray-300 text-blue-600 focus:ring-0"
            />
            <span className="text-xs text-gray-600">Nano</span>
          </label>
        </div>
      </div>
      
      {/* TODO: Uncomment for later release - Entire Type filter section */}
      {/* <div className="hidden lg:block h-6 w-px bg-gray-200"></div>
      
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">Type:</span>
        <div className="flex gap-2">
          <label className="flex items-center gap-1 cursor-pointer hover:text-gray-700 transition-colors">
            <input
              type="checkbox"
              checked={filters.showFlagship}
              onChange={(e) => onFiltersChange({ ...filters, showFlagship: e.target.checked })}
              className="w-3 h-3 rounded border-gray-300 text-blue-600 focus:ring-0"
            />
            <span className="text-xs text-gray-600">Flagship</span>
          </label>
          
          {!hideTextOnly && (
            <label className="flex items-center gap-1 cursor-pointer hover:text-gray-700 transition-colors">
              <input
                type="checkbox"
                checked={filters.showTextModels}
                onChange={(e) => onFiltersChange({ ...filters, showTextModels: e.target.checked })}
                className="w-3 h-3 rounded border-gray-300 text-blue-600 focus:ring-0"
              />
              <Type className="w-3 h-3 text-gray-500" />
              <span className="text-xs text-gray-600">Text-Only</span>
            </label>
          )}
          
          <label className="flex items-center gap-1 cursor-pointer hover:text-gray-700 transition-colors">
            <input
              type="checkbox"
              checked={filters.showOpenWeight}
              onChange={(e) => onFiltersChange({ ...filters, showOpenWeight: e.target.checked })}
              className="w-3 h-3 rounded border-gray-300 text-blue-600 focus:ring-0"
            />
            <Image
              src={hf_logo}
              alt="Hugging Face"
              width={12}
              height={12}
              className="flex-shrink-0"
            />
            <span className="text-xs text-gray-600">Open-Weight</span>
          </label>
        </div>
      </div> */}
    </div>
  );
};

export type { FilterState };
