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
  // Note: availableModels already filters out models without data for the current selection
  const sortedModels = useMemo(() => {
    // Filter by search term only - data availability is handled by availableModels prop
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

  // Calculate the effective count of selected models that are actually available
  // This handles the edge case where a model is selected but doesn't have data for the current category
  const effectiveSelectedCount = useMemo(() => {
    const availableModelNames = new Set(modelsToShow.map(m => m.name));
    return filters.selectedModels.filter(name => availableModelNames.has(name)).length;
  }, [filters.selectedModels, modelsToShow]);

  return (
    <div className="flex items-center gap-1.5 w-fit">
      {/* Model Multi-Select Search with Label */}
      <span className="text-xs font-medium">Models:</span>
      <div className="relative" ref={modelDropdownRef}>
        <button
          onClick={() => setModelSearchOpen(!modelSearchOpen)}
          className="flex items-center justify-between gap-2 px-2.5 py-1 border border-gray-400 rounded bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left w-56 shadow-sm"
        >
            <span className="text-xs text-gray-900">
              {effectiveSelectedCount} model{effectiveSelectedCount !== 1 ? 's' : ''} selected
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform flex-shrink-0 ${modelSearchOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {modelSearchOpen && (
            <div className="absolute top-full right-0 mt-3 w-[85vw] sm:w-[600px] max-w-[600px] bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-60 overflow-hidden flex flex-col">
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
                          className="flex items-center gap-2 p-1.5 sm:p-2 cursor-pointer rounded hover:bg-gray-100"
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleModelToggle(model.name)}
                            className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-gray-300 flex-shrink-0"
                            style={{ accentColor: '#2563eb' }}
                          />
                          <Image
                            src={getProviderLogo(model.provider).src}
                            alt={`${model.provider} logo`}
                            width={12}
                            height={12}
                            className="flex-shrink-0 sm:w-[14px] sm:h-[14px]"
                          />
                          <span className="text-xs sm:text-sm">{model.name}</span>
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
  );
};

