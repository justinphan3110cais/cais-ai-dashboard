"use client";

import React, { useState, useRef, useEffect } from "react";
import { Eye, Type, ChevronDown } from "lucide-react";
import Image from "next/image";
import hf_logo from "@/assets/hf-logo.png";
import { MODELS, getProviderLogo } from "@/app/constants";

interface FilterState {
  search: string;
  showVisionModels: boolean;
  showTextModels: boolean;
  showOpenWeight: boolean;
  selectedProviders: string[];
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

  return (
    <div className="flex flex-wrap items-center gap-4 mb-4">
      {/* Provider Filter Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsProviderDropdownOpen(!isProviderDropdownOpen)}
          className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <span className="text-sm">Companies</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isProviderDropdownOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isProviderDropdownOpen && (
          <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-300 rounded-md shadow-lg z-50">
            <div className="p-2">
              <div className="grid grid-cols-2 gap-1">
                {uniqueProviders.map((provider) => (
                  <label key={provider} className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer rounded">
                    <input
                      type="checkbox"
                      checked={filters.selectedProviders.includes(provider)}
                      onChange={() => handleProviderToggle(provider)}
                      className="rounded"
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
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      
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