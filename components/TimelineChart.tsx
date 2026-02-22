"use client";

import React, { useMemo, useState } from "react";
import { ComposedChart, Scatter, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid, ZAxis } from 'recharts';
import Image, { StaticImageData } from "next/image";
import { Dataset, Model } from "@/lib/types";
import { getProviderLogo, PROVIDER_COLORS, getProviderInfo } from "@/app/constants";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import DatasetDetailsDialog from "@/components/DatasetDetailsDialog";
import { ModelDetailsTooltip } from "@/components/ModelDetailsTooltip";

// Hardcoded label position overrides for specific models on the timeline chart.
// 'default' is used in Index mode (all/none datasets selected).
// 'datasetOverrides' apply when a specific dataset is actively selected.
const LABEL_POSITION_OVERRIDES: Record<string, {
  default: 'above' | 'below';
  datasetOverrides?: Record<string, 'above' | 'below'>;
}> = {
  'Opus 4.5': {
    default: 'below',
    datasetOverrides: {
      'hle': 'above',
    },
  },
};

interface TimelineChartProps {
  datasets: Dataset[];
  models: Model[];
  includedDatasets: Record<string, boolean>;
  sectionType?: 'text' | 'vision' | 'safety';
  categoryGroups?: Record<string, { datasets: Dataset[], logo: string | StaticImageData | undefined, category: string, order: number, mobileOrder: number }>;
  onToggleDataset?: (datasetIdOrCategoryId: string) => void;
}

export const TimelineChart: React.FC<TimelineChartProps> = ({
  datasets,
  models,
  includedDatasets,
  sectionType = 'text',
  categoryGroups
}) => {
  const [hoveredModel, setHoveredModel] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedModelName, setSelectedModelName] = useState<string | null>(null);
  const [isHoveringTooltip, setIsHoveringTooltip] = useState(false);
  const closeTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  
  // Dataset details dialog state
  const [datasetDialogOpen, setDatasetDialogOpen] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  
  // Handler to open dataset details dialog
  const handleDatasetClick = (datasetName: string) => {
    const dataset = datasets.find(d => d.name === datasetName);
    if (dataset) {
      setSelectedDataset(dataset);
      setDatasetDialogOpen(true);
    }
  };

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  // Helper functions to handle tooltip hover with delay
  const handleMouseEnterModel = React.useCallback((modelName: string, cx: number, cy: number, svgRect: DOMRect) => {
    if (isMobile) return;
    
    // Clear any pending close timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    
    setHoveredModel(modelName);
    setTooltipPosition({ 
      x: cx + svgRect.left, 
      y: cy + svgRect.top - 10
    });
  }, [isMobile]);

  const handleMouseLeaveModel = React.useCallback(() => {
    if (isMobile) return;
    
    // Delay closing to allow moving to tooltip
    closeTimeoutRef.current = setTimeout(() => {
      if (!isHoveringTooltip) {
        setHoveredModel(null);
        setTooltipPosition(null);
      }
    }, 150);
  }, [isMobile, isHoveringTooltip]);

  const handleMouseEnterTooltip = React.useCallback(() => {
    // Clear any pending close timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsHoveringTooltip(true);
  }, []);

  const handleMouseLeaveTooltip = React.useCallback(() => {
    setIsHoveringTooltip(false);
    setHoveredModel(null);
    setTooltipPosition(null);
  }, []);

  // Calculate average score across all included datasets (same as bar chart and table)
  // Returns null if ANY included dataset has a null score
  const calculateCategoryScore = React.useCallback((model: Model): number | null => {
    if (!categoryGroups) return null;
    
    // Get included categories
    const includedCategories = Object.entries(categoryGroups).filter(([, group]) => {
      return group.datasets.some(d => includedDatasets[d.id]);
    });
    
    // Get all dataset IDs
    const allDatasetIds = Object.values(categoryGroups).flatMap(group => 
      group.datasets.map(d => d.id)
    );
    const includedDatasetIds = Object.keys(includedDatasets).filter(id => includedDatasets[id]);
    
    // Check if none selected OR all selected - use all categories (show average)
    const isNoneSelected = includedCategories.length === 0;
    const isAllSelected = includedDatasetIds.length === allDatasetIds.length && 
                         allDatasetIds.every(id => includedDatasetIds.includes(id));
    
    // If no categories are selected OR all are selected, use all categories (show average)
    const categoriesToUse = (isNoneSelected || isAllSelected)
      ? Object.entries(categoryGroups)
      : includedCategories;
    
    if (categoriesToUse.length === 0) return null;
    
    // Determine which datasets to check based on selection
    const hasSelection = !isNoneSelected && !isAllSelected;
    
    // First check: ensure model has non-null scores for ALL datasets in the selected set
    for (const [, group] of categoriesToUse) {
      for (const dataset of group.datasets) {
        // If there's a selection, only check selected datasets; otherwise check all
        if (hasSelection ? includedDatasets[dataset.id] : true) {
          const score = model.scores[dataset.id];
          if (score === null || score === undefined) {
            // Model has null score for a required dataset, exclude from timeline
            return null;
          }
        }
      }
    }
    
    // Calculate average score across ALL datasets (not category averages)
    // This matches the calculation in InlineBarChart and ModelResultsTable
    const allDatasetScores: number[] = [];
    
    for (const [, group] of categoriesToUse) {
      for (const dataset of group.datasets) {
        // If there's a selection, only use selected datasets; otherwise use all
        if (hasSelection ? includedDatasets[dataset.id] : true) {
          let score = model.scores[dataset.id];
          if (score !== null && score !== undefined) {
            if (dataset.postprocessScore) {
              score = dataset.postprocessScore(score);
            }
            allDatasetScores.push(score);
          }
        }
      }
    }
    
    return allDatasetScores.length > 0 
      ? allDatasetScores.reduce((sum, score) => sum + score, 0) / allDatasetScores.length
      : null;
  }, [categoryGroups, includedDatasets]);

  // Prepare all model data points (scatter dots) - exclude nano models
  const allModelPoints = useMemo(() => {
    return models
      .filter(m => m.releaseDate && m.model_size !== 'nano') // Exclude nano models
      .map(m => {
        const avgScore = calculateCategoryScore(m);
        const date = new Date(m.releaseDate!);
        return {
          name: m.name,
          provider: m.provider,
          modelSize: m.model_size,
          date: date,
          timestamp: date.getTime(),
          avgScore: avgScore,
          dateLabel: date.toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric'
          })
        };
      })
      .filter(item => item.avgScore !== null) // Filter out models with null scores
      .sort((a, b) => a.timestamp - b.timestamp);
  }, [models, calculateCategoryScore]);

  // Calculate frontier line for standard models - monotonically improving
  // For safety section: lower is better, so monotonically decreasing
  // For other sections: higher is better, so monotonically increasing
  const standardFrontierData = useMemo(() => {
    if (allModelPoints.length === 0) return [];

    // Get standard models and sort by timestamp
    const standardPoints = allModelPoints
      .filter(p => p.modelSize === 'standard')
      .sort((a, b) => a.timestamp - b.timestamp);
    
    const frontierPoints: Array<{timestamp: number, value: number, name: string, dateLabel: string}> = [];
    const isSafety = sectionType === 'safety';
    
    if (isSafety) {
      // For safety: lower is better, build monotonically decreasing frontier
      let currentMin = Infinity;
      
      standardPoints.forEach(point => {
        if (point.avgScore! < currentMin) {
          currentMin = point.avgScore!;
          frontierPoints.push({
            timestamp: point.timestamp,
            value: point.avgScore!,
            name: point.name,
            dateLabel: new Date(point.timestamp).toLocaleDateString('en-US', {
              month: 'short',
              year: 'numeric'
            })
          });
        }
      });
    } else {
      // For text/vision: higher is better, build monotonically increasing frontier
      let currentMax = -Infinity;
      
      standardPoints.forEach(point => {
        if (point.avgScore! > currentMax) {
          currentMax = point.avgScore!;
          frontierPoints.push({
            timestamp: point.timestamp,
            value: point.avgScore!,
            name: point.name,
            dateLabel: new Date(point.timestamp).toLocaleDateString('en-US', {
              month: 'short',
              year: 'numeric'
            })
          });
        }
      });
    }
    
    return frontierPoints;
  }, [allModelPoints, sectionType]);
  
  // Helper function to check if a model is on the "good" side of the frontier
  // For text/vision: good = on or above the line
  // For safety: good = on or below the line
  const isModelOnFrontier = React.useCallback((timestamp: number, avgScore: number) => {
    if (standardFrontierData.length === 0) return true;
    
    const isSafety = sectionType === 'safety';
    
    // Find the frontier value at this timestamp (or the last known value before it)
    let frontierValue: number | null = null;
    
    for (let i = 0; i < standardFrontierData.length; i++) {
      if (standardFrontierData[i].timestamp <= timestamp) {
        frontierValue = standardFrontierData[i].value;
      } else {
        break;
      }
    }
    
    // If no frontier exists yet at this time, all models are considered "good"
    if (frontierValue === null) return true;
    
    // Check if model is on the good side of frontier
    if (isSafety) {
      // For safety: good = on or below the frontier (lower is better)
      return avgScore <= frontierValue;
    } else {
      // For text/vision: good = on or above the frontier (higher is better)
      return avgScore >= frontierValue;
    }
  }, [standardFrontierData, sectionType]);
  
  // Calculate best standard model for each 15-day period
  // For safety: best = lowest, for others: best = highest
  // On mobile: only show models that are on the frontier line
  const periodicBestStandard = useMemo(() => {
    if (allModelPoints.length === 0) return [];

    const standardPoints = allModelPoints.filter(p => p.modelSize === 'standard');
    if (standardPoints.length === 0) return [];
    
    const isSafety = sectionType === 'safety';
    
    // On mobile, only show frontier models (models that actually improved the frontier)
    if (isMobile) {
      // Return only the models that are on the frontier line
      return standardFrontierData.map(item => ({
        timestamp: item.timestamp,
        value: item.value,
        name: item.name,
        dateLabel: item.dateLabel
      }));
    }
    
    // Desktop: show best model in each 15-day period
    const periodDays = 15;
    const periodMs = periodDays * 24 * 60 * 60 * 1000;
    
    // Sort by timestamp
    const sortedPoints = [...standardPoints].sort((a, b) => a.timestamp - b.timestamp);
    
    // Group models into periods and find best in each period
    const periodicBest = new Map<number, {timestamp: number, value: number, name: string}>();
    
    sortedPoints.forEach(point => {
      // Calculate which period this model belongs to (based on first model's timestamp)
      const periodIndex = Math.floor((point.timestamp - sortedPoints[0].timestamp) / periodMs);
      
      const existing = periodicBest.get(periodIndex);
      const isBetter = isSafety 
        ? (!existing || point.avgScore! < existing.value) // Safety: lower is better
        : (!existing || point.avgScore! > existing.value); // Others: higher is better
      
      if (isBetter) {
        periodicBest.set(periodIndex, {
          timestamp: point.timestamp,
          value: point.avgScore!,
          name: point.name
        });
      }
    });
    
    // Sort by timestamp and format
    return Array.from(periodicBest.values())
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(item => ({
        timestamp: item.timestamp,
        value: item.value,
        name: item.name,
        dateLabel: new Date(item.timestamp).toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric'
        })
      }));
  }, [allModelPoints, sectionType, isMobile, standardFrontierData]);
  
  // Calculate worst standard model for each 15-day period (excludes best models from same period)
  // For safety: worst = highest, for others: worst = lowest
  const periodicWorstStandard = useMemo(() => {
    if (allModelPoints.length === 0) return [];

    const standardPoints = allModelPoints.filter(p => p.modelSize === 'standard');
    if (standardPoints.length === 0) return [];
    
    const isSafety = sectionType === 'safety';
    const periodDays = isMobile ? 60 : 15;
    const periodMs = periodDays * 24 * 60 * 60 * 1000;
    
    // Sort by timestamp
    const sortedPoints = [...standardPoints].sort((a, b) => a.timestamp - b.timestamp);
    
    // First, get the best models by period (to exclude them)
    const bestByPeriod = new Map<number, string>();
    sortedPoints.forEach(point => {
      const periodIndex = Math.floor((point.timestamp - sortedPoints[0].timestamp) / periodMs);
      
      if (!bestByPeriod.has(periodIndex)) {
        // Find best in this period
        const modelsInPeriod = sortedPoints.filter(p => 
          Math.floor((p.timestamp - sortedPoints[0].timestamp) / periodMs) === periodIndex
        );
        
        const best = isSafety
          ? modelsInPeriod.reduce((min, p) => p.avgScore! < min.avgScore! ? p : min, modelsInPeriod[0])
          : modelsInPeriod.reduce((max, p) => p.avgScore! > max.avgScore! ? p : max, modelsInPeriod[0]);
        
        bestByPeriod.set(periodIndex, best.name);
      }
    });
    
    // Now find worst in each period (excluding the best)
    const periodicWorst = new Map<number, {timestamp: number, value: number, name: string}>();
    
    sortedPoints.forEach(point => {
      const periodIndex = Math.floor((point.timestamp - sortedPoints[0].timestamp) / periodMs);
      
      // Skip if this is the best model for this period
      if (bestByPeriod.get(periodIndex) === point.name) return;
      
      const existing = periodicWorst.get(periodIndex);
      const isWorse = isSafety
        ? (!existing || point.avgScore! > existing.value) // Safety: higher is worse
        : (!existing || point.avgScore! < existing.value); // Others: lower is worse
      
      if (isWorse) {
        periodicWorst.set(periodIndex, {
          timestamp: point.timestamp,
          value: point.avgScore!,
          name: point.name
        });
      }
    });
    
    // Sort by timestamp and format
    return Array.from(periodicWorst.values())
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(item => ({
        timestamp: item.timestamp,
        value: item.value,
        name: item.name,
        dateLabel: new Date(item.timestamp).toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric'
        })
      }));
  }, [allModelPoints, sectionType, isMobile]);

  // Get section color
  const getLineColor = () => {
    switch (sectionType) {
      case 'vision':
        return '#16a34a'; // green
      case 'safety':
        return '#7c3aed'; // purple (purple-700)
      default:
        return '#2563eb'; // blue
    }
  };
  const lineColor = getLineColor();

  // Calculate Y-axis domain and ticks (standard intervals of 10)
  const yAxisConfig = useMemo(() => {
    if (allModelPoints.length === 0) return { min: 0, max: 100, ticks: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100] };
    
    // Set minimum based on section type - vision starts at 25
    const yMin = sectionType === 'vision' ? 25 : 0;
    
    const maxScore = Math.max(...allModelPoints.map(p => p.avgScore!));
    // Round up to next multiple of 10
    const maxRounded = Math.ceil((maxScore + 10) / 10) * 10;
    const yMax = Math.min(100, maxRounded);
    
    // Generate ticks at intervals of 10
    const ticks: number[] = [];
    for (let i = yMin; i <= yMax; i += 10) {
      ticks.push(i);
    }
    
    return { min: yMin, max: yMax, ticks };
  }, [allModelPoints, sectionType]);

  // Create better X-axis ticks (every 2 months with year labels)
  const xAxisConfig = useMemo(() => {
    if (allModelPoints.length === 0) return { ticks: [], domain: [0, 0], yearPositions: [] };
    
    const minDate = new Date(Math.min(...allModelPoints.map(p => p.timestamp)));
    const maxDate = new Date(Math.max(...allModelPoints.map(p => p.timestamp)));
    
    const paddingDays = isMobile ? 45 : 35;
    const maxDateWithPadding = new Date(maxDate.getTime() + (paddingDays * 24 * 60 * 60 * 1000));
    
    // Generate ticks every 2 months
    const ticks: number[] = [];
    const yearPositions: Array<{position: number, year: number}> = [];
    const current = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
    const end = new Date(maxDateWithPadding.getFullYear(), maxDateWithPadding.getMonth() + 1, 1);
    
    let currentYear = -1;
    let yearStartPosition = 0;
    let ticksInYear = 0;
    
    while (current < end) {
      ticks.push(current.getTime());
      
      // Track year changes
      if (current.getFullYear() !== currentYear) {
        if (currentYear !== -1) {
          // Calculate middle position for previous year
          const middlePosition = (yearStartPosition + (ticksInYear - 1)) / 2;
          yearPositions.push({
            position: yearStartPosition + middlePosition,
            year: currentYear
          });
        }
        currentYear = current.getFullYear();
        yearStartPosition = ticks.length - 1;
        ticksInYear = 1;
      } else {
        ticksInYear++;
      }
      
      current.setMonth(current.getMonth() + 2); // Increment by 2 months
    }
    
    // Add last year position
    if (ticksInYear > 0) {
      const middlePosition = (yearStartPosition + (ticksInYear - 1)) / 2;
      yearPositions.push({
        position: yearStartPosition + middlePosition,
        year: currentYear
      });
    }
    
    return { 
      ticks, 
      domain: [minDate.getTime(), maxDateWithPadding.getTime()],
      yearPositions
    };
  }, [allModelPoints, isMobile]);

  // Create tick formatter for X-axis - show month abbreviations
  const formatXAxis = (timestamp: number) => {
    const date = new Date(timestamp);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return monthNames[date.getMonth()];
  };

  // Get hovered model data
  const getLabelYOffset = React.useCallback((modelName: string, defaultYOffset: number): number => {
    const override = LABEL_POSITION_OVERRIDES[modelName];
    if (!override) return defaultYOffset;

    const allDatasetIds = categoryGroups
      ? Object.values(categoryGroups).flatMap(group => group.datasets.map(d => d.id))
      : [];
    const includedDatasetIds = Object.keys(includedDatasets).filter(id => includedDatasets[id]);
    const isNoneSelected = includedDatasetIds.length === 0;
    const isAllSelected = includedDatasetIds.length === allDatasetIds.length &&
                           allDatasetIds.every(id => includedDatasetIds.includes(id));
    const isIndexMode = isNoneSelected || isAllSelected;

    let position = override.default;

    if (!isIndexMode && override.datasetOverrides) {
      for (const datasetId of includedDatasetIds) {
        if (override.datasetOverrides[datasetId]) {
          position = override.datasetOverrides[datasetId];
          break;
        }
      }
    }

    return position === 'below' ? 24 : -16;
  }, [categoryGroups, includedDatasets]);

  const hoveredModelData = hoveredModel 
    ? allModelPoints.find(m => m.name === hoveredModel)
    : null;
  
  // Get model full details (for both tooltip and dialog)
  const getModelDetails = React.useCallback((modelName: string | null) => {
    if (!modelName) return null;
    const model = models.find(m => m.name === modelName);
    if (!model || !categoryGroups) return null;
    
    const modelPoint = allModelPoints.find(m => m.name === modelName);
    if (!modelPoint) return null;
    
    // Show all categories and ALL datasets within each category (not just selected ones)
    const categoriesData = Object.entries(categoryGroups).map(([, group]) => {
      // Show all datasets in the category, regardless of selection
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
    
    return {
      name: model.name,
      id: model.id,
      provider: model.provider,
      modelSize: model.model_size,
      releaseDate: model.releaseDate,
      avgScore: modelPoint.avgScore,
      categoriesData
    };
  }, [models, categoryGroups, allModelPoints]);
  
  const hoveredModelDetails = getModelDetails(hoveredModel);
  const selectedModelData = getModelDetails(selectedModelName);
  
  // Only show chart if there's data
  if (allModelPoints.length === 0) {
    return null;
  }

  return (
    <div>
      {/* Y-axis label and Legend - Above the chart */}
      <div className="flex items-center justify-between">
        <div className={`text-xs font-semibold text-gray-700 ${isMobile ? '' : 'ml-8'}`}>
          {isMobile ? (
            <div className="leading-tight">
              Average<br/>Score
            </div>
          ) : (
            <div>Average Score</div>
          )}
        </div>
        
        {/* Legend - Top right */}
        <div className={`flex items-center gap-3 text-xs ${isMobile ? '' : 'mr-8'}`}>
          <div className="flex items-center gap-1.5">
            <svg width="26" height="26" viewBox="0 0 26 26">
              <circle
                cx="13"
                cy="13"
                r="9"
                fill="white"
                stroke="#4b5563"
                strokeWidth="1.5"
              />
            </svg>
            <span className="text-gray-600">Standard</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg width="22" height="22" viewBox="0 0 22 22">
              <circle
                cx="11"
                cy="11"
                r="7.5"
                fill="white"
                stroke="#4b5563"
                strokeWidth="1.5"
                strokeDasharray="3,2"
              />
            </svg>
            <span className="text-gray-600">Mini</span>
          </div>
        </div>
      </div>
      
      <div className="h-80 relative">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            margin={{
              top: 10,
              right: isMobile ? 0: 0,
              left: isMobile ? -35 : 0,
              bottom: 0,
            }}
          >
            <defs>
              <pattern id="timeline-baseline-pattern" patternUnits="userSpaceOnUse" width="4" height="4">
                <path d="M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2" style={{ stroke: '#b8bdc4', strokeWidth: 0.75 }} />
              </pattern>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              type="number"
              dataKey="timestamp"
              domain={xAxisConfig.domain}
              ticks={xAxisConfig.ticks}
              tickFormatter={formatXAxis}
              tick={{ fontSize: 12, fill: '#374151' }}
              height={50}
            />
            <YAxis 
              type="number"
              domain={[yAxisConfig.min, yAxisConfig.max]}
              ticks={yAxisConfig.ticks}
              tick={{ fontSize: 12, fill: '#374151' }}
            />
            {/* Right Y-axis - only on desktop */}
            {!isMobile && (
              <YAxis 
                type="number"
                domain={[yAxisConfig.min, yAxisConfig.max]}
                ticks={yAxisConfig.ticks}
                tick={{ fontSize: 12, fill: '#374151' }}
                orientation="right"
                yAxisId="right"
              />
            )}
            <ZAxis range={[100, 100]} />
            
            {/* 1. Frontier line - render FIRST (lowest z-index) */}
            <Line
              data={standardFrontierData}
              type="monotone"
              dataKey="value"
              name="Best Standard"
              stroke={lineColor}
              strokeWidth={2.5}
              strokeDasharray="5 5"
              dot={false}
              legendType="none"
              activeDot={false}
              isAnimationActive={false}
            />
            
            {/* 2. Mini models - render second */}
            <Scatter
              data={allModelPoints.filter(p => p.modelSize === 'mini')}
              dataKey="avgScore"
              fill="#8884d8"
              isAnimationActive={false}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              shape={(props: any) => {
                const { cx, cy, payload } = props;
                if (!payload || !payload.provider) {
                  return <circle cx={cx} cy={cy} r={0} />;
                }
                
                const providerLogo = getProviderLogo(payload.provider);
                const providerColor = PROVIDER_COLORS[payload.provider] || '#6b7280';
                const size = 16; // Mini model size
                const isHovered = hoveredModel === payload.name;
                const strokeDasharray = '3,2'; // Dashed for mini
                
                // Check if model is on the frontier (good side)
                const isOnFrontier = isModelOnFrontier(payload.timestamp, payload.avgScore);
                const opacity = isOnFrontier ? 0.95 : 0.3; // Gray out models not on frontier
                
                // Get the actual image source
                const imgSrc = typeof providerLogo.src === 'string' ? providerLogo.src : providerLogo.src.src;
                
                return (
                  <g 
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      if (isMobile) {
                        setSelectedModelName(payload.name);
                        setDialogOpen(true);
                      }
                    }}
                    onMouseEnter={(e: React.MouseEvent) => {
                      if (!isMobile) {
                        const rect = (e.currentTarget as SVGElement).closest('svg')?.getBoundingClientRect();
                        if (rect) {
                          handleMouseEnterModel(payload.name, cx, cy, rect);
                        }
                      }
                    }}
                    onMouseLeave={handleMouseLeaveModel}
                  >
                    {/* White background circle for contrast */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={size / 2 + 2}
                      fill="white"
                      stroke={isHovered ? lineColor : providerColor}
                      strokeWidth={isHovered ? 2.5 : 1.5}
                      strokeDasharray={strokeDasharray}
                      opacity={opacity}
                      style={{ pointerEvents: 'all', transition: 'all 0.2s' }}
                    />
                    <image
                      x={cx - (size - 4) / 2}
                      y={cy - (size - 4) / 2}
                      width={size - 4}
                      height={size - 4}
                      href={imgSrc}
                      style={{ pointerEvents: 'none', opacity }}
                    />
                  </g>
                );
              }}
            />
            
            {/* 3. Standard models - render third (on top of mini/nano) */}
            <Scatter
              data={allModelPoints.filter(p => p.modelSize === 'standard')}
              dataKey="avgScore"
              fill="#8884d8"
              isAnimationActive={false}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              shape={(props: any) => {
                const { cx, cy, payload } = props;
                if (!payload || !payload.provider) {
                  return <circle cx={cx} cy={cy} r={0} />;
                }
                
                const providerLogo = getProviderLogo(payload.provider);
                const providerColor = PROVIDER_COLORS[payload.provider] || '#6b7280';
                const size = 20; // Larger for standard models
                const isHovered = hoveredModel === payload.name;
                // Special case: o3-mini should have dashed border like mini models
                const isO3Mini = payload.name === 'o3-mini';
                const strokeDasharray = isO3Mini ? '3,2' : '0'; // Dashed for o3-mini, solid for other standard
                
                // Check if model is on the frontier (good side)
                const isOnFrontier = isModelOnFrontier(payload.timestamp, payload.avgScore);
                const opacity = isOnFrontier ? 0.95 : 0.5; // Gray out models not on frontier
                
                // Special case: GPT-4o is a baseline model with striped pattern
                const isBaseline = payload.name === 'GPT-4o';
                
                // Get the actual image source
                const imgSrc = typeof providerLogo.src === 'string' ? providerLogo.src : providerLogo.src.src;
                
                return (
                  <g 
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      if (isMobile) {
                        setSelectedModelName(payload.name);
                        setDialogOpen(true);
                      }
                    }}
                    onMouseEnter={(e: React.MouseEvent) => {
                      if (!isMobile) {
                        const rect = (e.currentTarget as SVGElement).closest('svg')?.getBoundingClientRect();
                        if (rect) {
                          handleMouseEnterModel(payload.name, cx, cy, rect);
                        }
                      }
                    }}
                    onMouseLeave={handleMouseLeaveModel}
                  >
                    {/* Background circle for contrast (white for normal, pattern for baseline) */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={size / 2 + 2}
                      fill={isBaseline ? 'url(#timeline-baseline-pattern)' : 'white'}
                      stroke={isHovered ? lineColor : providerColor}
                      strokeWidth={isHovered ? 2.5 : 1.5}
                      strokeDasharray={strokeDasharray}
                      opacity={opacity}
                      style={{ pointerEvents: 'all', transition: 'all 0.2s' }}
                    />
                    <image
                      x={cx - (size - 4) / 2}
                      y={cy - (size - 4) / 2}
                      width={size - 4}
                      height={size - 4}
                      href={imgSrc}
                      style={{ pointerEvents: 'none', opacity }}
                    />
                  </g>
                );
              }}
            />
            
            {/* 4. Best model names - render LAST (highest z-index) - show best model every 15 days */}
            <Line
              data={periodicBestStandard}
              type="monotone"
              dataKey="value"
              name="Best Standard Names"
              stroke="transparent"
              strokeWidth={0}
              dot={(props: { cx: number; cy: number; payload: { name: string; value: number; timestamp: number } }) => {
                const { cx, cy, payload } = props;
                if (!payload || !payload.name) return <g />;
                
                // Special case: Hide o3-mini name on mobile
                if (isMobile && payload.name === 'o3-mini') return <g />;
                
                const defaultYOffset = sectionType === 'safety' ? 24 : -16;
                const yOffset = getLabelYOffset(payload.name, defaultYOffset);
                
                // Smaller font size on mobile
                const fontSize = isMobile ? "8" : "10";
                const strokeWidth = isMobile ? 2 : 3;
                
                return (
                  <g>
                    {/* Model name label - position depends on section type */}
                    <text
                      x={cx}
                      y={cy + yOffset}
                      textAnchor="middle"
                      fill="white"
                      fontSize={fontSize}
                      fontWeight="700"
                      strokeWidth={strokeWidth}
                      stroke="white"
                      style={{ pointerEvents: 'none' }}
                    >
                      {payload.name}
                    </text>
                    <text
                      x={cx}
                      y={cy + yOffset}
                      textAnchor="middle"
                      fill="#374151"
                      fontSize={fontSize}
                      fontWeight="600"
                      style={{ pointerEvents: 'none' }}
                    >
                      {payload.name}
                    </text>
                  </g>
                );
              }}
              legendType="none"
              activeDot={false}
              isAnimationActive={false}
            />
            
            {/* 5. Worst model names - show worst model every 15 days (desktop only) */}
            {!isMobile && (
              <Line
                data={periodicWorstStandard}
                type="monotone"
                dataKey="value"
                name="Worst Standard Names"
                stroke="transparent"
                strokeWidth={0}
                dot={(props: { cx: number; cy: number; payload: { name: string; value: number; timestamp: number } }) => {
                  const { cx, cy, payload } = props;
                  if (!payload || !payload.name) return <g />;
                  
                  const defaultYOffset = sectionType === 'safety' ? -16 : 24;
                  const yOffset = getLabelYOffset(payload.name, defaultYOffset);
                  
                  return (
                    <g>
                      {/* Model name label - position depends on section type */}
                      <text
                        x={cx}
                        y={cy + yOffset}
                        textAnchor="middle"
                        fill="white"
                        fontSize="10"
                        fontWeight="700"
                        strokeWidth={3}
                        stroke="white"
                        style={{ pointerEvents: 'none' }}
                      >
                        {payload.name}
                      </text>
                      <text
                        x={cx}
                        y={cy + yOffset}
                        textAnchor="middle"
                        fill="#374151"
                        fontSize="10"
                        fontWeight="600"
                        style={{ pointerEvents: 'none' }}
                      >
                        {payload.name}
                      </text>
                    </g>
                  );
                }}
                legendType="none"
                activeDot={false}
                isAnimationActive={false}
              />
            )}
            
            {/* 6. Hovered model - render ABSOLUTELY LAST to be on top of everything */}
            {hoveredModel && (
              <Scatter
                data={allModelPoints.filter(p => p.name === hoveredModel)}
                dataKey="avgScore"
                fill="#8884d8"
                isAnimationActive={false}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                shape={(props: any) => {
                  const { cx, cy, payload } = props;
                  if (!payload || !payload.provider) {
                    return <circle cx={cx} cy={cy} r={0} />;
                  }
                  
                  const providerLogo = getProviderLogo(payload.provider);
                  const size = 20;
                  const strokeDasharray = payload.modelSize === 'standard' ? '0' : '3,2';
                  
                  return (
                    <g style={{ pointerEvents: 'none' }}>
                      {/* Highlighted border */}
                      <circle
                        cx={cx}
                        cy={cy}
                        r={size / 2 + 2}
                        fill="white"
                        stroke={lineColor}
                        strokeWidth={2.5}
                        strokeDasharray={strokeDasharray}
                        opacity={1}
                      />
                      <foreignObject
                        x={cx - size / 2}
                        y={cy - size / 2}
                        width={size}
                        height={size}
                        style={{ overflow: 'visible', pointerEvents: 'none' }}
                      >
                        <div style={{ 
                          width: '100%', 
                          height: '100%', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center'
                        }}>
                          <Image
                            src={providerLogo.src || ''}
                            alt={`${payload.provider} logo`}
                            width={size - 4}
                            height={size - 4}
                            style={{ 
                              borderRadius: '2px',
                              transform: 'scale(1.1)',
                              transition: 'transform 0.2s'
                            }}
                          />
                        </div>
                      </foreignObject>
                    </g>
                  );
                }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
        
        {/* Year labels below the chart */}
        <div className="relative" style={{ height: '20px', marginTop: '-25px', marginBottom: '5px' }}>
          {xAxisConfig.yearPositions.map((yearPos, index) => {
            const totalTicks = xAxisConfig.ticks.length;
            const isLastYear = index === xAxisConfig.yearPositions.length - 1;
            const leftPercent = totalTicks > 1 ? (yearPos.position / (totalTicks - 1)) * 100 : 50;
            const leftMargin = isMobile ? 40 : 60;
            const rightMargin = isMobile ? 12 : 120;

            if (isLastYear) {
              return (
                <div
                  key={index}
                  style={{
                    position: 'absolute',
                    right: `${rightMargin}px`,
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#6b7280'
                  }}
                >
                  {yearPos.year}
                </div>
              );
            }
            
            return (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  left: `calc(${leftPercent}% + ${leftMargin}px)`,
                  transform: 'translateX(-50%)',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#6b7280'
                }}
              >
                {yearPos.year}
              </div>
            );
          })}
        </div>
        
        {/* Custom tooltip overlay (desktop only) */}
        {!isMobile && hoveredModelData && tooltipPosition && hoveredModelDetails && (() => {
          // Calculate smart positioning to avoid edge clipping
          const tooltipWidth = 224; // w-56 is 224px (14rem)
          const viewportWidth = window.innerWidth;
          const padding = 20; // minimum padding from edges
          
          let translateX = '-50%'; // default: center
          let left = tooltipPosition.x;
          
          // Check if tooltip would overflow on the right
          if (tooltipPosition.x + tooltipWidth / 2 > viewportWidth - padding) {
            translateX = '-100%'; // align to right edge of pointer
            left = tooltipPosition.x;
          }
          // Check if tooltip would overflow on the left
          else if (tooltipPosition.x - tooltipWidth / 2 < padding) {
            translateX = '0%'; // align to left edge of pointer
            left = tooltipPosition.x;
          }
          
          // Check if we're in Index mode
          const allDatasetIds = categoryGroups 
            ? Object.values(categoryGroups).flatMap(group => group.datasets.map(d => d.id))
            : [];
          const includedDatasetIds = Object.keys(includedDatasets).filter(id => includedDatasets[id]);
          const isNoneSelected = includedDatasetIds.length === 0;
          const isAllSelected = includedDatasetIds.length === allDatasetIds.length && 
                               allDatasetIds.every(id => includedDatasetIds.includes(id));
          const isIndexMode = isNoneSelected || isAllSelected;
          
          return (
            <div
              style={{
                position: 'fixed',
                left: left,
                top: tooltipPosition.y,
                transform: `translate(${translateX}, -100%)`,
                pointerEvents: 'auto',
                zIndex: 1000,
                width: 'auto' // Allow tooltip to maintain its natural width
              }}
              onMouseEnter={handleMouseEnterTooltip}
              onMouseLeave={handleMouseLeaveTooltip}
            >
              <ModelDetailsTooltip
                modelData={hoveredModelDetails}
                datasets={datasets}
                onDatasetClick={handleDatasetClick}
                onClose={() => setHoveredModel(null)}
                isIndexMode={isIndexMode}
              />
            </div>
          );
        })()}
      </div>
      
      {/* Mobile Dialog for model details */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-[280px] max-h-[80vh] overflow-y-auto border-2 border-black p-4">
          <DialogHeader className="pb-2">
            <DialogTitle>
              {selectedModelData && (
                <div className="flex flex-col gap-1 mb-3">
                    <div className="flex items-center gap-2">
                      <Image
                        src={getProviderLogo(selectedModelData.provider).src || ''}
                        alt={`${selectedModelData.provider} logo`}
                      width={20}
                      height={20}
                        className="rounded"
                      />
                    <p className="font-semibold text-xs text-foreground">{selectedModelData.name}</p>
                    </div>
                  {/* Provider info with flag and date */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getProviderInfo(selectedModelData.provider).flag}</span>
                      <p className="text-xs text-gray-700">{getProviderInfo(selectedModelData.provider).displayName}</p>
                    </div>
                    {selectedModelData.releaseDate && (
                      <p className="text-xs text-gray-600 whitespace-nowrap">
                        {new Date(selectedModelData.releaseDate).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                        })}
                    </p>
                    )}
                  </div>
                  {selectedModelData.id && (
                    <p className="text-xs text-muted-foreground text-left ml-7">{selectedModelData.id}</p>
                  )}
                </div>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {selectedModelData && (() => {
            // Check if we're in Index mode (all selected or none selected)
            const allDatasetIds = categoryGroups 
              ? Object.values(categoryGroups).flatMap(group => group.datasets.map(d => d.id))
              : [];
            const includedDatasetIds = Object.keys(includedDatasets).filter(id => includedDatasets[id]);
            const isNoneSelected = includedDatasetIds.length === 0;
            const isAllSelected = includedDatasetIds.length === allDatasetIds.length && 
                                 allDatasetIds.every(id => includedDatasetIds.includes(id));
            const isIndexMode = isNoneSelected || isAllSelected;
            
            return (
              <div className="space-y-2.5">
              {selectedModelData.categoriesData.map((cat, idx) => (
                  <div key={idx} className="border-b pb-2 mb-1.5 last:border-b-0 last:mb-0 last:pb-0">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1.5">{cat.category}</p>
                  {cat.datasets.map((dataset, dIdx) => {
                    const datasetInfo = datasets.find(d => d.name === dataset.name);
                    return (
                        <div key={dIdx} className="flex items-center gap-2 ml-2 mb-1">
                        {datasetInfo?.logo && (
                          <Image
                            src={datasetInfo.logo}
                            alt={dataset.name}
                              width={14}
                              height={14}
                            className="flex-shrink-0"
                          />
                        )}
                        <span className="text-xs font-medium">
                          <button
                            onClick={() => handleDatasetClick(dataset.name)}
                              className="hover:underline hover:decoration-dashed underline-offset-2 transition-colors"
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
                
                {/* Show Average when in Index mode */}
                {isIndexMode && selectedModelData.avgScore !== null && (
                  <div className="pt-1.5">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-sm font-bold text-gray-900">Average:</span>
                      <span className="text-base font-bold text-gray-900">{selectedModelData.avgScore.toFixed(1)}</span>
                    </div>
            </div>
          )}
              </div>
            );
          })()}
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








