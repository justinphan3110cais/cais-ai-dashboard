"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { EyeOff, ChevronDown, ChevronUp, Save } from "lucide-react";
import hf_logo from "@/assets/hf-logo.png";
import { MODELS, TEXT_CAPABILITIES_DATASETS, MULTIMODAL_DATASETS, SAFETY_DATASETS, getProviderLogo, BENCHMARK_TYPES } from "@/app/constants";
import { Dataset, Model } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FilterBar, FilterState } from "@/components/FilterBar";
import { EditableTableCell } from "@/components/EditableTableCell";
import DatasetDetailsDialog from "@/components/DatasetDetailsDialog";

interface SortConfig {
  key: string | null;
  direction: 'asc' | 'desc' | null;
}



interface ExpandState {
  textCapabilities: boolean;
  multimodal: boolean;
  safety: boolean;
}

const DatasetHeader = ({ 
  dataset, 
  onSort, 
  sortConfig,
  onShowDetails
}: { 
  dataset: Dataset; 
  onSort: (datasetId: string) => void;
  sortConfig: SortConfig;
  onShowDetails: (datasetId: string, datasetName: string) => void;
}) => {
  const getSortIcon = () => {
    if (sortConfig.key !== dataset.id) return null;
    if (sortConfig.direction === 'asc') return '↑';
    if (sortConfig.direction === 'desc') return '↓';
    return null; // No sort indicator when direction is null
  };

  return (
    <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
            onClick={() => onSort(dataset.id)}
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
              <span className="text-xs font-medium">
                {dataset.id === "textquests_harm" ? "TextQuests Harm" : 
                 dataset.id === "vct_refusal" ? "VCT - Refusal" :
                 dataset.id === "enigmaeval" ? "EnigmaEval" :
                 dataset.id === "intphys2" ? "IntPhys2" :
                 dataset.id === "textquests" ? "TextQuests" : 
                 dataset.name}
              </span>
              {dataset.capabilities?.map((capabilityId) => {
                const benchmarkType = BENCHMARK_TYPES[capabilityId];
                if (!benchmarkType) return null;
                
                const IconComponent = benchmarkType.icon;
                
                return (
                  <TooltipProvider key={capabilityId}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex-shrink-0">
                          <IconComponent className="w-3 h-3 text-gray-500" />
                        </div>
              </TooltipTrigger>
                      <TooltipContent className="bg-white text-black border border-gray-200 shadow-lg">
                        <p>{benchmarkType.tooltipText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
              <span className="text-xs ml-1">{getSortIcon()}</span>
    </div>
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs bg-white text-black border border-gray-200 shadow-lg">
          <div dangerouslySetInnerHTML={{ __html: dataset.description }} style={{ lineHeight: '1.6' }} />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onShowDetails(dataset.id, dataset.name);
            }}
            className="mt-3 px-3 py-1 bg-background text-foreground border border-foreground text-xs rounded hover:bg-foreground hover:text-background transition-colors"
          >
            Examples and Details
          </button>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};



const LeaderboardTable = ({ 
  datasets, 
  models, 
  bgColor, 
  sortConfig, 
  onSort,
  expanded = false,
  isEditMode = false,
  onUpdateScore,
  onShowDetails
}: { 
  datasets: Dataset[];
  models: Model[];
  bgColor: string;
  sortConfig: SortConfig;
  onSort: (datasetId: string) => void;
  expanded?: boolean;
  isEditMode?: boolean;
  onUpdateScore?: (modelName: string, datasetId: string, newValue: number | null) => void;
  onShowDetails: (datasetId: string, datasetName: string) => void;
}) => {
  const formatValue = (value: number | null) => {
    if (value === null) return "-";
    return value.toFixed(1);
  };

  const calculateAverage = (model: Model, datasets: Dataset[]) => {
    const scores = datasets
      .map(dataset => model.scores[dataset.id])
      .filter((score): score is number => score !== null);
    
    if (scores.length === 0) return null;
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  };

  const getRowStyling = (model: Model) => {
    if (model.modelGeneration === 'green') {
      return 'bg-slate-50 hover:bg-slate-100';
    } else {
      return 'hover:bg-gray-50';
    }
  };

  const tableContent = (
        <Table>
      <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
          <TableHead className={`w-[200px] border-r border-gray-300 border-b-2 border-b-gray-300 sticky left-0 bg-gray-50 z-30`}>
            Model
          </TableHead>
          {datasets.map((dataset, index) => (
            <TableHead 
              key={dataset.name} 
              className={`text-center ${bgColor} min-w-[80px] border-b-2 border-b-gray-300 ${index < datasets.length ? 'border-r border-gray-300' : ''}`}
            >
              <DatasetHeader dataset={dataset} onSort={onSort} sortConfig={sortConfig} onShowDetails={onShowDetails} />
            </TableHead>
          ))}
          <TableHead className={`text-center ${bgColor} min-w-[80px] font-bold border-b-2 border-b-gray-300`}>
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
        {models.map((model) => (
          <TableRow 
            key={model.name} 
            className={`border-b border-gray-200 ${getRowStyling(model)} ${model.modelCardUrl ? 'group' : ''}`}
          >
              <TableCell 
                className={`text-center ${bgColor}/30 border-r border-gray-300`}
              >              <div className="flex items-center gap-2">
                <Image
                  src={getProviderLogo(model.provider).src}
                  alt={`${model.provider} logo`}
                  width={getProviderLogo(model.provider).width}
                  height={getProviderLogo(model.provider).height}
                  className="flex-shrink-0"
                />
                <span 
                  className={`text-sm font-medium ${model.modelCardUrl ? 'cursor-pointer group-hover:border-b group-hover:border-dashed group-hover:border-gray-600' : ''}`}
                  onClick={() => model.modelCardUrl && window.open(model.modelCardUrl, '_blank')}
                >
                  {model.name}
                </span>
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
            
            {datasets.map((dataset, index) => {
              return (
                <TableCell 
                  key={dataset.name} 
                  className={`text-center ${bgColor}/30 ${index < datasets.length ? 'border-r border-gray-300' : ''}`}
                >
                  <EditableTableCell
                    value={model.scores[dataset.id]}
                    onSave={(newValue) => onUpdateScore?.(model.name, dataset.id, newValue)}
                    isEditable={isEditMode}
                    isGrayedOut={false}
                  />
                </TableCell>
            );
            })}
            
            <TableCell className={`text-center ${bgColor}/30 font-bold`}>
              <span className="font-mono text-sm">
                {formatValue(calculateAverage(model, datasets))}
              </span>
            </TableCell>
          </TableRow>
        ))}
          </TableBody>
        </Table>
  );

  return (
    <div className="border border-gray-300 rounded-md">
      {expanded ? (
        <div className="overflow-auto">
          {tableContent}
        </div>
      ) : (
        <ScrollArea className="h-96">
          {tableContent}
        </ScrollArea>
      )}
    </div>
  );
};

export function ModelResultsTable() {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    showTextModels: false,
    showOpenWeight: false,
    showFlagship: true,
    selectedProviders: [],
    modelSizes: {
      standard: true,
      mini: true,
      nano: false,
    },
  });

  const [expandState, setExpandState] = useState<ExpandState>({
    textCapabilities: false,
    multimodal: false,
    safety: false,
  });

  const [textCapabilitiesSortConfig, setTextCapabilitiesSortConfig] = useState<SortConfig>({
    key: null,
    direction: null,
  });

  const [multimodalSortConfig, setMultimodalSortConfig] = useState<SortConfig>({
    key: null,
    direction: null,
  });

  const [safetySortConfig, setSafetySortConfig] = useState<SortConfig>({
    key: null,
    direction: null,
  });

  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);

  // Dataset details dialog state
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    dataset: null as Dataset | null
  });
  const [models, setModels] = useState<Model[]>(MODELS);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Check if edit mode is enabled from environment variable
  useEffect(() => {
    const editModeEnabled = process.env.NEXT_PUBLIC_ENABLE_EDIT_MODE === 'true';
    setIsEditMode(editModeEnabled);
  }, []);

  // Save models to JSON file
  const saveModels = async () => {
    try {
      const response = await fetch('/api/save-models', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(models),
      });

      if (response.ok) {
        setHasUnsavedChanges(false);
        alert('Models saved successfully!');
      } else {
        alert('Failed to save models');
      }
    } catch (error) {
      console.error('Error saving models:', error);
      alert('Error saving models');
    }
  };

  // Update a model's score
  const updateModelScore = (modelName: string, datasetId: string, newValue: number | null) => {
    setModels(prevModels => 
      prevModels.map(model => 
        model.name === modelName 
          ? { ...model, scores: { ...model.scores, [datasetId]: newValue } }
          : model
      )
    );
    setHasUnsavedChanges(true);
  };

  // Dataset details dialog handlers
  const handleShowDetails = (datasetId: string) => {
    // Find the dataset object from all dataset arrays
    const allDatasets = [...TEXT_CAPABILITIES_DATASETS, ...MULTIMODAL_DATASETS, ...SAFETY_DATASETS];
    const dataset = allDatasets.find(d => d.id === datasetId);
    
    setDialogState({
      isOpen: true,
      dataset: dataset || null
    });
  };

  const handleCloseDetails = () => {
    setDialogState({
      isOpen: false,
      dataset: null
    });
  };

  const filteredModels = useMemo(() => {
    return models.filter(model => {
      // Search filter
      if (filters.search && !model.name.toLowerCase().includes(filters.search.toLowerCase())) {
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

      // Provider filter - if any providers are selected, only show models from those providers
      if (filters.selectedProviders.length > 0 && !filters.selectedProviders.includes(model.provider)) {
        return false;
      }

      // Model size filter - show models based on selected sizes
      const modelSize = model.model_size || 'standard'; // Default to standard if not specified
      if (!filters.modelSizes[modelSize]) {
        return false;
      }

      // Flagship filter - show only flagship models when checked
      if (filters.showFlagship && model.flagship === false) {
        return false;
      }

      return true;
    });
  }, [filters, models]);

  const sortModels = (models: Model[], datasets: Dataset[], sortConfig: SortConfig) => {
    if (!sortConfig.key || !sortConfig.direction) return models;

    return [...models].sort((a, b) => {
      if (sortConfig.key === 'average') {
        // Calculate averages for sorting
        const avgA = datasets
          .map(d => a.scores[d.id])
          .filter((score): score is number => score !== null)
          .reduce((sum, score, _, arr) => sum + score / arr.length, 0) || 0;
        
        const avgB = datasets
          .map(d => b.scores[d.id])
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

  const handleTextCapabilitiesSort = (datasetId: string) => {
    setTextCapabilitiesSortConfig(prev => {
      if (prev.key !== datasetId) {
        // First click on new column: desc
        return { key: datasetId, direction: 'desc' };
      } else if (prev.direction === 'desc') {
        // Second click: asc
        return { key: datasetId, direction: 'asc' };
      } else if (prev.direction === 'asc') {
        // Third click: no sort
        return { key: null, direction: null };
      } else {
        // Back to desc (shouldn't happen but fallback)
        return { key: datasetId, direction: 'desc' };
      }
    });
  };

  const handleMultimodalSort = (datasetId: string) => {
    setMultimodalSortConfig(prev => {
      if (prev.key !== datasetId) {
        // First click on new column: desc
        return { key: datasetId, direction: 'desc' };
      } else if (prev.direction === 'desc') {
        // Second click: asc
        return { key: datasetId, direction: 'asc' };
      } else if (prev.direction === 'asc') {
        // Third click: no sort
        return { key: null, direction: null };
      } else {
        // Back to desc (shouldn't happen but fallback)
        return { key: datasetId, direction: 'desc' };
      }
    });
  };

  const handleSafetySort = (datasetId: string) => {
    setSafetySortConfig(prev => {
      if (prev.key !== datasetId) {
        // First click on new column: desc
        return { key: datasetId, direction: 'desc' };
      } else if (prev.direction === 'desc') {
        // Second click: asc
        return { key: datasetId, direction: 'asc' };
      } else if (prev.direction === 'asc') {
        // Third click: no sort
        return { key: null, direction: null };
      } else {
        // Back to desc (shouldn't happen but fallback)
        return { key: datasetId, direction: 'desc' };
      }
    });
  };

  // Filter out text-only models from vision table
  const visionCapableModels = filteredModels.filter(model => model.isTextOnlyModel !== true);
  
  const textCapabilitiesSortedModels = sortModels(filteredModels, TEXT_CAPABILITIES_DATASETS, textCapabilitiesSortConfig);
  const multimodalSortedModels = sortModels(visionCapableModels, MULTIMODAL_DATASETS, multimodalSortConfig);
  const safetySortedModels = sortModels(filteredModels, SAFETY_DATASETS, safetySortConfig);

  return (
    <div className="w-full space-y-6">
      {isEditMode && (
        <div className="flex justify-end">
          <button
            onClick={saveModels}
            disabled={!hasUnsavedChanges}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium ${
              hasUnsavedChanges 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Save className="w-4 h-4" />
            Save Changes
            {hasUnsavedChanges && (
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>
        </div>
      )}
      
      <FilterBar 
        filters={filters} 
        onFiltersChange={setFilters}
      />
      
      {/* Text-based Capabilities Card */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-blue-50 px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-blue-700">Text</h3>
        </div>
        <LeaderboardTable
          datasets={TEXT_CAPABILITIES_DATASETS}
          models={textCapabilitiesSortedModels}
          bgColor="bg-blue-50"
          sortConfig={textCapabilitiesSortConfig}
          onSort={handleTextCapabilitiesSort}
          expanded={expandState.textCapabilities}
          isEditMode={isEditMode}
          onUpdateScore={updateModelScore}
          onShowDetails={handleShowDetails}
        />
        {!expandState.textCapabilities && (
          <div className="border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => {
                setExpandState(prev => ({ ...prev, textCapabilities: true }));
                // When expanding, show all model sizes
                setFilters(prev => ({
                  ...prev,
                  modelSizes: {
                    standard: true,
                    mini: true,
                    nano: true
                  }
                }));
              }}
              className="w-full py-3 flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
            >
              <span className="text-sm font-medium">View All</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}
        {expandState.textCapabilities && (
          <div className="border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => {
                setExpandState(prev => ({ ...prev, textCapabilities: false }));
                // When collapsing, show standard and mini models
                setFilters(prev => ({
                  ...prev,
                  modelSizes: {
                    standard: true,
                    mini: true,
                    nano: false
                  }
                }));
              }}
              className="w-full py-3 flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
            >
              <span className="text-sm font-medium">Collapse</span>
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Multimodal Capabilities Card */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-green-50 px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-green-700">Vision</h3>
        </div>
        <LeaderboardTable
          datasets={MULTIMODAL_DATASETS}
          models={multimodalSortedModels}
          bgColor="bg-green-50"
          sortConfig={multimodalSortConfig}
          onSort={handleMultimodalSort}
          expanded={expandState.multimodal}
          isEditMode={isEditMode}
          onUpdateScore={updateModelScore}
          onShowDetails={handleShowDetails}
        />
        {!expandState.multimodal && (
          <div className="border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => {
                setExpandState(prev => ({ ...prev, multimodal: true }));
                // When expanding, show all model sizes
                setFilters(prev => ({
                  ...prev,
                  modelSizes: {
                    standard: true,
                    mini: true,
                    nano: true
                  }
                }));
              }}
              className="w-full py-3 flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
            >
              <span className="text-sm font-medium">View All</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}
        {expandState.multimodal && (
          <div className="border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => {
                setExpandState(prev => ({ ...prev, multimodal: false }));
                // When collapsing, show standard and mini models
                setFilters(prev => ({
                  ...prev,
                  modelSizes: {
                    standard: true,
                    mini: true,
                    nano: false
                  }
                }));
              }}
              className="w-full py-3 flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
            >
              <span className="text-sm font-medium">Collapse</span>
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
 
      {/* Safety Card */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-red-50 px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-red-700">Safety</h3>
        </div>
        <LeaderboardTable
          datasets={SAFETY_DATASETS}
          models={safetySortedModels}
          bgColor="bg-red-50"
          sortConfig={safetySortConfig}
          onSort={handleSafetySort}
          expanded={expandState.safety}
          isEditMode={isEditMode}
          onUpdateScore={updateModelScore}
          onShowDetails={handleShowDetails}
        />
        {!expandState.safety && (
          <div className="border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => {
                setExpandState(prev => ({ ...prev, safety: true }));
                // When expanding, show all model sizes
                setFilters(prev => ({
                  ...prev,
                  modelSizes: {
                    standard: true,
                    mini: true,
                    nano: true
                  }
                }));
              }}
              className="w-full py-3 flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
            >
              <span className="text-sm font-medium">View All</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}
        {expandState.safety && (
          <div className="border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => {
                setExpandState(prev => ({ ...prev, safety: false }));
                // When collapsing, show standard and mini models
                setFilters(prev => ({
                  ...prev,
                  modelSizes: {
                    standard: true,
                    mini: true,
                    nano: false
                  }
                }));
              }}
              className="w-full py-3 flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
            >
              <span className="text-sm font-medium">Collapse</span>
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

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

      {/* Dataset Details Dialog */}
      <DatasetDetailsDialog
        isOpen={dialogState.isOpen}
        onClose={handleCloseDetails}
        dataset={dialogState.dataset}
      />
    </div>
  );
}