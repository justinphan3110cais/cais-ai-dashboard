"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { EyeOff, ChevronDown, ChevronUp, Save, BarChart3, Table as TableIcon } from "lucide-react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FilterBar, FilterState } from "@/components/FilterBar";
import { InlineBarChart } from "@/components/InlineBarChart";
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
            <div className="flex flex-col items-center justify-center gap-1 px-1">
              {/* Capability Category (Secondary Text) */}
              {dataset.capabilities && dataset.capabilities.length > 0 && (
                <div className="flex items-center gap-1 flex-wrap justify-center">
                  {dataset.capabilities
                    .map(capabilityId => BENCHMARK_TYPES[capabilityId])
                    .filter(capability => capability !== undefined)
                    .map((capability, idx) => (
                      <span key={idx} className="text-[10px] text-muted-foreground uppercase tracking-wide leading-none text-center">
                        {capability.name}
                      </span>
                    ))
                  }
                </div>
              )}
              {/* Dataset Name and Logo */}
              <div className="relative flex items-center justify-center w-full">
                <div className="flex items-center gap-1 justify-center">
                  {dataset.logo && (
                    <Image
                      src={dataset.logo}
                      alt={`${dataset.name} logo`}
                      width={16}
                      height={16}
                      className="flex-shrink-0"
                    />
                  )}
                  <span className="text-xs font-medium text-center">
                    {dataset.displayName || dataset.name}
                  </span>
                </div>
                {getSortIcon() && (
                  <span className="absolute right-0 text-xs">{getSortIcon()}</span>
                )}
              </div>
    </div>
                </button>
              </TooltipTrigger>
        <TooltipContent className="w-72 bg-white text-black border border-gray-200 shadow-lg p-3">
          {(() => {
            const sentences = dataset.description.split('. ');
            const firstSentence = sentences[0] + (sentences.length > 1 ? '.' : '');
            const restOfDescription = sentences.length > 1 ? sentences.slice(1).join('. ') : '';
            
            return (
              <>
                <div className="mb-3" dangerouslySetInnerHTML={{ __html: firstSentence }} />
                {restOfDescription && (
                  <div className="text-gray-600 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: restOfDescription }} />
                )}
              </>
            );
          })()}
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
  // Helper function to get processed score (applies postprocessScore if it exists)
  const getProcessedScore = (dataset: Dataset, rawScore: number | null): number | null => {
    if (rawScore === null) return null;
    if (dataset.postprocessScore) {
      return dataset.postprocessScore(rawScore);
    }
    return rawScore;
  };

  const formatValue = (value: number | null) => {
    if (value === null) return "-";
    return value.toFixed(1);
  };

  const calculateAverage = (model: Model, datasets: Dataset[]) => {
    const scores = datasets
      .map(dataset => {
        const rawScore = model.scores[dataset.id];
        return getProcessedScore(dataset, rawScore);
      })
      .filter((score): score is number => score !== null);
    
    if (scores.length === 0) return null;
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  };

  const getRowStyling = () => {
    return 'hover:bg-gray-50';
  };

  const tableContent = (
        <Table 
          className="min-w-[800px]" 
          style={{ touchAction: 'pan-x pan-y' }}
        >
      <TableHeader className="sticky top-0 bg-background z-50">
            <TableRow>
          <TableHead 
            className={`w-[200px] border-r border-gray-300 border-b-2 border-b-gray-300 sticky left-0 ${bgColor}`}
            style={{ position: 'sticky', left: 0, top: 0, zIndex: 50 }}
          >
            <div className="font-semibold">Model</div>
          </TableHead>
          {/* Average column - show second (after Model) */}
          <TableHead className={`text-center ${bgColor} min-w-[80px] font-bold border-b-2 border-b-gray-300 border-r border-gray-300`}>
            <div className="flex items-center justify-center gap-1">
              <span className="text-xs font-bold">Average</span>
            </div>
          </TableHead>
          {datasets.map((dataset, index) => (
            <TableHead 
              key={dataset.name} 
              className={`text-center ${bgColor} min-w-[100px] w-auto border-b-2 border-b-gray-300 ${index < datasets.length - 1 ? 'border-r border-gray-300' : ''} py-1`}
            >
              <DatasetHeader dataset={dataset} onSort={onSort} sortConfig={sortConfig} onShowDetails={onShowDetails} />
            </TableHead>
          ))}
            </TableRow>
      </TableHeader>
      <TableBody>
        {models.map((model) => (
          <TableRow 
            key={model.name} 
            className={`border-b border-gray-200 ${getRowStyling()} ${model.modelCardUrl ? 'group' : ''}`}
          >
              <TableCell 
                className={`text-center border-r border-gray-300 sticky left-0 bg-white`}
                style={{ position: 'sticky', left: 0, zIndex: 10, backgroundColor: 'white' }}
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
            
            {/* Average column - show second (after Model) */}
            <TableCell className={`text-center ${bgColor}/30 font-bold border-r border-gray-300`}>
              <span className="font-mono text-sm">
                {formatValue(calculateAverage(model, datasets))}
              </span>
                </TableCell>
            
            {datasets.map((dataset, index) => {
              const rawScore = model.scores[dataset.id];
              const displayScore = getProcessedScore(dataset, rawScore);
              return (
                <TableCell 
                  key={dataset.name} 
                  className={`text-center ${bgColor}/30 ${index < datasets.length - 1 ? 'border-r border-gray-300' : ''}`}
                >
                  <EditableTableCell
                    value={displayScore}
                    onSave={(newValue) => onUpdateScore?.(model.name, dataset.id, newValue)}
                    isEditable={isEditMode}
                    isGrayedOut={false}
                  />
                </TableCell>
            );
            })}
          </TableRow>
        ))}
          </TableBody>
        </Table>
  );

  return (
    <div className="border border-gray-300 rounded-md">
      {expanded ? (
        <div className="overflow-auto" style={{ WebkitOverflowScrolling: 'touch', scrollBehavior: 'smooth' }}>
          {tableContent}
        </div>
        ) : (
          <div className="h-72 overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" style={{ WebkitOverflowScrolling: 'touch', scrollBehavior: 'smooth' }}>
            {tableContent}
          </div>
        )}
      </div>
  );
};

export function ModelResultsTable() {
  // Separate filter states for each table
  const [textFilters, setTextFilters] = useState<FilterState>({
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

  const [visionFilters, setVisionFilters] = useState<FilterState>({
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

  const [safetyFilters, setSafetyFilters] = useState<FilterState>({
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
    key: 'average',
    direction: 'desc',
  });

  const [multimodalSortConfig, setMultimodalSortConfig] = useState<SortConfig>({
    key: 'average',
    direction: 'desc',
  });

  const [safetySortConfig, setSafetySortConfig] = useState<SortConfig>({
    key: 'average',
    direction: 'asc',
  });

  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);

  // Dataset details dialog state
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    dataset: null as Dataset | null
  });

  // View mode state for each table
  const [viewModes, setViewModes] = useState({
    textCapabilities: 'table' as 'table' | 'chart',
    multimodal: 'table' as 'table' | 'chart',
    safety: 'table' as 'table' | 'chart'
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

  // View mode handlers
  const toggleViewMode = (section: 'textCapabilities' | 'multimodal' | 'safety') => {
    setViewModes(prev => ({
      ...prev,
      [section]: prev[section] === 'table' ? 'chart' : 'table'
    }));
  };

  // Memoized filtered models for each table
  const textFilteredModels = useMemo(() => {
    return models.filter(model => {
      if (textFilters.search && !model.name.toLowerCase().includes(textFilters.search.toLowerCase())) return false;
      if (textFilters.showTextModels && model.isTextOnlyModel !== true) return false;
      if (textFilters.showOpenWeight && !model.modelWeights) return false;
      if (!textFilters.showOpenWeight && model.modelWeights) return false; // Filter out open-weight models by default
      if (textFilters.selectedProviders.length > 0 && !textFilters.selectedProviders.includes(model.provider)) return false;
      const modelSize = model.model_size || 'standard';
      if (!textFilters.modelSizes[modelSize]) return false;
      if (textFilters.showFlagship && model.flagship === false) return false;
      return true;
    });
  }, [textFilters, models]);

  const visionFilteredModels = useMemo(() => {
    return models.filter(model => {
      // Filter out text-only models from vision table
      if (model.isTextOnlyModel === true) return false;
      if (visionFilters.search && !model.name.toLowerCase().includes(visionFilters.search.toLowerCase())) return false;
      if (visionFilters.showOpenWeight && !model.modelWeights) return false;
      if (!visionFilters.showOpenWeight && model.modelWeights) return false; // Filter out open-weight models by default
      if (visionFilters.selectedProviders.length > 0 && !visionFilters.selectedProviders.includes(model.provider)) return false;
      const modelSize = model.model_size || 'standard';
      if (!visionFilters.modelSizes[modelSize]) return false;
      if (visionFilters.showFlagship && model.flagship === false) return false;
      return true;
    });
  }, [visionFilters, models]);

  const safetyFilteredModels = useMemo(() => {
    return models.filter(model => {
      if (safetyFilters.search && !model.name.toLowerCase().includes(safetyFilters.search.toLowerCase())) return false;
      if (safetyFilters.showTextModels && model.isTextOnlyModel !== true) return false;
      if (safetyFilters.showOpenWeight && !model.modelWeights) return false;
      if (!safetyFilters.showOpenWeight && model.modelWeights) return false; // Filter out open-weight models by default
      if (safetyFilters.selectedProviders.length > 0 && !safetyFilters.selectedProviders.includes(model.provider)) return false;
      const modelSize = model.model_size || 'standard';
      if (!safetyFilters.modelSizes[modelSize]) return false;
      if (safetyFilters.showFlagship && model.flagship === false) return false;
      return true;
    });
  }, [safetyFilters, models]);

  const sortModels = (models: Model[], datasets: Dataset[], sortConfig: SortConfig) => {
    if (!sortConfig.key || !sortConfig.direction) return models;

    // Helper to get processed score for sorting
    const getScore = (model: Model, dataset: Dataset): number => {
      const rawScore = model.scores[dataset.id];
      if (rawScore === null) return -Infinity;
      if (dataset.postprocessScore) {
        return dataset.postprocessScore(rawScore);
      }
      return rawScore;
    };

    return [...models].sort((a, b) => {
      if (sortConfig.key === 'average') {
        // Calculate averages for sorting using processed scores
        const avgA = datasets
          .map(d => {
            const rawScore = a.scores[d.id];
            if (rawScore === null) return null;
            return d.postprocessScore ? d.postprocessScore(rawScore) : rawScore;
          })
          .filter((score): score is number => score !== null)
          .reduce((sum, score, _, arr) => sum + score / arr.length, 0) || 0;
        
        const avgB = datasets
          .map(d => {
            const rawScore = b.scores[d.id];
            if (rawScore === null) return null;
            return d.postprocessScore ? d.postprocessScore(rawScore) : rawScore;
          })
          .filter((score): score is number => score !== null)
          .reduce((sum, score, _, arr) => sum + score / arr.length, 0) || 0;

        return sortConfig.direction === 'asc' ? avgA - avgB : avgB - avgA;
      } else {
        // Find the dataset for this sort key
        const dataset = datasets.find(d => d.id === sortConfig.key);
        if (!dataset) return 0;

        const scoreA = getScore(a, dataset);
        const scoreB = getScore(b, dataset);

        if (scoreA === -Infinity && scoreB === -Infinity) return 0;
        if (scoreA === -Infinity) return sortConfig.direction === 'asc' ? -1 : 1;
        if (scoreB === -Infinity) return sortConfig.direction === 'asc' ? 1 : -1;

        return sortConfig.direction === 'asc' ? scoreA - scoreB : scoreB - scoreA;
      }
    });
  };

  const handleTextCapabilitiesSort = (datasetId: string) => {
    // Ignore sorting for average column
    if (datasetId === 'average') return;
    
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
    // Ignore sorting for average column
    if (datasetId === 'average') return;
    
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
    // Ignore sorting for average column
    if (datasetId === 'average') return;
    
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

  const textCapabilitiesSortedModels = sortModels(textFilteredModels, TEXT_CAPABILITIES_DATASETS, textCapabilitiesSortConfig);
  const multimodalSortedModels = sortModels(visionFilteredModels, MULTIMODAL_DATASETS, multimodalSortConfig);
  const safetySortedModels = sortModels(safetyFilteredModels, SAFETY_DATASETS, safetySortConfig);

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
      
      {/* Text-based Capabilities Card */}
      <div id="text-section" className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-blue-50 px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center justify-between w-full sm:w-auto">
              <h3 className="text-lg sm:text-xl font-semibold text-blue-700 flex-shrink-0">Text</h3>
              <button
                onClick={() => toggleViewMode('textCapabilities')}
                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-blue-300 text-blue-700 rounded-md hover:bg-blue-50 transition-colors text-sm font-medium flex-shrink-0 sm:hidden"
              >
                {viewModes.textCapabilities === 'table' ? (
                  <>
                    <BarChart3 className="w-4 h-4" />
                    Bar Charts
                  </>
                ) : (
                  <>
                    <TableIcon className="w-4 h-4" />
                    Table View
                  </>
                )}
              </button>
            </div>
            {viewModes.textCapabilities === 'table' && (
              <div className="w-full sm:flex-1">
                <FilterBar 
                  filters={textFilters} 
                  onFiltersChange={setTextFilters}
                />
              </div>
            )}
            <button
              onClick={() => toggleViewMode('textCapabilities')}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white border border-blue-300 text-blue-700 rounded-md hover:bg-blue-50 transition-colors text-sm font-medium flex-shrink-0"
            >
              {viewModes.textCapabilities === 'table' ? (
                <>
                  <BarChart3 className="w-4 h-4" />
                  Bar Charts
                </>
              ) : (
                <>
                  <TableIcon className="w-4 h-4" />
                  Table View
                </>
              )}
            </button>
          </div>
        </div>
        {viewModes.textCapabilities === 'table' ? (
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
        ) : (
          <InlineBarChart
            datasets={TEXT_CAPABILITIES_DATASETS}
            models={textCapabilitiesSortedModels}
            onShowDetails={handleShowDetails}
          />
        )}
        {viewModes.textCapabilities === 'table' && (
          <>
            {!expandState.textCapabilities && (
              <div className="border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => {
                    setExpandState(prev => ({ ...prev, textCapabilities: true }));
                    // When expanding, show all model sizes
                    setTextFilters(prev => ({
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
                    setTextFilters(prev => ({
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
          </>
        )}
      </div>

      {/* Multimodal Capabilities Card */}
      <div id="vision-section" className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-green-50 px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center justify-between w-full sm:w-auto">
              <h3 className="text-lg sm:text-xl font-semibold text-green-700 flex-shrink-0">Vision</h3>
              <button
                onClick={() => toggleViewMode('multimodal')}
                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-green-300 text-green-700 rounded-md hover:bg-green-50 transition-colors text-sm font-medium flex-shrink-0 sm:hidden"
              >
                {viewModes.multimodal === 'table' ? (
                  <>
                    <BarChart3 className="w-4 h-4" />
                    Bar Charts
                  </>
                ) : (
                  <>
                    <TableIcon className="w-4 h-4" />
                    Table View
                  </>
                )}
              </button>
            </div>
            {viewModes.multimodal === 'table' && (
              <div className="w-full sm:flex-1">
                <FilterBar 
                  filters={visionFilters} 
                  onFiltersChange={setVisionFilters}
                />
              </div>
            )}
            <button
              onClick={() => toggleViewMode('multimodal')}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white border border-green-300 text-green-700 rounded-md hover:bg-green-50 transition-colors text-sm font-medium flex-shrink-0"
            >
              {viewModes.multimodal === 'table' ? (
                <>
                  <BarChart3 className="w-4 h-4" />
                  Bar Charts
                </>
              ) : (
                <>
                  <TableIcon className="w-4 h-4" />
                  Table View
                </>
              )}
            </button>
          </div>
        </div>
        {viewModes.multimodal === 'table' ? (
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
        ) : (
          <InlineBarChart
            datasets={MULTIMODAL_DATASETS}
            models={multimodalSortedModels}
            onShowDetails={handleShowDetails}
          />
        )}
        {viewModes.multimodal === 'table' && !expandState.multimodal && (
          <div className="border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => {
                setExpandState(prev => ({ ...prev, multimodal: true }));
                // When expanding, show all model sizes
                setVisionFilters(prev => ({
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
        {viewModes.multimodal === 'table' && expandState.multimodal && (
          <div className="border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => {
                setExpandState(prev => ({ ...prev, multimodal: false }));
                // When collapsing, show standard and mini models
                setVisionFilters(prev => ({
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
      <div id="safety-section" className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-red-50 px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center justify-between w-full sm:w-auto">
              <div className="flex-shrink-0">
                <h3 className="text-lg sm:text-xl font-semibold text-red-700">Safety</h3>
                <p className="text-sm text-foreground mt-1">Lower Score is Better</p>
              </div>
              <button
                onClick={() => toggleViewMode('safety')}
                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-red-300 text-red-700 rounded-md hover:bg-red-50 transition-colors text-sm font-medium flex-shrink-0 sm:hidden"
              >
                {viewModes.safety === 'table' ? (
                  <>
                    <BarChart3 className="w-4 h-4" />
                    Bar Charts
                  </>
                ) : (
                  <>
                    <TableIcon className="w-4 h-4" />
                    Table View
                  </>
                )}
              </button>
            </div>
            {viewModes.safety === 'table' && (
              <div className="w-full sm:flex-1">
                <FilterBar 
                  filters={safetyFilters} 
                  onFiltersChange={setSafetyFilters}
                />
              </div>
            )}
            <button
              onClick={() => toggleViewMode('safety')}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white border border-red-300 text-red-700 rounded-md hover:bg-red-50 transition-colors text-sm font-medium flex-shrink-0"
            >
              {viewModes.safety === 'table' ? (
                <>
                  <BarChart3 className="w-4 h-4" />
                  Bar Charts
                </>
              ) : (
                <>
                  <TableIcon className="w-4 h-4" />
                  Table View
                </>
              )}
            </button>
          </div>
        </div>
        {viewModes.safety === 'table' ? (
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
        ) : (
          <InlineBarChart
            datasets={SAFETY_DATASETS}
            models={safetySortedModels}
            onShowDetails={handleShowDetails}
          />
        )}
        {viewModes.safety === 'table' && !expandState.safety && (
          <div className="border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => {
                setExpandState(prev => ({ ...prev, safety: true }));
                // When expanding, show all model sizes
                setSafetyFilters(prev => ({
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
        {viewModes.safety === 'table' && expandState.safety && (
          <div className="border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => {
                setExpandState(prev => ({ ...prev, safety: false }));
                // When collapsing, show standard and mini models
                setSafetyFilters(prev => ({
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


      {/* Dataset Details Dialog */}
      <DatasetDetailsDialog
        isOpen={dialogState.isOpen}
        onClose={handleCloseDetails}
        dataset={dialogState.dataset}
      />
 
    </div>
  );
}