"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { MODELS, getProviderLogo } from "@/app/constants";
import { Model } from "@/lib/types";

interface ChartFilterState {
  selectedProviders: string[];
  selectedModels: string[];
}

interface ChartFilterBarProps {
  filters: ChartFilterState;
  onFiltersChange: (filters: ChartFilterState) => void;
  availableModels?: Model[]; // Optional prop to filter available models
}

export const ChartFilterBar = ({ filters, onFiltersChange, availableModels }: ChartFilterBarProps) => {
  const [modelSearchOpen, setModelSearchOpen] = useState(false);
  const [modelSearchTerm, setModelSearchTerm] = useState("");
  const modelDropdownRef = useRef<HTMLDivElement>(null);
  
  // Use provided models or default to all MODELS
  const modelsToShow = availableModels || MODELS;
  
  // Get unique providers from models for sorting
  const uniqueProviders = Array.from(new Set(modelsToShow.map(model => model.provider)))
    .sort((a, b) => {
      const topProviders = ["anthropic", "google", "openai", "xai"];
      const aIndex = topProviders.indexOf(a.toLowerCase());
      const bIndex = topProviders.indexOf(b.toLowerCase());
      
      // Both in top providers - sort by their order in topProviders
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      // Only a is in top providers - a comes first
      if (aIndex !== -1) return -1;
      // Only b is in top providers - b comes first
      if (bIndex !== -1) return 1;
      // Neither in top providers - sort alphabetically
      return a.localeCompare(b);
    });
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(event.target as Node)) {
        setModelSearchOpen(false);
        setModelSearchTerm("");
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle model toggle
  const handleModelToggle = (modelName: string) => {
    const newSelectedModels = filters.selectedModels.includes(modelName)
      ? filters.selectedModels.filter(m => m !== modelName)
      : [...filters.selectedModels, modelName];
    
    onFiltersChange({ ...filters, selectedModels: newSelectedModels });
  };

  // Get all models, filtered by search term and sorted by provider order
  const sortedModels = useMemo(() => {
    // Filter by search term only - no flagship/size restrictions
    const filtered = modelsToShow.filter(model => 
      model.name.toLowerCase().includes(modelSearchTerm.toLowerCase())
    );
    
    // Sort by provider order (using uniqueProviders which has the correct order)
    const sortByProvider = (a: typeof modelsToShow[0], b: typeof modelsToShow[0]) => {
      const aIndex = uniqueProviders.indexOf(a.provider);
      const bIndex = uniqueProviders.indexOf(b.provider);
      return aIndex - bIndex;
    };
    
    return filtered.sort(sortByProvider);
  }, [modelSearchTerm, uniqueProviders, modelsToShow]);

  return (
    <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4 p-3 sm:p-4 bg-gray-50/30 rounded-lg border border-border">
      {/* Model Multi-Select Search with Label */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <span className="hidden sm:block text-sm font-medium text-gray-700">Models:</span>
        <div className="relative flex-1 sm:flex-initial" ref={modelDropdownRef}>
          <button
            onClick={() => setModelSearchOpen(!modelSearchOpen)}
            className="flex items-center justify-between gap-2 px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left w-full sm:w-80"
          >
            <span className="text-sm text-gray-900">
              {filters.selectedModels.length} model{filters.selectedModels.length !== 1 ? 's' : ''} selected
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform flex-shrink-0 ${modelSearchOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {modelSearchOpen && (
            <div className="absolute top-full left-0 right-0 sm:right-auto mt-1 sm:w-[600px] max-w-[calc(100vw-2rem)] bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-80 overflow-hidden flex flex-col">
            {/* Search Input */}
            <div className="p-2 border-b border-gray-200">
              <input
                type="text"
                placeholder="Search models..."
                value={modelSearchTerm}
                onChange={(e) => setModelSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>
            
            {/* Single Model List - Selected at Top, Then Sorted by Provider */}
            <div className="overflow-y-auto flex-1">
              {sortedModels.length > 0 ? (
                <div className="p-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                    {sortedModels.map((model) => {
                      const isSelected = filters.selectedModels.includes(model.name);
                      return (
                        <label 
                          key={model.name} 
                          className="flex items-center gap-2 p-2 cursor-pointer rounded hover:bg-gray-100"
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleModelToggle(model.name)}
                            className="w-4 h-4 rounded border-gray-300 flex-shrink-0"
                            style={{ accentColor: '#2563eb' }}
                          />
                          <Image
                            src={getProviderLogo(model.provider).src}
                            alt={`${model.provider} logo`}
                            width={14}
                            height={14}
                            className="flex-shrink-0"
                          />
                          <span className="text-sm">{model.name}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center text-sm text-gray-500">
                  No models found
                </div>
              )}
            </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

