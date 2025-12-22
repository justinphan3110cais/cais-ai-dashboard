"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp, Save, ChartColumnBig, Table as TableIcon, HelpCircle, ExternalLink } from "lucide-react";
import hf_logo from "@/assets/hf-logo.png";
import textLogo from "@/assets/dataset-logos/text_logo_colored.svg";
import visionLogo from "@/assets/dataset-logos/vision_logo_colored.svg";
import safetyLogo from "@/assets/dataset-logos/safety_logo.svg";
import automationLogo from "@/assets/dataset-logos/automation_logo.svg";
import { MODELS, TEXT_CAPABILITIES_DATASETS, MULTIMODAL_DATASETS, SAFETY_DATASETS, getProviderLogo, BENCHMARK_TYPES, SHOW_PROVIDER_LIST } from "@/app/constants";
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
import { AGIRadarChart } from "@/components/AGIRadarChart";
import { TeslaFSDChart } from "@/components/TeslaFSDChart";
import { RemoteLaborIndex } from "@/components/RemoteLaborIndex";
import DatasetDetailsDialog from "@/components/DatasetDetailsDialog";
import { ModelDetailsTooltip } from "@/components/ModelDetailsTooltip";

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
  onShowDetails,
  onMobilePopup
}: { 
  dataset: Dataset; 
  onSort: (datasetId: string) => void;
  sortConfig: SortConfig;
  onShowDetails: (datasetId: string, datasetName: string) => void;
  onMobilePopup?: (type: 'dataset-info', content: { description: string; datasetId: string }) => boolean;
}) => {
  const getSortIcon = () => {
    if (sortConfig.key !== dataset.id) return null;
    if (sortConfig.direction === 'asc') return '↑';
    if (sortConfig.direction === 'desc') return '↓';
    return null; // No sort indicator when direction is null
  };

  // Check if we're on mobile (using window width as proxy since we can't access the parent's isMobile state)
  const [isMobileLocal, setIsMobileLocal] = React.useState(false);
  React.useEffect(() => {
    const checkMobile = () => setIsMobileLocal(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleClick = () => {
    if (isMobileLocal && onMobilePopup) {
      const firstPart = dataset.description.split('. ')[0];
      const hasMoreContent = dataset.description.length > firstPart.length;
      const firstSentence = firstPart + (hasMoreContent && !firstPart.endsWith('.') ? '.' : '');
      
      if (onMobilePopup('dataset-info', { 
        description: firstSentence, 
        datasetId: dataset.id 
      })) {
        return; // Mobile popup was shown, don't sort
      }
    }
    onSort(dataset.id);
  };

  if (isMobileLocal) {
    // Mobile: Simple button without tooltip
    return (
      <button
        onClick={handleClick}
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
                {dataset.name === "Humanity's Last Exam" ? "HLE" : (dataset.displayName || dataset.name)}
              </span>
            </div>
            {getSortIcon() && (
              <span className="absolute right-0 text-xs">{getSortIcon()}</span>
            )}
          </div>
        </div>
      </button>
    );
  }

  // Desktop: Button with tooltip
  return (
    <TooltipProvider>
      <Tooltip delayDuration={250}>
        <TooltipTrigger asChild>
          <button
            onClick={handleClick}
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
        <TooltipContent className="max-w-xs bg-background text-foreground border border-black shadow-lg p-3">
          {(() => {
            // Split by periods first, then by HTML line breaks
            let firstPart = dataset.description.split('. ')[0];
            firstPart = firstPart.split('<br>')[0];
            firstPart = firstPart.split('<br/>')[0];
            firstPart = firstPart.split('<BR>')[0];
            
            // Add period if it doesn't end with one and the original had more content
            const hasMoreContent = dataset.description.length > firstPart.length;
            const firstSentence = firstPart + (hasMoreContent && !firstPart.endsWith('.') ? '.' : '');
            
            return (
              <div className="text-sm leading-relaxed text-wrap" dangerouslySetInnerHTML={{ __html: firstSentence }} />
            );
          })()}
          {dataset.randomChance && (
            <div className="mt-2 text-sm text-muted-foreground">
              Random chance: {dataset.randomChance.toFixed(1)}%
            </div>
          )}
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



const DashboardTable = ({ 
  datasets, 
  models, 
  bgColor, 
  sortConfig, 
  onSort,
  expanded = false,
  isEditMode = false,
  onUpdateScore,
  onShowDetails,
  onMobilePopup,
  showAverageArrow = false
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
  onMobilePopup?: (type: 'dataset-info', content: { description: string; datasetId: string }) => boolean;
  showAverageArrow?: boolean;
}) => {
  // Helper function to get processed score (applies postprocessScore if it exists)
  const getProcessedScore = (dataset: Dataset, rawScore: number | null | undefined): number | null => {
    if (rawScore === null || rawScore === undefined) return null;
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
      <TableHeader className="sticky top-0 bg-background z-40">
            <TableRow>
          <TableHead 
            className={`w-[200px] border-r border-gray-300 border-b-2 border-b-gray-300 sticky left-0 ${bgColor}`}
            style={{ position: 'sticky', left: 0, top: 0, zIndex: 40 }}
          >
            <div className="font-semibold">Model</div>
          </TableHead>
          {/* Average column - show second (after Model) */}
          <TableHead className={`text-center ${bgColor} min-w-[80px] font-bold border-b-2 border-b-gray-300 border-r border-gray-300`}>
            <button
              onClick={() => onSort('average')}
              className="w-full text-center hover:text-blue-600 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-center gap-1 relative">
                <span className="text-xs font-bold">Average</span>
                {showAverageArrow && sortConfig.key === 'average' && (
                  <span className="text-xs">
                    {sortConfig.direction === 'asc' ? '↑' : sortConfig.direction === 'desc' ? '↓' : ''}
                  </span>
                )}
              </div>
            </button>
          </TableHead>
          {datasets.map((dataset, index) => (
            <TableHead 
              key={dataset.name} 
              className={`text-center ${bgColor} min-w-[100px] w-auto border-b-2 border-b-gray-300 ${index < datasets.length - 1 ? 'border-r border-gray-300' : ''} py-1`}
            >
              <DatasetHeader dataset={dataset} onSort={onSort} sortConfig={sortConfig} onShowDetails={onShowDetails} onMobilePopup={onMobilePopup} />
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
                className={`text-center border-r border-gray-300 sticky left-0 bg-white min-w-[180px]`}
                style={{ position: 'sticky', left: 0, zIndex: 30, backgroundColor: 'white' }}
              >              <div className="flex items-center gap-2 pr-2">
                <Image
                  src={getProviderLogo(model.provider).src}
                  alt={`${model.provider} logo`}
                  width={getProviderLogo(model.provider).width}
                  height={getProviderLogo(model.provider).height}
                  className="flex-shrink-0"
                />
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                      <span 
                        className={`text-sm font-medium ${model.modelCardUrl ? 'cursor-pointer group-hover:border-b group-hover:border-dashed group-hover:border-gray-600' : ''}`}
                        onClick={() => model.modelCardUrl && window.open(model.modelCardUrl, '_blank')}
                      >
                        {model.name}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="bg-transparent border-0 shadow-none p-0">
                      <ModelDetailsTooltip
                        modelData={{
                          name: model.name,
                          id: model.id,
                          provider: model.provider,
                          modelSize: model.model_size,
                          releaseDate: model.releaseDate,
                          avgScore: null,
                          categoriesData: []
                        }}
                        showDatasetScores={false}
                      />
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
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
    <div className="border border-gray-300">
      {expanded ? (
        <div className="overflow-auto scrollbar-hidden" style={{ WebkitOverflowScrolling: 'touch', scrollBehavior: 'smooth' }}>
          {tableContent}
        </div>
        ) : (
          <div className="overflow-auto scrollbar-hidden" style={{ WebkitOverflowScrolling: 'touch', scrollBehavior: 'smooth' }}>
            {tableContent}
          </div>
        )}
      </div>
  );
};

export function ModelResultsTable({ globalViewMode }: { globalViewMode?: 'table' | 'chart' | null }) {
  // Separate filter states for each table
  const [textFilters, setTextFilters] = useState<FilterState>({
    search: '',
    showTextModels: false,
    showOpenWeight: false,
    showFlagship: true,
    selectedProviders: [],
    modelSizes: {
      standard: true,
      mini: false,
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
      mini: false,
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
      mini: false,
      nano: false,
    },
  });

  const [expandState, setExpandState] = useState<ExpandState>({
    textCapabilities: false,
    multimodal: false,
    safety: false,
  });

  // Track if user has explicitly clicked on average column (to show/hide arrow)
  const [averageClickedState, setAverageClickedState] = useState({
    text: false,
    multimodal: false,
    safety: false
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

  // Auto-enable nano when searching in text table
  useEffect(() => {
    if (textFilters.search.trim() !== '') {
      setTextFilters(prev => ({
        ...prev,
        modelSizes: {
          ...prev.modelSizes,
          nano: true
        }
      }));
    }
  }, [textFilters.search]);

  // Auto-enable nano when searching in vision table
  useEffect(() => {
    if (visionFilters.search.trim() !== '') {
      setVisionFilters(prev => ({
        ...prev,
        modelSizes: {
          ...prev.modelSizes,
          nano: true
        }
      }));
    }
  }, [visionFilters.search]);

  // Auto-enable nano when searching in safety table
  useEffect(() => {
    if (safetyFilters.search.trim() !== '') {
      setSafetyFilters(prev => ({
        ...prev,
        modelSizes: {
          ...prev.modelSizes,
          nano: true
        }
      }));
    }
  }, [safetyFilters.search]);

  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);

  // Dataset details dialog state
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    dataset: null as Dataset | null
  });

  // Mobile popup state for help tooltips
  const [mobilePopup, setMobilePopup] = useState({
    isOpen: false,
    type: null as 'text-help' | 'safety-help' | 'dataset-info' | 'automation-help' | null,
    content: null as { description: string; datasetId: string } | null
  });

  // Mobile detection and mounted state (must be declared before viewModes)
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    setMounted(true);
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // View mode state for each table - Start as null until we detect mobile
  const [viewModes, setViewModes] = useState<{
    textCapabilities: 'table' | 'chart' | null;
    multimodal: 'table' | 'chart' | null;
    safety: 'table' | 'chart' | null;
  }>({
    textCapabilities: null,
    multimodal: null,
    safety: null
  });

  // Set initial view mode after mounting
  useEffect(() => {
    if (mounted) {
      setViewModes({
        textCapabilities: isMobile ? 'chart' : 'table',
        multimodal: isMobile ? 'chart' : 'table',
        safety: isMobile ? 'chart' : 'table'
      });
    }
  }, [mounted, isMobile]);
  
  const [models, setModels] = useState<Model[]>(MODELS);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Check if edit mode is enabled from environment variable
  useEffect(() => {
    // In Next.js client components, we need to access env vars this way
    const editModeEnabled = process.env.NEXT_PUBLIC_ENABLE_EDIT_MODE === 'true';
    setIsEditMode(editModeEnabled);
  }, []);

  // Sync global view mode with all sections
  useEffect(() => {
    if (globalViewMode && mounted) {
      setViewModes({
        textCapabilities: globalViewMode,
        multimodal: globalViewMode,
        safety: globalViewMode
      });
    }
  }, [globalViewMode, mounted]);

  // Handle mobile popup
  const handleMobilePopup = (type: 'text-help' | 'safety-help' | 'dataset-info' | 'automation-help', content?: { description: string; datasetId: string }) => {
    if (isMobile) {
      setMobilePopup({ isOpen: true, type, content: content || null });
      return true; // Indicate popup was shown
    }
    return false; // Indicate normal tooltip should work
  };

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

  // Memoized filtered models for each table
  const textFilteredModels = useMemo(() => {
    return models.filter(model => {
      if (textFilters.search && !model.name.toLowerCase().includes(textFilters.search.toLowerCase())) return false;
      if (textFilters.showTextModels && model.isTextOnlyModel !== true) return false;
      if (textFilters.showOpenWeight && !model.modelWeights) return false;
      if (!textFilters.showOpenWeight && model.modelWeights) return false; // Filter out open-weight models by default
      if (textFilters.selectedProviders.length > 0 && !textFilters.selectedProviders.includes(model.provider)) return false;
      
      // Featured models bypass model_size and flagship filters
      if (model.featured === true) return true;
      
      const modelSize = model.model_size || 'standard';
      if (!textFilters.modelSizes[modelSize]) return false;
      
      // When expanded, show flagship models OR the baseline model
      if (expandState.textCapabilities) {
        if (textFilters.showFlagship && model.flagship === false && model.id !== 'gpt-4o-2024-11-20') return false;
      } else {
        // When collapsed, show only flagship models from SHOW_PROVIDER_LIST
        if (textFilters.showFlagship && model.flagship === false) return false;
        if (!SHOW_PROVIDER_LIST.includes(model.provider)) return false;
      }
      
      return true;
    });
  }, [textFilters, models, expandState.textCapabilities]);

  const visionFilteredModels = useMemo(() => {
    return models.filter(model => {
      // Filter out text-only models from vision table
      if (model.isTextOnlyModel === true) return false;
      if (visionFilters.search && !model.name.toLowerCase().includes(visionFilters.search.toLowerCase())) return false;
      if (visionFilters.showOpenWeight && !model.modelWeights) return false;
      if (!visionFilters.showOpenWeight && model.modelWeights) return false; // Filter out open-weight models by default
      if (visionFilters.selectedProviders.length > 0 && !visionFilters.selectedProviders.includes(model.provider)) return false;
      
      // Featured models bypass model_size and flagship filters
      if (model.featured === true) return true;
      
      const modelSize = model.model_size || 'standard';
      if (!visionFilters.modelSizes[modelSize]) return false;
      
      // When expanded, show flagship models OR the baseline model
      if (expandState.multimodal) {
        if (visionFilters.showFlagship && model.flagship === false && model.id !== 'gpt-4o-2024-11-20') return false;
      } else {
        // When collapsed, show only flagship models from SHOW_PROVIDER_LIST
        if (visionFilters.showFlagship && model.flagship === false) return false;
        if (!SHOW_PROVIDER_LIST.includes(model.provider)) return false;
      }
      
      return true;
    });
  }, [visionFilters, models, expandState.multimodal]);

  const safetyFilteredModels = useMemo(() => {
    return models.filter(model => {
      if (safetyFilters.search && !model.name.toLowerCase().includes(safetyFilters.search.toLowerCase())) return false;
      if (safetyFilters.showTextModels && model.isTextOnlyModel !== true) return false;
      if (safetyFilters.showOpenWeight && !model.modelWeights) return false;
      if (!safetyFilters.showOpenWeight && model.modelWeights) return false; // Filter out open-weight models by default
      if (safetyFilters.selectedProviders.length > 0 && !safetyFilters.selectedProviders.includes(model.provider)) return false;
      
      // Featured models bypass model_size and flagship filters
      if (model.featured === true) return true;
      
      const modelSize = model.model_size || 'standard';
      if (!safetyFilters.modelSizes[modelSize]) return false;
      
      // When expanded, show flagship models OR the baseline model
      if (expandState.safety) {
        if (safetyFilters.showFlagship && model.flagship === false && model.id !== 'gpt-4o-2024-11-20') return false;
      } else {
        // When collapsed, show only flagship models from SHOW_PROVIDER_LIST
        if (safetyFilters.showFlagship && model.flagship === false) return false;
        if (!SHOW_PROVIDER_LIST.includes(model.provider)) return false;
      }
      
      return true;
    });
  }, [safetyFilters, models, expandState.safety]);

  const sortModels = (models: Model[], datasets: Dataset[], sortConfig: SortConfig) => {
    if (!sortConfig.key || !sortConfig.direction) return models;

    // Helper to get processed score for sorting
    const getScore = (model: Model, dataset: Dataset): number => {
      const rawScore = model.scores[dataset.id];
      if (rawScore === null || rawScore === undefined) return -Infinity;
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
            if (rawScore === null || rawScore === undefined) return null;
            return d.postprocessScore ? d.postprocessScore(rawScore) : rawScore;
          })
          .filter((score): score is number => score !== null)
          .reduce((sum, score, _, arr) => sum + score / arr.length, 0) || 0;
        
        const avgB = datasets
          .map(d => {
            const rawScore = b.scores[d.id];
            if (rawScore === null || rawScore === undefined) return null;
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
    setTextCapabilitiesSortConfig(prev => {
      if (datasetId === 'average') {
        // Check if user has clicked before (averageClickedState.text)
        if (!averageClickedState.text) {
          // First click: show arrow and sort ascending (opposite of default desc)
          setAverageClickedState(p => ({ ...p, text: true }));
          return { key: 'average', direction: 'asc' };
        } else {
          // Second click: hide arrow and back to default (desc)
          setAverageClickedState(p => ({ ...p, text: false }));
          return { key: 'average', direction: 'desc' };
        }
      } else if (prev.key !== datasetId) {
        // First click on new column: desc
        return { key: datasetId, direction: 'desc' };
      } else if (prev.direction === 'desc') {
        // For other columns: second click asc
        return { key: datasetId, direction: 'asc' };
      } else if (prev.direction === 'asc') {
        // For other columns: third click no sort
        return { key: null, direction: null };
      } else {
        // Back to desc (shouldn't happen but fallback)
        return { key: datasetId, direction: 'desc' };
      }
    });
  };

  const handleMultimodalSort = (datasetId: string) => {
    setMultimodalSortConfig(prev => {
      if (datasetId === 'average') {
        // Check if user has clicked before (averageClickedState.multimodal)
        if (!averageClickedState.multimodal) {
          // First click: show arrow and sort ascending (opposite of default desc)
          setAverageClickedState(p => ({ ...p, multimodal: true }));
          return { key: 'average', direction: 'asc' };
        } else {
          // Second click: hide arrow and back to default (desc)
          setAverageClickedState(p => ({ ...p, multimodal: false }));
          return { key: 'average', direction: 'desc' };
        }
      } else if (prev.key !== datasetId) {
        // First click on new column: desc
        return { key: datasetId, direction: 'desc' };
      } else if (prev.direction === 'desc') {
        // For other columns: second click asc
        return { key: datasetId, direction: 'asc' };
      } else if (prev.direction === 'asc') {
        // For other columns: third click no sort
        return { key: null, direction: null };
      } else {
        // Back to desc (shouldn't happen but fallback)
        return { key: datasetId, direction: 'desc' };
      }
    });
  };

  const handleSafetySort = (datasetId: string) => {
    setSafetySortConfig(prev => {
      if (datasetId === 'average') {
        // Check if user has clicked before (averageClickedState.safety)
        if (!averageClickedState.safety) {
          // First click: show arrow and sort descending (opposite of default asc)
          setAverageClickedState(p => ({ ...p, safety: true }));
          return { key: 'average', direction: 'desc' };
        } else {
          // Second click: hide arrow and back to default (asc)
          setAverageClickedState(p => ({ ...p, safety: false }));
          return { key: 'average', direction: 'asc' };
        }
      } else if (prev.key !== datasetId) {
        // First click on new column: desc
        return { key: datasetId, direction: 'desc' };
      } else if (prev.direction === 'desc') {
        // For other columns: second click asc
        return { key: datasetId, direction: 'asc' };
      } else if (prev.direction === 'asc') {
        // For other columns: third click no sort
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
              <div className="flex items-center gap-2">
                <Image
                  src={textLogo}
                  alt="Text icon"
                  width={32}
                  height={32}
                  className="flex-shrink-0"
                />
                <h3 className="text-lg sm:text-xl font-semibold text-blue-700 flex-shrink-0">Text Capabilities Index</h3>
              </div>
            <div className="flex items-center gap-1 bg-white border border-blue-300 rounded-md p-0.5 sm:hidden">
              <button
                onClick={() => setViewModes(prev => ({ ...prev, textCapabilities: 'table' }))}
                className={`p-2 rounded ${viewModes.textCapabilities === 'table' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-blue-700'} transition-colors`}
              >
                <TableIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewModes(prev => ({ ...prev, textCapabilities: 'chart' }))}
                className={`p-2 rounded ${viewModes.textCapabilities === 'chart' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-blue-700'} transition-colors`}
              >
                <ChartColumnBig className="w-4 h-4" />
              </button>
            </div>
            </div>
            {viewModes.textCapabilities === 'table' && (
              <div className="w-full sm:flex-1">
                <FilterBar 
                  filters={textFilters} 
                  onFiltersChange={setTextFilters}
                />
              </div>
            )}
            <div className="hidden sm:flex items-center gap-1 bg-white border border-blue-300 rounded-md p-0.5">
              <button
                onClick={() => setViewModes(prev => ({ ...prev, textCapabilities: 'table' }))}
                className={`p-2 rounded ${viewModes.textCapabilities === 'table' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-blue-700'} transition-colors`}
              >
                <TableIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewModes(prev => ({ ...prev, textCapabilities: 'chart' }))}
                className={`p-2 rounded ${viewModes.textCapabilities === 'chart' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-blue-700'} transition-colors`}
              >
                <ChartColumnBig className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        {viewModes.textCapabilities === null ? (
          <div className="h-96 flex items-center justify-center">
            <div className="text-gray-400">Loading...</div>
          </div>
        ) : viewModes.textCapabilities === 'table' ? (
          <DashboardTable
            datasets={TEXT_CAPABILITIES_DATASETS}
            models={textCapabilitiesSortedModels}
            bgColor="bg-blue-50"
            sortConfig={textCapabilitiesSortConfig}
            onSort={handleTextCapabilitiesSort}
            expanded={expandState.textCapabilities}
            isEditMode={isEditMode}
            onUpdateScore={updateModelScore}
            onShowDetails={handleShowDetails}
            onMobilePopup={handleMobilePopup}
            showAverageArrow={averageClickedState.text}
          />
        ) : (
          <InlineBarChart
            datasets={TEXT_CAPABILITIES_DATASETS}
            models={models}
            sectionType="text"
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
                    // When collapsing, show standard models only
                    setTextFilters(prev => ({
                      ...prev,
                      modelSizes: {
                        standard: true,
                        mini: false,
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
              <div className="flex items-center gap-2">
                <Image
                  src={visionLogo}
                  alt="Vision icon"
                  width={32}
                  height={32}
                  className="flex-shrink-0"
                />
                <h3 className="text-lg sm:text-xl font-semibold text-green-700 flex-shrink-0">Vision Capabilities Index</h3>
              </div>
              <div className="flex items-center gap-1 bg-white border border-green-300 rounded-md p-0.5 sm:hidden">
                <button
                  onClick={() => setViewModes(prev => ({ ...prev, multimodal: 'table' }))}
                  className={`p-2 rounded ${viewModes.multimodal === 'table' ? 'bg-green-100 text-green-700' : 'text-gray-500 hover:text-green-700'} transition-colors`}
                >
                  <TableIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewModes(prev => ({ ...prev, multimodal: 'chart' }))}
                  className={`p-2 rounded ${viewModes.multimodal === 'chart' ? 'bg-green-100 text-green-700' : 'text-gray-500 hover:text-green-700'} transition-colors`}
                >
                  <ChartColumnBig className="w-4 h-4" />
                </button>
              </div>
            </div>
            {viewModes.multimodal === 'table' && (
              <div className="w-full sm:flex-1">
                <FilterBar 
                  filters={visionFilters} 
                  onFiltersChange={setVisionFilters}
                />
              </div>
            )}
            <div className="hidden sm:flex items-center gap-1 bg-white border border-green-300 rounded-md p-0.5">
              <button
                onClick={() => setViewModes(prev => ({ ...prev, multimodal: 'table' }))}
                className={`p-2 rounded ${viewModes.multimodal === 'table' ? 'bg-green-100 text-green-700' : 'text-gray-500 hover:text-green-700'} transition-colors`}
              >
                <TableIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewModes(prev => ({ ...prev, multimodal: 'chart' }))}
                className={`p-2 rounded ${viewModes.multimodal === 'chart' ? 'bg-green-100 text-green-700' : 'text-gray-500 hover:text-green-700'} transition-colors`}
              >
                <ChartColumnBig className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        {viewModes.multimodal === null ? (
          <div className="h-96 flex items-center justify-center">
            <div className="text-gray-400">Loading...</div>
          </div>
        ) : viewModes.multimodal === 'table' ? (
          <DashboardTable
            datasets={MULTIMODAL_DATASETS}
            models={multimodalSortedModels}
            bgColor="bg-green-50"
            sortConfig={multimodalSortConfig}
            onSort={handleMultimodalSort}
            expanded={expandState.multimodal}
            isEditMode={isEditMode}
            onUpdateScore={updateModelScore}
            onShowDetails={handleShowDetails}
            onMobilePopup={handleMobilePopup}
            showAverageArrow={averageClickedState.multimodal}
          />
        ) : (
          <InlineBarChart
            datasets={MULTIMODAL_DATASETS}
            models={models}
            sectionType="vision"
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
                // When collapsing, show standard models only
                setVisionFilters(prev => ({
                  ...prev,
                  modelSizes: {
                    standard: true,
                    mini: false,
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
        <div className="bg-purple-50 px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center justify-between w-full sm:w-auto">
              <div className="flex-shrink-0">
                <div className="flex items-center gap-2">
                  <Image
                    src={safetyLogo}
                    alt="Safety icon"
                    width={32}
                    height={32}
                    className="flex-shrink-0"
                  />
                  <h3 className="text-lg sm:text-xl font-semibold text-purple-700">Risk Index</h3>
{!isMobile ? (
                    <TooltipProvider delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button 
                            className="flex items-center justify-center p-1 bg-transparent border-none cursor-help"
                          >
                            <HelpCircle className="w-4 h-4 text-purple-600" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent 
                          className="max-w-xs bg-background text-foreground border border-black shadow-lg p-3 z-50"
                          side="bottom"
                          align="center"
                        >
                          <div className="text-sm leading-relaxed text-wrap">
                            Safety benchmarks include benchmarks that have low correlation with general capabilities or training compute. Please read more <a 
                              href="https://arxiv.org/abs/2407.21792" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-foreground hover:text-foreground border-b border-dashed border-black font-medium"
                            >
                              <span className="inline-flex items-center gap-1">here <ExternalLink className="w-3 h-3" /></span>
                            </a>.
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <button 
                      className="flex items-center justify-center p-1 bg-transparent border-none cursor-help"
                      onClick={() => handleMobilePopup('safety-help')}
                    >
                      <HelpCircle className="w-4 h-4 text-purple-600" />
                    </button>
                  )}
                </div>
                <p className="text-sm text-foreground mt-1">Lower is Better</p>
              </div>
              <div className="flex items-center gap-1 bg-white border border-purple-300 rounded-md p-0.5 sm:hidden">
                <button
                  onClick={() => setViewModes(prev => ({ ...prev, safety: 'table' }))}
                  className={`p-2 rounded ${viewModes.safety === 'table' ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:text-purple-700'} transition-colors`}
                >
                  <TableIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewModes(prev => ({ ...prev, safety: 'chart' }))}
                  className={`p-2 rounded ${viewModes.safety === 'chart' ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:text-purple-700'} transition-colors`}
                >
                  <ChartColumnBig className="w-4 h-4" />
                </button>
              </div>
            </div>
            {viewModes.safety === 'table' && (
              <div className="w-full sm:flex-1">
                <FilterBar 
                  filters={safetyFilters} 
                  onFiltersChange={setSafetyFilters}
                />
              </div>
            )}
            <div className="hidden sm:flex items-center gap-1 bg-white border border-purple-300 rounded-md p-0.5">
              <button
                onClick={() => setViewModes(prev => ({ ...prev, safety: 'table' }))}
                className={`p-2 rounded ${viewModes.safety === 'table' ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:text-purple-700'} transition-colors`}
              >
                <TableIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewModes(prev => ({ ...prev, safety: 'chart' }))}
                className={`p-2 rounded ${viewModes.safety === 'chart' ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:text-purple-700'} transition-colors`}
              >
                <ChartColumnBig className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        {viewModes.safety === null ? (
          <div className="h-96 flex items-center justify-center">
            <div className="text-gray-400">Loading...</div>
          </div>
        ) : viewModes.safety === 'table' ? (
          <DashboardTable
            datasets={SAFETY_DATASETS}
            models={safetySortedModels}
            bgColor="bg-purple-50"
            sortConfig={safetySortConfig}
            onSort={handleSafetySort}
            expanded={expandState.safety}
            isEditMode={isEditMode}
            onUpdateScore={updateModelScore}
            onShowDetails={handleShowDetails}
            onMobilePopup={handleMobilePopup}
            showAverageArrow={averageClickedState.safety}
          />
        ) : (
          <InlineBarChart
            datasets={SAFETY_DATASETS}
            models={models}
            sectionType="safety"
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
                // When collapsing, show standard models only
                setSafetyFilters(prev => ({
                  ...prev,
                  modelSizes: {
                    standard: true,
                    mini: false,
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

      {/* Automation Section */}
      <div id="automation-section" className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-red-50 px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Image
              src={automationLogo}
              alt="Automation icon"
              width={32}
              height={32}
              className="flex-shrink-0"
            />
            <h3 className="text-lg sm:text-xl font-semibold text-red-700">Automation</h3>
            {!isMobile ? (
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      className="flex items-center justify-center p-1 bg-transparent border-none cursor-help"
                    >
                      <HelpCircle className="w-4 h-4 text-red-600" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent 
                    className="max-w-sm bg-background text-foreground border border-black shadow-lg p-3 z-50"
                    side="bottom"
                    align="center"
                  >
                    <div className="text-sm leading-relaxed text-wrap">
                      <span className="font-semibold">Artificial General Intelligence (AGI):</span> AI that matches or exceeds the cognitive versatility and proficiency of a well-educated human.
                      <br /><br />
                      <span className="font-semibold">Full Self-Driving (FSD):</span> AI that masters many human-level motor skills and physical interaction with the environment.
                      <br /><br />
                      <span className="font-semibold">Remote Labor Index (RLI):</span> A benchmark measuring the automation rate of various remote labor tasks. Unlike AGI, which measures human-level AI, RLI measures economy-level AI.
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <button 
                className="flex items-center justify-center p-1 bg-transparent border-none cursor-help"
                onClick={() => handleMobilePopup('automation-help')}
              >
                <HelpCircle className="w-4 h-4 text-red-600" />
              </button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* First Column - AGI Radar Chart */}
          <div className="flex flex-col">
            <AGIRadarChart />
          </div>
          
          {/* Second Column - Tesla FSD Chart */}
          <div className="flex flex-col">
            <TeslaFSDChart />
          </div>
          
          {/* Full Width Row - Remote Labor Index */}
          <div className="md:col-span-2">
            <RemoteLaborIndex />
          </div>
        </div>
      </div>


      {/* Dataset Details Dialog */}
      <DatasetDetailsDialog
        isOpen={dialogState.isOpen}
        onClose={handleCloseDetails}
        dataset={dialogState.dataset}
      />

      {/* Mobile Popup */}
      {mobilePopup.isOpen && (
        <>
          {/* Invisible backdrop to close popup */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setMobilePopup({ isOpen: false, type: null, content: null })}
          />
          
          {/* Popup content - styled like existing tooltips */}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 max-w-xs w-[90vw]">
            <div className="bg-background text-foreground border border-black shadow-lg rounded-md p-3">
              <div className="text-sm leading-relaxed text-wrap">
                {mobilePopup.type === 'automation-help' && (
                  <div className="text-wrap">
                    <span className="font-semibold">Artificial General Intelligence (AGI):</span> AI that matches or exceeds the cognitive versatility and proficiency of a well-educated human.
                    <br /><br />
                    <span className="font-semibold">Full Self-Driving (FSD):</span> AI that masters many human-level motor skills and physical interaction with the environment.
                    <br /><br />
                    <span className="font-semibold">Remote Labor Index (RLI):</span> A benchmark measuring the automation rate of various remote labor tasks. Unlike AGI, which measures human-level AI, RLI measures economy-level AI.
                  </div>
                )}
                
                {mobilePopup.type === 'safety-help' && (
                  <div>
                    Safety benchmarks include benchmarks that have low correlation with general capabilities or training compute. Please read more <a 
                      href="https://arxiv.org/abs/2407.21792" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-foreground hover:text-foreground border-b border-dashed border-black font-medium"
                      onClick={() => setMobilePopup({ isOpen: false, type: null, content: null })}
                    >
                      <span className="inline-flex items-center gap-1">here <ExternalLink className="w-3 h-3" /></span>
                    </a>.
                  </div>
                )}
                
                {mobilePopup.type === 'dataset-info' && mobilePopup.content && (
                  <>
                    <div dangerouslySetInnerHTML={{ __html: mobilePopup.content.description }} />
                    <button
                      onClick={() => {
                        if (mobilePopup.content) {
                          handleShowDetails(mobilePopup.content.datasetId);
                        }
                        setMobilePopup({ isOpen: false, type: null, content: null });
                      }}
                      className="mt-3 px-3 py-1 bg-background text-foreground border border-foreground text-xs rounded hover:bg-foreground hover:text-background transition-colors"
                    >
                      Examples and Details
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
 
    </div>
  );
}