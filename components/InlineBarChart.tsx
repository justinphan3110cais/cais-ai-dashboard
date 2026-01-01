"use client";

import React, { useState, useMemo, useCallback, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, LabelList } from 'recharts';
import Image, { StaticImageData } from "next/image";
import { Dataset, Model } from "@/lib/types";
import { getProviderLogo, PROVIDER_COLORS, PROVIDER_COLOR_SHADES, BENCHMARK_TYPES, SHOW_PROVIDER_LIST } from "@/app/constants";
import { ChartFilterBar } from "@/components/ui/ChartFilterBar";
import { TimelineChart } from "@/components/TimelineChart";
import { ModelDetailsTooltip } from "@/components/ModelDetailsTooltip";
import { DatasetTooltip } from "@/components/DatasetTooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import DatasetDetailsDialog from "@/components/DatasetDetailsDialog";
import textLogoBordered from "@/assets/dataset-logos/text_logo_bordered.svg";
import visionLogoBordered from "@/assets/dataset-logos/vision_logo_bordered.svg";
import safetyLogoBordered from "@/assets/dataset-logos/safety_logo.svg";

// Helper function to lighten color while preserving/enhancing saturation (HSL approach)
const lightenColor = (hex: string, lightnessAmount: number) => {
  // Remove # if present
  hex = hex.replace('#', '');

  // Parse hex values
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  // Find greatest and smallest channel values
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  // Increase lightness
  l = Math.min(0.92, l + lightnessAmount);
  
  // Boost saturation to keep it vibrant (prevent looking like just adding white)
  s = Math.min(1, s + 0.3); 

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const r2 = Math.round(hue2rgb(p, q, h + 1/3) * 255);
  const g2 = Math.round(hue2rgb(p, q, h) * 255);
  const b2 = Math.round(hue2rgb(p, q, h - 1/3) * 255);

  const toHex = (x: number) => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r2)}${toHex(g2)}${toHex(b2)}`;
};

interface InlineBarChartProps {
  datasets: Dataset[];
  models: Model[];
  sectionType?: 'text' | 'vision' | 'safety';
}

export const InlineBarChart: React.FC<InlineBarChartProps> = ({
  datasets,
  models,
  sectionType = 'text'
}) => {
  const [includedDatasets, setIncludedDatasets] = useState<Record<string, boolean>>(
    datasets.reduce((acc, dataset) => ({ ...acc, [dataset.id]: false }), {})
  );

  // Tooltip/Dialog states for bar chart
  const [hoveredBarModel, setHoveredBarModel] = useState<string | null>(null);
  const [barTooltipPosition, setBarTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [barDialogOpen, setBarDialogOpen] = useState(false);
  const [selectedBarModelName, setSelectedBarModelName] = useState<string | null>(null);
  const [isHoveringBarTooltip, setIsHoveringBarTooltip] = useState(false);
  const closeBarTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Dataset details dialog state
  const [datasetDialogOpen, setDatasetDialogOpen] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  
  // Dataset title tooltip state
  const [hoveredTitleDatasets, setHoveredTitleDatasets] = useState<Dataset[]>([]);
  const [titleTooltipPosition, setTitleTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const [isHoveringTitleTooltip, setIsHoveringTitleTooltip] = useState(false);
  const closeTitleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Dataset title mobile dialog state
  const [titleDialogOpen, setTitleDialogOpen] = useState(false);
  const [selectedTitleDatasets, setSelectedTitleDatasets] = useState<Dataset[]>([]);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
      if (closeBarTimeoutRef.current) {
        clearTimeout(closeBarTimeoutRef.current);
      }
      if (closeTitleTimeoutRef.current) {
        clearTimeout(closeTitleTimeoutRef.current);
      }
    };
  }, []);

  // Handler to open dataset details dialog
  const handleDatasetClick = useCallback((datasetName: string) => {
    const dataset = datasets.find(d => d.name === datasetName);
    if (dataset) {
      setSelectedDataset(dataset);
      setDatasetDialogOpen(true);
    }
  }, [datasets]);

  // Helper functions to handle bar tooltip hover with delay
  const handleMouseEnterBar = useCallback((modelName: string, event: React.MouseEvent) => {
    if (isMobile) return;
    
    // Clear any pending close timeout
    if (closeBarTimeoutRef.current) {
      clearTimeout(closeBarTimeoutRef.current);
      closeBarTimeoutRef.current = null;
    }
    
    setHoveredBarModel(modelName);
    setBarTooltipPosition({ 
      x: event.clientX, 
      y: event.clientY - 10
    });
  }, [isMobile]);

  const handleMouseLeaveBar = useCallback(() => {
    if (isMobile) return;
    
    // Delay closing to allow moving to tooltip
    closeBarTimeoutRef.current = setTimeout(() => {
      if (!isHoveringBarTooltip) {
        setHoveredBarModel(null);
        setBarTooltipPosition(null);
      }
    }, 150);
  }, [isMobile, isHoveringBarTooltip]);

  const handleMouseEnterBarTooltip = useCallback(() => {
    // Clear any pending close timeout
    if (closeBarTimeoutRef.current) {
      clearTimeout(closeBarTimeoutRef.current);
      closeBarTimeoutRef.current = null;
    }
    setIsHoveringBarTooltip(true);
  }, []);

  const handleMouseLeaveBarTooltip = useCallback(() => {
    setIsHoveringBarTooltip(false);
    setHoveredBarModel(null);
    setBarTooltipPosition(null);
  }, []);

  const handleBarClick = useCallback((modelName: string) => {
    if (isMobile) {
      setSelectedBarModelName(modelName);
      setBarDialogOpen(true);
    }
  }, [isMobile]);

  // Helper functions to handle dataset title tooltip hover with delay
  const handleMouseEnterTitle = useCallback((datasets: Dataset[], categoryName: string, event: React.MouseEvent) => {
    if (isMobile) return;
    
    // Clear any pending close timeout
    if (closeTitleTimeoutRef.current) {
      clearTimeout(closeTitleTimeoutRef.current);
      closeTitleTimeoutRef.current = null;
    }
    
    setHoveredTitleDatasets(datasets);
    setTitleTooltipPosition({ 
      x: event.clientX, 
      y: event.clientY + 10
    });
  }, [isMobile]);

  const handleMouseLeaveTitle = useCallback(() => {
    if (isMobile) return;
    
    // Delay closing to allow moving to tooltip
    closeTitleTimeoutRef.current = setTimeout(() => {
      if (!isHoveringTitleTooltip) {
        setHoveredTitleDatasets([]);
        setTitleTooltipPosition(null);
      }
    }, 150);
  }, [isMobile, isHoveringTitleTooltip]);

  const handleMouseEnterTitleTooltip = useCallback(() => {
    // Clear any pending close timeout
    if (closeTitleTimeoutRef.current) {
      clearTimeout(closeTitleTimeoutRef.current);
      closeTitleTimeoutRef.current = null;
    }
    setIsHoveringTitleTooltip(true);
  }, []);

  const handleMouseLeaveTitleTooltip = useCallback(() => {
    setIsHoveringTitleTooltip(false);
    setHoveredTitleDatasets([]);
    setTitleTooltipPosition(null);
  }, []);

  const handleTitleClick = useCallback((datasets: Dataset[]) => {
    if (isMobile && datasets.length > 0) {
      // Open dialog showing all datasets (like model tooltip in timeplot)
      setSelectedTitleDatasets(datasets);
      setTitleDialogOpen(true);
    }
  }, [isMobile]);

  // Group datasets by category for button display
  const categoryGroups = useMemo(() => {
    const groups: Record<string, { datasets: Dataset[], logo: string | StaticImageData | undefined, category: string, order: number, mobileOrder: number }> = {};
    
    // Define custom order for text section categories (buttons)
    const textCategoryOrder: Record<string, number> = {
      'expert': 0,           // Expert-Level Reasoning
      'coding': 1,           // Coding
      'fluid_reasoning': 2,  // Abstract Reasoning (ARC-AGI)
      'games': 3             // Text-Based Video Games
    };

    // Define custom mobile order for safety section (overconfidence moves to index 1)
    const safetyMobileOrder: Record<string, number> = {
      'adversarial_robustness': 0,  // Jailbreaks
      'overconfident': 1,            // Overconfidence - moved up for mobile
      'bioweapons_compliance': 2,    // Bioweapons Assistance
      'dishonesty': 3,               // Deception
      'harmful_propensity': 4        // Harmful Propensities
    };
    
    datasets.forEach(dataset => {
      if (dataset.capabilities && dataset.capabilities.length > 0) {
        let categoryId = dataset.capabilities[0]; // Use first capability as key
        
        // Merge deception_propensity into dishonesty (both show as "Deception")
        if (categoryId === 'deception_propensity') {
          categoryId = 'dishonesty';
        }
        
        const categoryName = BENCHMARK_TYPES[categoryId]?.name || BENCHMARK_TYPES['deception_propensity']?.name || '';
        
        if (!groups[categoryId]) {
          groups[categoryId] = {
            datasets: [],
            logo: dataset.logo,
            category: categoryName,
            order: sectionType === 'text' ? (textCategoryOrder[categoryId] ?? 999) : 999,
            mobileOrder: sectionType === 'safety' ? (safetyMobileOrder[categoryId] ?? 999) : 999
          };
        }
        groups[categoryId].datasets.push(dataset);
        
        // Use specific logos for certain categories
        if (categoryId === 'coding' && dataset.id === 'terminal_bench') {
          groups[categoryId].logo = dataset.logo; // Use terminalbench logo for coding
        }
        if (categoryId === 'dishonesty' && dataset.id === 'masks') {
          groups[categoryId].logo = dataset.logo; // Use MASK logo (includes both dishonesty and deception_propensity)
        }
      }
    });
    
    return groups;
  }, [datasets, sectionType]);

  // Get section colors
  const getSectionColors = () => {
    switch (sectionType) {
      case 'vision':
        return { bg: 'bg-green-50', border: 'border-green-300', borderSelected: 'border-green-500' };
      case 'safety':
        return { bg: 'bg-purple-50', border: 'border-purple-300', borderSelected: 'border-purple-500' };
      default:
        return { bg: 'bg-blue-50', border: 'border-blue-300', borderSelected: 'border-blue-500' };
    }
  };
  const colors = getSectionColors();

  // Get initial selected models based on section type
  const getInitialSelectedModels = () => {
    // Select all standard flagship models from the results
    // Match table filtering: flagship, standard, and provider in SHOW_PROVIDER_LIST
    // Also include featured models and GPT-4o as baseline
    const selectedModels = models
      .filter(model => {
        // For vision section, filter out text-only models
        if (sectionType === 'vision' && model.isTextOnlyModel) return false;
        
        // Featured models are always included
        if (model.featured === true) return true;
        
        // Standard flagship models from SHOW_PROVIDER_LIST
        return (
          model.model_size === 'standard' && 
          model.flagship !== false &&
          SHOW_PROVIDER_LIST.includes(model.provider)
        );
      })
      .map(model => model.name);
    
    // Add GPT-4o as baseline if it exists and not already included
    const gpt4o = models.find(m => m.name === 'GPT-4o');
    if (gpt4o && !selectedModels.includes('GPT-4o')) {
      // For vision section, only add if it's not text-only
      if (sectionType !== 'vision' || !gpt4o.isTextOnlyModel) {
        selectedModels.push('GPT-4o');
      }
    }
    
    return selectedModels;
  };

  // Chart filters
  const [chartFilters, setChartFilters] = useState({
    selectedProviders: [] as string[],
    selectedModels: getInitialSelectedModels()
  });

  // Toggle dataset inclusion - multi-select: clicking a category toggles it
  const toggleDatasetInclusion = (datasetIdOrCategoryId: string) => {
    // Check if this is a category group
    const categoryGroup = categoryGroups[datasetIdOrCategoryId];
    
    if (categoryGroup) {
      // Toggle all datasets in this category
      const allEnabled = categoryGroup.datasets.every(d => includedDatasets[d.id]);
      setIncludedDatasets(prev => {
        const newState = { ...prev };
        categoryGroup.datasets.forEach(d => {
          newState[d.id] = !allEnabled;
        });
        return newState;
      });
    } else {
      // Fallback: single dataset toggle (shouldn't reach here with current implementation)
      setIncludedDatasets(prev => ({
        ...prev,
        [datasetIdOrCategoryId]: !prev[datasetIdOrCategoryId]
      }));
    }
  };

  // Get available models based on section type (for dropdown)
  // Also filter out models with null scores for ALL included datasets
  const availableModels = useMemo(() => {
    let filteredModels = models;
    
    // For vision section, exclude text-only models
    if (sectionType === 'vision') {
      filteredModels = models.filter(model => !model.isTextOnlyModel);
    }
    
    // Get datasets to check - if none selected OR all selected, check all datasets
    const includedDatasetsIds = Object.keys(includedDatasets).filter(id => includedDatasets[id]);
    const allDatasetsIds = datasets.map(d => d.id);
    const isNoneSelected = includedDatasetsIds.length === 0;
    const isAllSelected = includedDatasetsIds.length === allDatasetsIds.length && 
                         allDatasetsIds.every(id => includedDatasetsIds.includes(id));
    const datasetsToCheck = (isNoneSelected || isAllSelected) ? allDatasetsIds : includedDatasetsIds;
    
    // Filter out models that have null scores for ANY dataset in the selected set
    return filteredModels.filter(model => {
      // Check if model has non-null scores for all datasets to check
      for (const datasetId of datasetsToCheck) {
        const score = model.scores[datasetId];
        if (score === null || score === undefined) {
          return false; // Exclude this model
        }
      }
      return true; // Include this model
    });
  }, [models, sectionType, datasets, includedDatasets]);

  // Filter models based on selected models from chart filters
  const filteredModels = useMemo(() => {
    return availableModels.filter(model => chartFilters.selectedModels.includes(model.name));
  }, [availableModels, chartFilters]);


  // Prepare data: For each dataset, create chart data with model names on X-axis
  const chartsData = useMemo(() => {
    // Define custom order for text section individual charts
    const textDatasetOrder: Record<string, number> = {
      'hle': 0,
      'arc_agi_2': 1,
      'textquests': 2,
      'swebench_verified': 3,
      'terminal_bench': 4
    };
    
    return datasets
      .map(dataset => {
        const modelScores = filteredModels.map(model => {
          let score = model.scores[dataset.id];
          // Apply postprocessScore if it exists
          if (score !== null && score !== undefined && dataset.postprocessScore) {
            score = dataset.postprocessScore(score);
          }
          return {
            modelName: model.name,
            score: score !== null && score !== undefined 
              ? Number(score.toFixed(1)) 
              : null,
            provider: model.provider
          };
        })
        .filter(item => item.score !== null)
        .sort((a, b) => {
          // For safety datasets, sort ascending (lower is better)
          // For other datasets, sort descending (higher is better)
          if (dataset.category === 'safety') {
            return (a.score || 0) - (b.score || 0); // Ascending
          } else {
            return (b.score || 0) - (a.score || 0); // Descending
          }
        });
        
        return {
          datasetName: dataset.name,
          datasetId: dataset.id,
          dataset: dataset,
          data: modelScores,
          order: sectionType === 'text' ? (textDatasetOrder[dataset.id] ?? 999) : 999
        };
      })
      .sort((a, b) => a.order - b.order); // Sort by custom order
  }, [datasets, filteredModels, sectionType]);

  // Calculate average scores for each model
  const averageData = useMemo(() => {
    const includedDatasetsIds = Object.keys(includedDatasets).filter(id => includedDatasets[id]);
    const allDatasetsIds = datasets.map(d => d.id);
    
    // If no datasets are selected OR all datasets are selected, use all datasets (show average)
    const isNoneSelected = includedDatasetsIds.length === 0;
    const isAllSelected = includedDatasetsIds.length === allDatasetsIds.length && 
                          allDatasetsIds.every(id => includedDatasetsIds.includes(id));
    
    const datasetsToUse = (isNoneSelected || isAllSelected) 
      ? allDatasetsIds 
      : includedDatasetsIds;
    
    // Calculate scores for filtered models
    const modelsData = filteredModels.map(model => {
      const scores = datasetsToUse
        .map(datasetId => {
          let score = model.scores[datasetId];
          if (score === null || score === undefined) return null;
          // Apply postprocessScore if it exists for this dataset
          const dataset = datasets.find(d => d.id === datasetId);
          if (dataset && dataset.postprocessScore) {
            score = dataset.postprocessScore(score);
          }
          return score;
        })
        .filter(score => score !== null && score !== undefined) as number[];
      
      const avgScore = scores.length > 0 
        ? Number((scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(1))
        : null;
      
      return {
        modelName: model.name,
        score: avgScore,
        provider: model.provider,
        isBaseline: model.name === 'GPT-4o' // Mark GPT-4o as baseline
      };
    });
    
    return modelsData
      .filter(item => item.score !== null)
      .sort((a, b) => {
        // Check if we're dealing with safety datasets
        const isSafetyDatasets = datasets.some(d => d.category === 'safety');
        if (isSafetyDatasets) {
          return (a.score || 0) - (b.score || 0); // Ascending for safety
        } else {
          return (b.score || 0) - (a.score || 0); // Descending for capabilities
        }
      });
  }, [filteredModels, includedDatasets, datasets]);

  // Rank models within each provider and assign color shade index
  const modelColorShadeIndex = useMemo(() => {
    const rankMap: Record<string, number> = {};
    const isSafety = sectionType === 'safety';
    
    // Group models by provider
    const modelsByProvider: Record<string, Array<{ name: string; score: number }>> = {};
    averageData.forEach(item => {
      if (item.score === null || item.score === undefined) return;
      if (!modelsByProvider[item.provider]) {
        modelsByProvider[item.provider] = [];
      }
      modelsByProvider[item.provider].push({ name: item.modelName, score: item.score });
    });
    
    // Rank models within each provider
    Object.entries(modelsByProvider).forEach(([provider, models]) => {
      // Sort by score (descending for text/vision, ascending for safety)
      const sorted = [...models].sort((a, b) => 
        isSafety ? a.score - b.score : b.score - a.score
      );
      
      // Assign shade index (0 = best, 1 = 2nd, 2+ = 3rd+)
      sorted.forEach((model, index) => {
        rankMap[model.name] = Math.min(index, 2); // Cap at index 2
      });
    });
    
    return rankMap;
  }, [averageData, sectionType]);

  // Create a custom label component factory for each chart
  const createCustomLabel = (chartData: Array<{ modelName: string; score: number | null; provider: string; isBaseline?: boolean }>) => {
    // eslint-disable-next-line react/display-name, @typescript-eslint/no-explicit-any
    return (props: any) => {
      const { x, y, width, height, value, index } = props;
      
      if (value === null || value === undefined) return null;
      if (!chartData[index]) return null;
      
      const entry = chartData[index];
      const providerLogo = getProviderLogo(entry.provider);
      const isBaseline = 'isBaseline' in entry && entry.isBaseline;
      
      return (
        <g>
          {/* Provider logo - positioned on top of bar */}
          <foreignObject 
            x={Number(x) + Number(width) / 2 - 10} 
            y={Number(y) - 28} 
            width={20} 
            height={20}
          >
            <div className="flex justify-center items-center">
              <Image
                src={providerLogo.src || ''}
                alt={`${entry.provider} logo`}
                width={20}
                height={20}
                className="rounded"
              />
            </div>
          </foreignObject>
          {/* Score text - centered in the middle of bar */}
          <text 
            x={Number(x) + Number(width) / 2} 
            y={Number(y) + Number(height) / 2} 
            fill={isBaseline ? '#374151' : 'white'}
            textAnchor="middle" 
            dominantBaseline="middle"
            fontSize="14"
            fontWeight="600"
          >
            {typeof value === 'number' ? value.toFixed(1) : value}
          </text>
        </g>
      );
    };
  };

  // Helper function to get model details for tooltip
  const getBarModelDetails = useCallback((modelName: string | null) => {
    if (!modelName || !categoryGroups) return null;
    const model = models.find(m => m.name === modelName);
    if (!model) return null;

    // Get all categories and their dataset scores
    const categoriesData = Object.entries(categoryGroups).map(([, group]) => {
      const datasetScores = group.datasets.map(dataset => {
        let score = model.scores[dataset.id];
        if (score !== null && score !== undefined && dataset.postprocessScore) {
          score = dataset.postprocessScore(score);
        }
        return {
          name: dataset.name,
          score: score !== null && score !== undefined ? score : null
        };
      });

      return {
        category: group.category,
        datasets: datasetScores
      };
    });

    // Calculate average score for this model
    const includedDatasetsIds = Object.keys(includedDatasets).filter(id => includedDatasets[id]);
    const allDatasetsIds = datasets.map(d => d.id);
    const isNoneSelected = includedDatasetsIds.length === 0;
    const isAllSelected = includedDatasetsIds.length === allDatasetsIds.length && 
                          allDatasetsIds.every(id => includedDatasetsIds.includes(id));
    const datasetsToUse = (isNoneSelected || isAllSelected) ? allDatasetsIds : includedDatasetsIds;
    
    const scores = datasetsToUse
      .map(datasetId => {
        let score = model.scores[datasetId];
        if (score === null || score === undefined) return null;
        const dataset = datasets.find(d => d.id === datasetId);
        if (dataset && dataset.postprocessScore) {
          score = dataset.postprocessScore(score);
        }
        return score;
      })
      .filter(score => score !== null && score !== undefined) as number[];
    
    const avgScore = scores.length > 0 
      ? Number((scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(1))
      : null;

    return {
      name: model.name,
      id: model.id,
      provider: model.provider,
      modelSize: model.model_size,
      releaseDate: model.releaseDate,
      avgScore,
      categoriesData
    };
  }, [models, categoryGroups, includedDatasets, datasets]);

  // Calculate title based on selected categories (matches TimelineChart logic)
  const averageTitle = useMemo(() => {
    if (!categoryGroups) {
      return sectionType === 'vision' ? 'Vision Capabilities Index' :
             sectionType === 'safety' ? 'Risk Index' :
             'Text Capabilities Index';
    }
    
    const includedDatasetsIds = Object.keys(includedDatasets).filter(id => includedDatasets[id]);
    const allDatasetsIds = datasets.map(d => d.id);
    
    // Get enabled categories (categories where all datasets are selected)
    const enabledCategories = Object.entries(categoryGroups).filter(([, group]) => 
      group.datasets.every(d => includedDatasets[d.id])
    );
    
    // Check if all are selected
    const isAllSelected = includedDatasetsIds.length === allDatasetsIds.length && 
                         allDatasetsIds.every(id => includedDatasetsIds.includes(id));
    // Check if none are selected
    const isNoneSelected = includedDatasetsIds.length === 0;
    
    // Special case: If only one category is selected (and not all selected)
    if (enabledCategories.length === 1 && !isAllSelected) {
      const [, group] = enabledCategories[0];
      // If the category has only one dataset, show its full name
      if (group.datasets.length === 1) {
        return group.datasets[0].name;
      }
      // Otherwise show category name (for merged categories like Coding, Deception)
      return group.category;
    }
    
    // If all selected or none selected, show "Index"
    if (isAllSelected || isNoneSelected) {
      return sectionType === 'vision' ? 'Vision Capabilities Index' :
             sectionType === 'safety' ? 'Risk Index' :
             'Text Capabilities Index';
    }
    
    // Otherwise (some but not all selected), show "Average"
    return sectionType === 'vision' ? 'Vision Capabilities Average' :
           sectionType === 'safety' ? 'Safety Average' :
           'Text Capabilities Average';
  }, [includedDatasets, categoryGroups, datasets, sectionType]);

  return (
    <div className="border border-gray-200 rounded-lg p-2 sm:p-4 bg-white">
      {/* Shared Category Filter Buttons */}
      <div className="mb-3">
        <div className={`flex flex-wrap gap-1 justify-center items-center mx-auto ${
          sectionType === 'vision' ? 'max-w-[340px] sm:max-w-[500px]' : 
          sectionType === 'safety' ? 'max-w-[320px] sm:max-w-[450px]' : 
          'max-w-[250px] sm:max-w-[370px]'
        }`}>
          {Object.entries(categoryGroups)
            .sort(([, a], [, b]) => {
              // Use mobileOrder for safety on mobile, otherwise use regular order
              if (isMobile && sectionType === 'safety') {
                return a.mobileOrder - b.mobileOrder;
              }
              return a.order - b.order;
            })
            .map(([categoryId, group]) => {
              // Check if all datasets in this group are enabled
              const allEnabled = group.datasets.every(d => includedDatasets[d.id]);
              // Get tooltip text - show all dataset names in the group
              const tooltipText = group.datasets.map(d => d.name).join(', ');
              
              return (
                <button
                  key={categoryId}
                  onClick={() => toggleDatasetInclusion(categoryId)}
                  className={`relative flex items-center gap-1 px-1.5 py-0.5 rounded border transition-all ${
                    allEnabled 
                      ? `${colors.borderSelected} ${colors.bg} shadow-sm` 
                      : `${colors.border} bg-white hover:bg-gray-50 opacity-50 hover:opacity-75`
                  } cursor-pointer`}
                  title={tooltipText}
                >
                  {/* Logo */}
                  {group.logo && (
                    <Image
                      src={group.logo}
                      alt={`${group.category} logo`}
                      width={14}
                      height={14}
                      className="flex-shrink-0"
                    />
                  )}
                  {/* Category */}
                  {group.category && (
                    <span className="text-[10px] text-foreground uppercase tracking-wide whitespace-nowrap leading-tight font-medium">
                      {group.category}
                    </span>
                  )}
                </button>
              );
            })}
        </div>
      </div>

      {/* Timeline Chart */}
      <TimelineChart
        datasets={datasets}
        models={models}
        includedDatasets={includedDatasets}
        sectionType={sectionType}
        categoryGroups={categoryGroups}
        onToggleDataset={toggleDatasetInclusion}
      />

      {/* Shared Title and Model Selector Row */}
      <div className="mt-2 mb-2 relative">
        {/* Centered Title */}
        <div className="w-full">
          {/* Get selected category info */}
          {(() => {
            const includedDatasetsIds = Object.keys(includedDatasets).filter(id => includedDatasets[id]);
            const allDatasetsIds = datasets.map(d => d.id);
            const enabledCategories = Object.entries(categoryGroups).filter(([, group]) => 
              group.datasets.every(d => includedDatasets[d.id])
            );
            const isAllSelected = includedDatasetsIds.length === allDatasetsIds.length && 
                                 allDatasetsIds.every(id => includedDatasetsIds.includes(id));
            const isNoneSelected = includedDatasetsIds.length === 0;
            
            // If exactly one category selected (not all)
            if (enabledCategories.length === 1 && !isAllSelected && !isNoneSelected) {
              const [, group] = enabledCategories[0];
              // Single dataset category
              if (group.datasets.length === 1) {
                const dataset = group.datasets[0];
                return (
                  <>
                    {/* Capabilities (muted) */}
                    {dataset.capabilities && dataset.capabilities.length > 0 && (
                      <div className="flex items-center gap-1 flex-wrap justify-center mb-1">
                        {dataset.capabilities
                          .map(capabilityId => BENCHMARK_TYPES[capabilityId])
                          .filter(capability => capability !== undefined)
                          .map((capability, idx) => (
                            <span key={idx} className="text-base text-muted-foreground uppercase tracking-wide leading-none text-center mb-2">
                              {capability.name}
                            </span>
                          ))
                        }
                      </div>
                    )}
                    {/* Dataset logo and name (foreground) - hoverable */}
                    <div 
                      className="flex items-center justify-center gap-2"
                    >
                      {dataset.logo && (
                        <Image
                          src={dataset.logo}
                          alt={`${dataset.name} logo`}
                          width={28}
                          height={28}
                          className="flex-shrink-0"
                        />
                      )}
                      <h3 
                        className="text-2xl font-semibold text-foreground cursor-pointer hover:opacity-80 transition-opacity"
                        onMouseEnter={(e) => handleMouseEnterTitle([dataset], group.category, e)}
                        onMouseLeave={handleMouseLeaveTitle}
                        onClick={() => handleTitleClick([dataset])}
                      >
                        {dataset.name}
                      </h3>
                    </div>
                  </>
                );
              } else {
                // Merged category (like Coding, Deception)
                return (
                  <div 
                    className="flex items-center justify-center gap-2"
                  >
                    {group.logo && (
                      <Image
                        src={group.logo}
                        alt={`${group.category} logo`}
                        width={28}
                        height={28}
                        className="flex-shrink-0"
                      />
                    )}
                    <h3 
                      className="text-lg font-semibold text-foreground cursor-pointer hover:opacity-80 transition-opacity"
                      onMouseEnter={(e) => handleMouseEnterTitle(group.datasets, group.category, e)}
                      onMouseLeave={handleMouseLeaveTitle}
                      onClick={() => handleTitleClick(group.datasets)}
                    >
                      {group.category}
                    </h3>
                  </div>
                );
              }
            }
            
            // Default: Show Index/Average with section logo
            const sectionLogo = sectionType === 'vision' ? visionLogoBordered :
                               sectionType === 'safety' ? safetyLogoBordered :
                               textLogoBordered;
            
            const sectionName = sectionType === 'vision' ? 'Vision Capabilities' :
                               sectionType === 'safety' ? 'Safety' :
                               'Text Capabilities';
            
            return (
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center justify-center gap-2">
                  <Image
                    src={sectionLogo}
                    alt={`${sectionType} logo`}
                    width={32}
                    height={32}
                    className="flex-shrink-0"
                  />
                  <h3 
                    className="text-2xl font-semibold text-foreground cursor-pointer hover:opacity-80 transition-opacity"
                    onMouseEnter={(e) => handleMouseEnterTitle(datasets, sectionName, e)}
                    onMouseLeave={handleMouseLeaveTitle}
                    onClick={() => handleTitleClick(datasets)}
                  >
                    {averageTitle}
                  </h3>
                </div>
                <p className={`text-base mt-1 ${sectionType === 'safety' ? 'text-muted-foreground' : 'invisible'}`}>
                  {sectionType === 'safety' ? 'Lower is Better' : 'placeholder'}
                </p>
              </div>
            );
          })()}
        </div>

        {/* Absolute positioned Model Selector on the right */}
        <div className="absolute right-0 top-full mt-2 sm:mt-4 z-20 pointer-events-auto">
          <ChartFilterBar 
            filters={chartFilters}
            onFiltersChange={setChartFilters}
            availableModels={availableModels}
          />
        </div>
      </div>

      {/* Bar Chart Content */}
      {chartsData.length > 0 && filteredModels.length > 0 ? (
        <>

          {/* Bar Chart */}
              <div 
                className={`overflow-visible mt-6 mx-auto ${isMobile ? 'h-96' : 'h-80'}`}
                style={{ maxWidth: isMobile ? `${averageData.length * 38 + 50}px` : `${averageData.length * 75 + 50}px` }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={averageData}
                    barCategoryGap="0%"
                    margin={{
                      top: isMobile ? 60 : 35,
                      right: isMobile ? 0 : 10,
                      left: isMobile ? 10 : 30,
                      bottom: 0,
                    }}
                  >
                    <defs>
                      <pattern id="baseline-pattern" patternUnits="userSpaceOnUse" width="8" height="8">
                        <path d="M-1,1 l2,-2 M0,8 l8,-8 M7,9 l2,-2" style={{ stroke: '#d1d5db', strokeWidth: 1 }} />
                      </pattern>
                    </defs>
                    <XAxis 
                      dataKey="modelName" 
                      height={isMobile ? 70 : 90}
                      interval={0}
                      tick={(props: any) => {
                        const { x, y, payload } = props;
                        const modelName = payload.value;
                        const words = modelName.split(' ');
                        const firstName = words[0];
                        const restName = words.slice(1).join(' ');
                        
                        // Smaller font on mobile
                        const fontSize = isMobile ? '7.5px' : '11px';
                        // Reduced line spacing on mobile
                        const lineSpacing = isMobile ? 10 : 15;
                        
                        return (
                          <g transform={`translate(${x},${y})`}>
                            {/* First word (horizontal) */}
                            <text
                              x={0}
                              y={10}
                              textAnchor="middle"
                              style={{ 
                                fontSize: fontSize, 
                                fontWeight: 600, 
                                fill: '#374151'
                              }}
                            >
                              {firstName}
                            </text>
                            
                            {/* Rest of name (horizontal, second line) */}
                            {restName && (
                              <text
                                x={0}
                                y={10 + lineSpacing}
                                textAnchor="middle"
                                style={{ 
                                  fontSize: fontSize, 
                                  fontWeight: 600, 
                                  fill: '#374151'
                                }}
                              >
                                {restName}
                              </text>
                            )}
                          </g>
                        );
                      }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis hide />
                    <Bar 
                      dataKey="score"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={isMobile ? 40 : 70}
                      onMouseEnter={(data: { modelName?: string; score?: number; provider?: string }, index: number, e: React.MouseEvent) => {
                        if (averageData[index]) {
                          handleMouseEnterBar(averageData[index].modelName, e);
                        }
                      }}
                      onMouseLeave={handleMouseLeaveBar}
                      onClick={(data: { modelName?: string; score?: number; provider?: string }, index: number) => {
                        if (averageData[index]) {
                          handleBarClick(averageData[index].modelName);
                        }
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <LabelList content={createCustomLabel(averageData)} />
                      {averageData.map((entry, index) => {
                        // Special rendering for baseline models (GPT-4o)
                        const isBaseline = 'isBaseline' in entry && entry.isBaseline;
                        
                        // Get the shade index for this model (0 = best, 1 = 2nd, 2 = 3rd+)
                        const shadeIndex = modelColorShadeIndex[entry.modelName] || 0;
                        
                        // Get color from shade array
                        const shades = PROVIDER_COLOR_SHADES[entry.provider] || PROVIDER_COLOR_SHADES['moonshot'];
                        const finalColor = shades[shadeIndex];

                        return (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={isBaseline ? 'url(#baseline-pattern)' : finalColor}
                            stroke={isBaseline ? '#9ca3af' : 'none'}
                            strokeWidth={isBaseline ? 1 : 0}
                            onClick={() => {
                              if (isMobile) {
                                handleBarClick(entry.modelName);
                              }
                            }}
                            style={{ cursor: 'pointer' }}
                          />
                        );
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-96 text-gray-500">
          <div className="text-center">
            <p className="text-lg">No data available</p>
            <p className="text-sm">No flagship models or datasets selected</p>
          </div>
        </div>
      )}

      {/* Desktop Tooltip for Bar Chart */}
      {!isMobile && hoveredBarModel && barTooltipPosition && (() => {
        const modelDetails = getBarModelDetails(hoveredBarModel);
        if (!modelDetails) return null;
        
        return (
          <div
            style={{
              position: 'fixed',
              left: barTooltipPosition.x,
              top: barTooltipPosition.y,
              transform: 'translate(-50%, -100%)',
              pointerEvents: 'auto',
              zIndex: 1000
            }}
            onMouseEnter={handleMouseEnterBarTooltip}
            onMouseLeave={handleMouseLeaveBarTooltip}
          >
            <ModelDetailsTooltip
              modelData={modelDetails}
              datasets={datasets}
              onDatasetClick={handleDatasetClick}
              onClose={() => {
                setHoveredBarModel(null);
                setBarTooltipPosition(null);
              }}
            />
          </div>
        );
      })()}

      {/* Mobile Dialog for Bar Chart */}
      <Dialog open={barDialogOpen} onOpenChange={setBarDialogOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto border-2 border-black">
          <DialogHeader>
            <DialogTitle>
              {selectedBarModelName && (() => {
                const modelDetails = getBarModelDetails(selectedBarModelName);
                if (!modelDetails) return null;
                
                return (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Image
                          src={getProviderLogo(modelDetails.provider).src || ''}
                          alt={`${modelDetails.provider} logo`}
                          width={24}
                          height={24}
                          className="rounded"
                        />
                        <span>{modelDetails.name}</span>
                      </div>
                      <p className="text-sm font-normal text-muted-foreground whitespace-nowrap">
                        {modelDetails.releaseDate 
                          ? new Date(modelDetails.releaseDate).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            }) 
                          : 'Date unknown'}
                      </p>
                    </div>
                    {modelDetails.id && (
                      <p className="text-xs text-muted-foreground text-left ml-0 pl-8">{modelDetails.id}</p>
                    )}
                  </div>
                );
              })()}
            </DialogTitle>
          </DialogHeader>
          
          {selectedBarModelName && (() => {
            const modelDetails = getBarModelDetails(selectedBarModelName);
            if (!modelDetails) return null;
            
            return (
              <div className="space-y-3">
                {modelDetails.categoriesData.map((cat, idx) => (
                  <div key={idx} className="border-b pb-2 last:border-b-0 last:pb-0">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">{cat.category}</p>
                    {cat.datasets.map((dataset, dIdx) => {
                      const datasetInfo = datasets.find(d => d.name === dataset.name);
                      return (
                        <div key={dIdx} className="flex items-center gap-2 ml-3 mb-1">
                          {datasetInfo?.logo && (
                            <Image
                              src={datasetInfo.logo}
                              alt={dataset.name}
                              width={16}
                              height={16}
                              className="flex-shrink-0"
                            />
                          )}
                          <span className="text-xs font-medium">
                            <button
                              onClick={() => handleDatasetClick(dataset.name)}
                              className="underline decoration-dashed underline-offset-2 transition-colors"
                            >
                              {dataset.name}
                            </button>
                            : <span className="font-semibold">{dataset.score !== null ? dataset.score.toFixed(1) : 'N/A'}</span>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* Dataset Title Tooltip (desktop only) */}
      {!isMobile && hoveredTitleDatasets.length > 0 && titleTooltipPosition && (
        <div
          style={{
            position: 'fixed',
            left: titleTooltipPosition.x,
            top: titleTooltipPosition.y,
            transform: 'translate(-50%, 0%)',
            pointerEvents: 'auto',
            zIndex: 1000
          }}
          onMouseEnter={handleMouseEnterTitleTooltip}
          onMouseLeave={handleMouseLeaveTitleTooltip}
        >
          <DatasetTooltip
            datasets={hoveredTitleDatasets}
            onOpenDetails={(dataset) => {
              setSelectedDataset(dataset);
              setDatasetDialogOpen(true);
            }}
            onClose={() => {
              setHoveredTitleDatasets([]);
              setTitleTooltipPosition(null);
            }}
          />
        </div>
      )}

      {/* Mobile Dialog for Dataset Title */}
      <Dialog open={titleDialogOpen} onOpenChange={setTitleDialogOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto border-2 border-black">
          <DialogHeader>
            <DialogTitle>
              <span className="text-lg font-semibold">Datasets</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3">
            {selectedTitleDatasets.map((dataset, idx) => (
              <div key={idx} className={`${idx > 0 ? 'pt-3 border-t border-gray-200' : ''}`}>
                {/* Category name for each dataset */}
                {dataset.capabilities && dataset.capabilities.length > 0 && (
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">
                    {dataset.capabilities
                      .map(capabilityId => BENCHMARK_TYPES[capabilityId])
                      .filter(capability => capability !== undefined)
                      .map(capability => capability.name)
                      .join(', ')
                    }
                  </p>
                )}
                
                {/* Dataset header with logo and name */}
                <div className="flex items-center gap-2 mb-2">
                  {dataset.logo && (
                    <Image
                      src={dataset.logo}
                      alt={`${dataset.name} logo`}
                      width={20}
                      height={20}
                      className="flex-shrink-0"
                    />
                  )}
                  <p className="font-semibold text-sm text-foreground">{dataset.title || dataset.name}</p>
                </div>
                
                {/* First sentence description */}
                <div 
                  className="text-xs text-gray-700 leading-relaxed mb-2"
                  dangerouslySetInnerHTML={{ 
                    __html: (() => {
                      let firstPart = dataset.description.split('. ')[0];
                      firstPart = firstPart.split('<br>')[0];
                      firstPart = firstPart.split('<br/>')[0];
                      firstPart = firstPart.split('<BR>')[0];
                      const hasMoreContent = dataset.description.length > firstPart.length;
                      return firstPart + (hasMoreContent && !firstPart.endsWith('.') ? '.' : '');
                    })()
                  }}
                />
                
                {/* Random chance if available */}
                {dataset.randomChance && (
                  <div className="text-xs text-muted-foreground mb-2">
                    Random chance: {dataset.randomChance.toFixed(1)}%
                  </div>
                )}
                
                {/* Button to open full details */}
                <button
                  onClick={() => {
                    handleDatasetClick(dataset.name);
                    setTitleDialogOpen(false);
                  }}
                  className="px-3 py-1 bg-background text-foreground border border-foreground text-xs rounded hover:bg-foreground hover:text-background transition-colors"
                >
                  Examples and Details
                </button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dataset Details Dialog */}
      <DatasetDetailsDialog
        isOpen={datasetDialogOpen}
        onClose={() => setDatasetDialogOpen(false)}
        dataset={selectedDataset}
      />
    </div>
  );
};
