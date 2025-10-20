"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { MODELS, getProviderLogo } from "@/app/constants";

interface ChartFilterState {
  selectedProviders: string[];
  selectedModels: string[];
}

interface ChartFilterBarProps {
  filters: ChartFilterState;
  onFiltersChange: (filters: ChartFilterState) => void;
}

export const ChartFilterBar = ({ filters, onFiltersChange }: ChartFilterBarProps) => {
  const [modelSearchOpen, setModelSearchOpen] = useState(false);
  const [modelSearchTerm, setModelSearchTerm] = useState("");
  const [isProviderDropdownOpen, setIsProviderDropdownOpen] = useState(false);
  const modelDropdownRef = useRef<HTMLDivElement>(null);
  const providerDropdownRef = useRef<HTMLDivElement>(null);
  
  // Default providers to show
  const defaultProviders = ["openai", "anthropic", "xai", "google"];
  
  // Get unique providers from models, sorted with top 4 first
  const uniqueProviders = Array.from(new Set(MODELS.map(model => model.provider)))
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
      if (providerDropdownRef.current && !providerDropdownRef.current.contains(event.target as Node)) {
        setIsProviderDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Handle provider toggle
  const handleProviderToggle = (provider: string) => {
    let newSelectedProviders: string[];
    
    // If currently using defaults (empty array), switch to explicit selection
    if (filters.selectedProviders.length === 0) {
      // Start with all default providers except the one being toggled off
      // or add all defaults plus the new one
      const isDefaultProvider = defaultProviders.includes(provider.toLowerCase());
      if (isDefaultProvider) {
        // Toggling off a default provider - explicitly select the other defaults
        newSelectedProviders = defaultProviders.filter(p => p.toLowerCase() !== provider.toLowerCase());
      } else {
        // Adding a non-default provider - explicitly include all defaults plus this one
        newSelectedProviders = [...defaultProviders, provider];
      }
    } else {
      // Already explicit selection - toggle normally
      newSelectedProviders = filters.selectedProviders.includes(provider)
        ? filters.selectedProviders.filter(p => p !== provider)
        : [...filters.selectedProviders, provider];
    }
    
    onFiltersChange({ ...filters, selectedProviders: newSelectedProviders });
  };

  // Handle model toggle
  const handleModelToggle = (modelName: string) => {
    const newSelectedModels = filters.selectedModels.includes(modelName)
      ? filters.selectedModels.filter(m => m !== modelName)
      : [...filters.selectedModels, modelName];
    
    onFiltersChange({ ...filters, selectedModels: newSelectedModels });
  };

  // Sort models by provider order (static, doesn't change based on selection)
  const sortedModels = useMemo(() => {
    const filtered = MODELS.filter(model => 
      model.name.toLowerCase().includes(modelSearchTerm.toLowerCase())
    );
    
    // Sort by provider order (using uniqueProviders which has the correct order)
    const sortByProvider = (a: typeof MODELS[0], b: typeof MODELS[0]) => {
      const aIndex = uniqueProviders.indexOf(a.provider);
      const bIndex = uniqueProviders.indexOf(b.provider);
      return aIndex - bIndex;
    };
    
    return filtered.sort(sortByProvider);
  }, [modelSearchTerm, uniqueProviders]);

  // Check if provider is selected (default or explicit)
  const isProviderSelected = (provider: string) => {
    // If empty array, use defaults
    if (filters.selectedProviders.length === 0) {
      return defaultProviders.includes(provider.toLowerCase());
    }
    // Check if provider is in selected list (case-insensitive)
    return filters.selectedProviders.some(p => p.toLowerCase() === provider.toLowerCase());
  };

  return (
    <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4 p-3 sm:p-4 bg-gray-50/30 rounded-lg border border-border">
      {/* Provider Filter Dropdown */}
      <div className="relative" ref={providerDropdownRef}>
        <button
          onClick={() => setIsProviderDropdownOpen(!isProviderDropdownOpen)}
          className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <span className="text-sm font-medium text-gray-900">
            Companies ({filters.selectedProviders.length > 0 ? filters.selectedProviders.length : defaultProviders.length})
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isProviderDropdownOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isProviderDropdownOpen && (
          <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-300 rounded-md shadow-lg z-50">
            <div className="p-2">
              <div className="grid grid-cols-2 gap-1">
                {uniqueProviders.map((provider) => {
                  const isExplicitlySelected = filters.selectedProviders.some(
                    p => p.toLowerCase() === provider.toLowerCase()
                  );
                  const showAsSelected = isProviderSelected(provider);
                  
                  return (
                    <label 
                      key={provider} 
                      className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer rounded"
                    >
                      <input
                        type="checkbox"
                        checked={showAsSelected}
                        onChange={() => handleProviderToggle(provider)}
                        style={{
                          accentColor: isExplicitlySelected ? '#2563eb' : '#9ca3af'
                        }}
                        className="rounded border-gray-300"
                      />
                      <Image
                        src={getProviderLogo(provider).src}
                        alt={`${provider} logo`}
                        width={16}
                        height={16}
                        className="flex-shrink-0"
                      />
                      <span className="text-sm">{
                        provider === 'openai' ? 'OpenAI' :
                        provider === 'xai' ? 'xAI' :
                        provider === 'deepseek' ? 'DeepSeek' :
                        provider.charAt(0).toUpperCase() + provider.slice(1)
                      }</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Model Multi-Select Search with Label */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Models:</span>
        <div className="relative" ref={modelDropdownRef}>
          <button
            onClick={() => setModelSearchOpen(!modelSearchOpen)}
            className="flex items-center justify-between gap-2 px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left w-64 sm:w-80"
          >
            <span className="text-sm text-gray-900">
              {filters.selectedModels.length} model{filters.selectedModels.length !== 1 ? 's' : ''} selected
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform flex-shrink-0 ${modelSearchOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {modelSearchOpen && (
            <div className="absolute top-full left-0 mt-1 w-[600px] bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-80 overflow-hidden flex flex-col">
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
                  <div className="grid grid-cols-2 gap-1">
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

