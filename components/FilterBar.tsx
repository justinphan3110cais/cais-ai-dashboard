"use client";

import React, { useState, useRef, useEffect } from "react";
import { Type, ChevronDown, Star } from "lucide-react";
import Image from "next/image";
import hf_logo from "@/assets/hf-logo.png";
import { MODELS, getProviderLogo } from "@/app/constants";

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
}

export const FilterBar = ({ filters, onFiltersChange }: FilterBarProps) => {
  const [isProviderDropdownOpen, setIsProviderDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Get unique providers from models
  const uniqueProviders = Array.from(new Set(MODELS.map(model => model.provider))).sort();
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProviderDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleProviderToggle = (provider: string) => {
    const newSelectedProviders = filters.selectedProviders.includes(provider)
      ? filters.selectedProviders.filter(p => p !== provider)
      : [...filters.selectedProviders, provider];
    
    onFiltersChange({ ...filters, selectedProviders: newSelectedProviders });
  };

  const allProvidersSelected = filters.selectedProviders.length === 0;

  return (
    <div className="flex flex-wrap items-center gap-3 sm:gap-6 mb-4 p-3 sm:p-4 bg-gray-50/30 rounded-lg border border-border">
      {/* Provider Filter Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsProviderDropdownOpen(!isProviderDropdownOpen)}
          className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <span className="text-sm font-medium text-gray-900">
            Companies {!allProvidersSelected && `(${filters.selectedProviders.length})`}
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isProviderDropdownOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isProviderDropdownOpen && (
          <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-300 rounded-md shadow-lg z-50">
            <div className="p-2">
              <div className="grid grid-cols-2 gap-1">
                {uniqueProviders.map((provider) => {
                  const isExplicitlySelected = filters.selectedProviders.includes(provider);
                  const isDefaultSelected = allProvidersSelected;
                  const showAsSelected = isDefaultSelected || isExplicitlySelected;
                  
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
      
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search models..."
        value={filters.search}
        onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
        className="flex-1 min-w-[200px] sm:w-56 sm:flex-initial px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      />
      
      {/* Vertical Separator - Hidden on mobile */}
      <div className="hidden lg:block h-16 w-px bg-gray-300"></div>
      
      {/* Model Size Filter Group */}
      <div className="flex flex-col gap-2 px-2 sm:px-3 py-2 bg-white rounded-md border border-gray-200 shadow-sm w-full sm:w-auto">
        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-0.5">Model Size</span>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-blue-600 transition-colors">
            <input
              type="checkbox"
              checked={filters.modelSizes.standard}
              onChange={(e) => onFiltersChange({ 
                ...filters, 
                modelSizes: { ...filters.modelSizes, standard: e.target.checked }
              })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium">Standard</span>
          </label>
          
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-blue-600 transition-colors">
            <input
              type="checkbox"
              checked={filters.modelSizes.mini}
              onChange={(e) => onFiltersChange({ 
                ...filters, 
                modelSizes: { ...filters.modelSizes, mini: e.target.checked }
              })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium">Mini</span>
          </label>
          
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-blue-600 transition-colors">
            <input
              type="checkbox"
              checked={filters.modelSizes.nano}
              onChange={(e) => onFiltersChange({ 
                ...filters, 
                modelSizes: { ...filters.modelSizes, nano: e.target.checked }
              })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium">Nano</span>
          </label>
        </div>
      </div>
      
      {/* Vertical Separator - Hidden on mobile */}
      <div className="hidden lg:block h-16 w-px bg-gray-300"></div>
      
      {/* Model Type Filter Group */}
      <div className="flex flex-col gap-2 px-2 sm:px-3 py-2 bg-white rounded-md border border-gray-200 shadow-sm w-full sm:w-auto">
        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-0.5">Model Type</span>
        <div className="flex flex-wrap gap-4 sm:gap-5">
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-blue-600 transition-colors">
            <div onClick={(e) => {
              e.preventDefault();
              onFiltersChange({ ...filters, showFlagship: !filters.showFlagship });
            }}>
              <Star 
                className={`w-4 h-4 transition-colors ${
                  filters.showFlagship 
                    ? 'text-yellow-500 fill-blue-500 stroke-yellow-500' 
                    : 'text-yellow-500 fill-none stroke-yellow-500'
                }`} 
              />
            </div>
            <span className="text-sm font-medium">Flagship</span>
          </label>
          
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-blue-600 transition-colors">
            <input
              type="checkbox"
              checked={filters.showTextModels}
              onChange={(e) => onFiltersChange({ ...filters, showTextModels: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <Type className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium">Text-Only</span>
          </label>
          
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-blue-600 transition-colors">
            <input
              type="checkbox"
              checked={filters.showOpenWeight}
              onChange={(e) => onFiltersChange({ ...filters, showOpenWeight: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <Image
              src={hf_logo}
              alt="Hugging Face"
              width={16}
              height={16}
              className="flex-shrink-0"
            />
            <span className="text-sm font-medium">Open-Weight</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export type { FilterState };
