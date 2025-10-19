"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
// TODO: Uncomment for later release - Type filter imports
// import { Type, Square } from "lucide-react";
// import hf_logo from "@/assets/hf-logo.png";
import Image from "next/image";
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
  // TODO: Uncomment for later release
  // hideTextOnly?: boolean;
}

export const FilterBar = ({ filters, onFiltersChange /* , hideTextOnly = false */ }: FilterBarProps) => {
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
    <div className="flex flex-wrap items-center gap-1 sm:gap-2 p-1 sm:p-2 bg-gray-50/30 rounded-lg border border-border opacity-60 hover:opacity-100 transition-opacity duration-200">
      {/* Provider Filter Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsProviderDropdownOpen(!isProviderDropdownOpen)}
          className="flex items-center gap-1 px-1.5 sm:px-2 py-1 border border-gray-200 rounded-md bg-white/50 hover:bg-white hover:border-gray-300 focus:outline-none transition-colors text-xs"
        >
          <span className="text-xs text-gray-600 whitespace-nowrap">
            Companies {!allProvidersSelected && `(${filters.selectedProviders.length})`}
          </span>
          <ChevronDown className={`w-3 h-3 text-gray-500 transition-transform ${isProviderDropdownOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isProviderDropdownOpen && (
          <div className="absolute top-full left-0 mt-1 w-64 sm:w-80 bg-white border border-gray-300 rounded-md shadow-lg z-[100]">
            <div className="p-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
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
        placeholder="Search..."
        value={filters.search}
        onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
        className="w-20 sm:w-32 md:w-40 px-1.5 sm:px-2 py-1 border border-gray-200 rounded-md bg-white/50 hover:bg-white hover:border-gray-300 focus:outline-none focus:border-gray-400 transition-colors text-xs text-gray-600 placeholder:text-gray-400"
      />
      
      {/* Vertical Separator - Hidden on mobile */}
      <div className="hidden lg:block h-6 w-px bg-gray-200"></div>
      
      {/* Model Size Filter Group */}
      <div className="flex items-center gap-1 sm:gap-2">
        <span className="text-xs text-gray-500 hidden sm:inline">Size:</span>
        <div className="flex gap-1 sm:gap-2">
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
            <span className="text-xs text-gray-600">Std</span>
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
