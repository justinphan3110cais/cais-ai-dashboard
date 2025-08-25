"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { EyeOff } from "lucide-react";
import hf_logo from "@/assets/hf-logo.png";
import { MODELS, CAPABILITIES_DATASETS, SAFETY_DATASETS, getProviderLogo } from "@/app/constants";
import { Dataset, Model } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SortConfig {
  key: string | null;
  direction: 'asc' | 'desc' | null;
}

interface FilterState {
  search: string;
  showVisionModels: boolean;
  showTextModels: boolean;
  showOpenWeight: boolean;
}

type TabType = 'capabilities' | 'safety';

const DatasetHeader = ({ 
  dataset, 
  onSort, 
  sortConfig 
}: { 
  dataset: Dataset; 
  onSort: (datasetName: string) => void;
  sortConfig: SortConfig;
}) => {
  const getSortIcon = () => {
    if (sortConfig.key !== dataset.name) return null;
    if (sortConfig.direction === 'asc') return '↑';
    if (sortConfig.direction === 'desc') return '↓';
    return null; // No sort indicator when direction is null
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button 
            onClick={() => onSort(dataset.name)}
            className="text-center hover:text-blue-600 transition-colors cursor-pointer w-full"
          >
            <div className="flex items-center justify-center gap-1">
              {dataset.logo && (
                <Image
                  src={dataset.logo}
                  alt={`${dataset.name} logo`}
                  width={16}
                  height={16}
                />
              )}
              <span className="text-xs font-medium">{dataset.name}</span>
              <span className="text-xs ml-1">{getSortIcon()}</span>
            </div>
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-sm bg-gray-800 text-white">
          <p>{dataset.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const FilterBar = ({ 
  filters, 
  onFiltersChange,
  activeTab,
  onTabChange
}: { 
  filters: FilterState; 
  onFiltersChange: (filters: FilterState) => void;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}) => {
  return (
         <div className="p-4 rounded-lg border border-gray-200 mb-6">
      <div className="flex flex-wrap items-center gap-4 mb-4">
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
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.showVisionModels}
              onChange={(e) => onFiltersChange({ ...filters, showVisionModels: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm">Vision Models</span>
          </label>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.showTextModels}
              onChange={(e) => onFiltersChange({ ...filters, showTextModels: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm">Text-Only Models</span>
          </label>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.showOpenWeight}
              onChange={(e) => onFiltersChange({ ...filters, showOpenWeight: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm">Open-Weight Models</span>
          </label>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => onTabChange('capabilities')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'capabilities'
              ? 'border-blue-500 text-blue-600 bg-blue-50'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Capabilities
        </button>
        <button
          onClick={() => onTabChange('safety')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'safety'
              ? 'border-red-500 text-red-600 bg-red-50'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Safety
        </button>
      </div>
    </div>
  );
};

const LeaderboardTable = ({ 
  datasets, 
  models, 
  bgColor, 
  sortConfig, 
  onSort 
}: { 
  datasets: Dataset[];
  models: Model[];
  bgColor: string;
  sortConfig: SortConfig;
  onSort: (datasetName: string) => void;
}) => {
  const formatValue = (value: number | null) => {
    if (value === null) return "-";
    return value.toFixed(1);
  };

  const calculateAverage = (model: Model, datasets: Dataset[]) => {
    const scores = datasets
      .map(dataset => model.scores[dataset.name])
      .filter((score): score is number => score !== null);
    
    if (scores.length === 0) return null;
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  };

  return (
    <div className="border border-gray-300 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px] border-r border-gray-300 sticky left-0 bg-white z-10">
                Model
              </TableHead>
              {datasets.map((dataset, index) => (
                <TableHead 
                  key={dataset.name} 
                  className={`text-center ${bgColor} min-w-[80px] ${index < datasets.length ? 'border-r border-gray-300' : ''}`}
                >
                  <DatasetHeader dataset={dataset} onSort={onSort} sortConfig={sortConfig} />
                </TableHead>
              ))}
              <TableHead className={`text-center ${bgColor} min-w-[80px] font-bold`}>
                <button 
                  onClick={() => onSort('average')}
                  className="text-center hover:text-blue-600 transition-colors cursor-pointer w-full"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-xs font-medium">Average</span>
                    <span className="text-xs ml-1">
                      {sortConfig.key === 'average' && sortConfig.direction === 'asc' && '↑'}
                      {sortConfig.key === 'average' && sortConfig.direction === 'desc' && '↓'}
                    </span>
                  </div>
                </button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {models.map((model) => {
              const getRowStyling = () => {
                if (model.modelGeneration === 'gold') {
                  return 'bg-amber-50 hover:bg-amber-100';
                } else if (model.modelGeneration === 'silver') {
                  return 'bg-gray-100 hover:bg-gray-200 border-gray-300';
                } else {
                  return 'hover:bg-gray-50';
                }
              };
              
              return (
                <TableRow 
                  key={model.name} 
                  className={`border-b border-gray-200 ${getRowStyling()}`}
                >
                  <TableCell className="border-r border-gray-300 sticky left-0 bg-inherit z-10">
                    <div className="flex items-center gap-2">
                      <Image
                        src={getProviderLogo(model.provider).src}
                        alt={`${model.provider} logo`}
                        width={getProviderLogo(model.provider).width}
                        height={getProviderLogo(model.provider).height}
                        className="flex-shrink-0"
                      />
                      <span className="text-sm font-medium">{model.name}</span>
                      {model.isTextOnlyModel && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex-shrink-0">
                                <EyeOff className="w-4 h-4 text-gray-500" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="bg-gray-800 text-white">
                              <p>Text-only model</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      {model.modelWeights && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => window.open(`https://huggingface.co/${model.modelWeights}`, '_blank')}
                                className="flex-shrink-0 hover:opacity-80 transition-opacity"
                              >
                                <Image
                                  src={hf_logo}
                                  alt="Hugging Face"
                                  width={14}
                                  height={14}
                                />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent className="bg-gray-100 text-foreground border border-gray-300">
                              <div className="flex items-center gap-2">
                                <Image
                                  src={getProviderLogo(model.provider).src}
                                  alt={`${model.provider} logo`}
                                  width={16}
                                  height={16}
                                />
                                <span className="text-sm">{model.modelWeights}</span>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </TableCell>
                  
                  {datasets.map((dataset, index) => (
                    <TableCell 
                      key={dataset.name} 
                      className={`text-center ${bgColor}/30 ${index < datasets.length ? 'border-r border-gray-300' : ''}`}
                    >
                      <span className="font-mono text-sm">
                        {formatValue(model.scores[dataset.name])}
                      </span>
                    </TableCell>
                  ))}
                  
                  <TableCell className={`text-center ${bgColor}/30 font-bold`}>
                    <span className="font-mono text-sm">
                      {formatValue(calculateAverage(model, datasets))}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
  );
};

export function ModelResultsTable() {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    showVisionModels: false,
    showTextModels: false,
    showOpenWeight: false,
  });

  const [activeTab, setActiveTab] = useState<TabType>('capabilities');

  const [capabilitiesSortConfig, setCapabilitiesSortConfig] = useState<SortConfig>({
    key: null,
    direction: null,
  });

  const [safetySortConfig, setSafetySortConfig] = useState<SortConfig>({
    key: null,
    direction: null,
  });

  const filteredModels = useMemo(() => {
    return MODELS.filter(model => {
      // Search filter
      if (filters.search && !model.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // Vision model filter - show models that are NOT text-only (have vision capabilities)
      if (filters.showVisionModels && model.isTextOnlyModel === true) {
        return false;
      }

      // Text-only model filter - show models that ARE text-only
      if (filters.showTextModels && model.isTextOnlyModel !== true) {
        return false;
      }

      // Open weight filter - show models that have modelWeights (Hugging Face links)
      if (filters.showOpenWeight && !model.modelWeights) {
        return false;
      }

      return true;
    });
  }, [filters]);

  const sortModels = (models: Model[], datasets: Dataset[], sortConfig: SortConfig) => {
    if (!sortConfig.key || !sortConfig.direction) return models;

    return [...models].sort((a, b) => {
      if (sortConfig.key === 'average') {
        // Calculate averages for sorting
        const avgA = datasets
          .map(d => a.scores[d.name])
          .filter((score): score is number => score !== null)
          .reduce((sum, score, _, arr) => sum + score / arr.length, 0) || 0;
        
        const avgB = datasets
          .map(d => b.scores[d.name])
          .filter((score): score is number => score !== null)
          .reduce((sum, score, _, arr) => sum + score / arr.length, 0) || 0;

        return sortConfig.direction === 'asc' ? avgA - avgB : avgB - avgA;
      } else {
        const scoreA = a.scores[sortConfig.key!] ?? -Infinity; // Treat null as lowest for sorting
        const scoreB = b.scores[sortConfig.key!] ?? -Infinity;

        if (scoreA === -Infinity && scoreB === -Infinity) return 0;
        if (scoreA === -Infinity) return sortConfig.direction === 'asc' ? -1 : 1;
        if (scoreB === -Infinity) return sortConfig.direction === 'asc' ? 1 : -1;

        return sortConfig.direction === 'asc' ? scoreA - scoreB : scoreB - scoreA;
      }
    });
  };

  const handleCapabilitiesSort = (datasetName: string) => {
    setCapabilitiesSortConfig(prev => {
      if (prev.key !== datasetName) {
        // First click on new column: desc
        return { key: datasetName, direction: 'desc' };
      } else if (prev.direction === 'desc') {
        // Second click: asc
        return { key: datasetName, direction: 'asc' };
      } else if (prev.direction === 'asc') {
        // Third click: no sort
        return { key: null, direction: null };
      } else {
        // Back to desc (shouldn't happen but fallback)
        return { key: datasetName, direction: 'desc' };
      }
    });
  };

  const handleSafetySort = (datasetName: string) => {
    setSafetySortConfig(prev => {
      if (prev.key !== datasetName) {
        // First click on new column: desc
        return { key: datasetName, direction: 'desc' };
      } else if (prev.direction === 'desc') {
        // Second click: asc
        return { key: datasetName, direction: 'asc' };
      } else if (prev.direction === 'asc') {
        // Third click: no sort
        return { key: null, direction: null };
      } else {
        // Back to desc (shouldn't happen but fallback)
        return { key: datasetName, direction: 'desc' };
      }
    });
  };

  const currentDatasets = activeTab === 'capabilities' ? CAPABILITIES_DATASETS : SAFETY_DATASETS;
  const currentBgColor = activeTab === 'capabilities' ? 'bg-blue-50' : 'bg-red-50';
  const currentSortConfig = activeTab === 'capabilities' ? capabilitiesSortConfig : safetySortConfig;
  const currentOnSort = activeTab === 'capabilities' ? handleCapabilitiesSort : handleSafetySort;
  const sortedModels = sortModels(filteredModels, currentDatasets, currentSortConfig);

  return (
    <div className="w-full space-y-4">
      <FilterBar 
        filters={filters} 
        onFiltersChange={setFilters}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <LeaderboardTable
        datasets={currentDatasets}
        models={sortedModels}
        bgColor={currentBgColor}
        sortConfig={currentSortConfig}
        onSort={currentOnSort}
      />

      <div className="space-y-4 text-center">
        <p className="text-sm text-gray-600">
          To add a model to the leaderboard or submit benchmark results, send us an email at{' '}
          <a 
            href="mailto:agibenchmark@safe.ai" 
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            agibenchmark@safe.ai
          </a>
        </p>
      </div>
    </div>
  );
}