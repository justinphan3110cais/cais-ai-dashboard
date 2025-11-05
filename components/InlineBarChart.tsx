"use client";

import React, { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, LabelList, ReferenceLine } from 'recharts';
import Image, { StaticImageData } from "next/image";
import { Dataset, Model } from "@/lib/types";
import { getProviderLogo, PROVIDER_COLORS, BENCHMARK_TYPES, DEFAULT_CHART_MODELS } from "@/app/constants";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChartFilterBar } from "@/components/ui/ChartFilterBar";

interface InlineBarChartProps {
  datasets: Dataset[];
  models: Model[];
  onShowDetails?: (datasetId: string) => void;
  onMobilePopup?: (type: 'dataset-info', content: { description: string; datasetId: string }) => boolean;
  sectionType?: 'text' | 'vision' | 'safety';
}

export const InlineBarChart: React.FC<InlineBarChartProps> = ({
  datasets,
  models,
  onShowDetails,
  onMobilePopup,
  sectionType = 'text'
}) => {
  const [includedDatasets, setIncludedDatasets] = useState<Record<string, boolean>>(
    datasets.reduce((acc, dataset) => ({ ...acc, [dataset.id]: true }), {})
  );


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
        return { bg: 'bg-red-50', border: 'border-red-300', borderSelected: 'border-red-500' };
      default:
        return { bg: 'bg-blue-50', border: 'border-blue-300', borderSelected: 'border-blue-500' };
    }
  };
  const colors = getSectionColors();

  // Get initial selected models based on section type
  const getInitialSelectedModels = () => {
    if (sectionType === 'vision') {
      // Filter out text-only models from default list
      return DEFAULT_CHART_MODELS.filter(modelName => {
        const model = models.find(m => m.name === modelName);
        return model && !model.isTextOnlyModel;
      });
    }
    return DEFAULT_CHART_MODELS;
  };

  // Chart filters
  const [chartFilters, setChartFilters] = useState({
    selectedProviders: [] as string[],
    selectedModels: getInitialSelectedModels()
  });

  // Mobile detection and expand state
  const [isMobile, setIsMobile] = useState(false);
  const [showAllCharts, setShowAllCharts] = useState(false);
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Toggle dataset inclusion - if toggling a category, toggle all datasets in that category
  const toggleDatasetInclusion = (datasetIdOrCategoryId: string) => {
    // Check if this is a category group
    const categoryGroup = categoryGroups[datasetIdOrCategoryId];
    
    if (categoryGroup) {
      // Toggle all datasets in this category (works for both single and multiple datasets)
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
  const availableModels = useMemo(() => {
    // For vision section, exclude text-only models
    if (sectionType === 'vision') {
      return models.filter(model => !model.isTextOnlyModel);
    }
    return models;
  }, [models, sectionType]);

  // Filter models based on selected models from chart filters
  const filteredModels = useMemo(() => {
    return availableModels.filter(model => chartFilters.selectedModels.includes(model.name));
  }, [availableModels, chartFilters]);

  // Define bottom margin for charts based on section type
  const chartBottomMargin: Record<string, number> = {
    text: 33,
    vision: 33,
    safety: 33
  };

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
    
    return filteredModels.map(model => {
      const scores = includedDatasetsIds
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
        provider: model.provider
      };
    })
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

  // Create a custom label component factory for each chart
  const createCustomLabel = (chartData: Array<{ modelName: string; score: number | null; provider: string }>) => {
    // eslint-disable-next-line react/display-name, @typescript-eslint/no-explicit-any
    return (props: any) => {
      const { x, y, width, height, value, index } = props;
      
      if (value === null || value === undefined) return null;
      if (!chartData[index]) return null;
      
      const entry = chartData[index];
      const providerLogo = getProviderLogo(entry.provider);
      
      return (
        <g>
          {/* Score text - centered in the middle of bar */}
          <text 
            x={Number(x) + Number(width) / 2} 
            y={Number(y) + Number(height) / 2} 
            fill="white"
            textAnchor="middle" 
            dominantBaseline="middle"
            fontSize="14"
            fontWeight="600"
          >
            {typeof value === 'number' ? value.toFixed(1) : value}
          </text>
          {/* Provider logo - positioned between bar and model name */}
          <foreignObject 
            x={Number(x) + Number(width) / 2 - 9} 
            y={Number(y) + Number(height) + 8} 
            width={18} 
            height={18}
          >
            <div className="flex justify-center items-center">
              <Image
                src={providerLogo.src || ''}
                alt={`${entry.provider} logo`}
                width={18}
                height={18}
                className="rounded"
              />
            </div>
          </foreignObject>
        </g>
      );
    };
  };

  return (
    <div className="p-6">
      {/* Chart Filter Bar */}
      <ChartFilterBar 
        filters={chartFilters}
        onFiltersChange={setChartFilters}
        availableModels={availableModels}
      />

      {/* Chart Content - One chart per benchmark with model names on X-axis */}
      {chartsData.length > 0 && filteredModels.length > 0 ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 overflow-visible">
            {/* Average Chart - First Position */}
            <div className="flex flex-col border border-gray-200 rounded-lg">
              {/* Average Title */}
              <h3 className={`text-center font-bold text-lg mb-2 px-3 py-1 rounded-md ${
                sectionType === 'vision' ? 'text-green-700 bg-green-50' :
                sectionType === 'safety' ? 'text-red-700 bg-red-50' :
                'text-blue-700 bg-blue-50'
              }`}>
                {sectionType === 'vision' ? 'Vision Capabilities Average' :
                 sectionType === 'safety' ? 'Safety Average' :
                 'Text Capabilities Average'}
              </h3>
              
              {/* Checkboxes below Average title */}
              <div className="mb-2">
                <div className={`flex flex-wrap gap-1 justify-center items-center mx-auto ${
                  sectionType === 'vision' ? 'max-w-[250px] sm:max-w-[400px]' : 
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
                        }`}
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
              
              {/* Average Chart */}
              <div className="h-80 overflow-visible">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={averageData}
                    margin={{
                      top: isMobile ? 20 :10,
                      right: 10,
                      left: 30,
                      bottom: chartsData.length > 4 && !isMobile ? 77: 67,
                    }}
                  >
                    <XAxis 
                      dataKey="modelName" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      tick={{ fontSize: 12, fill: '#374151', dy: 24, fontWeight: 600 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis hide />
                    <Bar 
                      dataKey="score"
                      radius={[4, 4, 0, 0]}
                    >
                      <LabelList content={createCustomLabel(averageData)} />
                      {averageData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={PROVIDER_COLORS[entry.provider] || PROVIDER_COLORS['moonshot']} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Individual Benchmark Charts - Show only first chart on desktop unless expanded, hide all on mobile unless expanded */}
            {chartsData.map((chartInfo, chartIndex) => (
              // On mobile: show only when expanded. On desktop: show first chart always, rest only when expanded
              ((isMobile && showAllCharts) || (!isMobile && (chartIndex === 0 || showAllCharts))) && (
            <div key={chartInfo.datasetId} className="flex flex-col">
              {/* Benchmark Title with Logo, Hover, and Toggle Button */}
              <div className="mb-3 w-full">
                {!isMobile ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex flex-col cursor-pointer w-full">
                          {/* Capability Category (Secondary Text) */}
                          {chartInfo.dataset.capabilities && chartInfo.dataset.capabilities.length > 0 ? (
                            <div className="flex items-center justify-center gap-1 mb-1 flex-wrap">
                              {chartInfo.dataset.capabilities
                                .map(capabilityId => BENCHMARK_TYPES[capabilityId])
                                .filter(capability => capability !== undefined)
                                .map((capability, idx) => (
                                  <span key={idx} className="text-xs text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                                    {capability.name}
                                  </span>
                                ))
                              }
                            </div>
                          ) : null}
                          {/* Benchmark Name */}
                          <div className="flex items-center justify-center gap-2 w-full px-3 py-1 rounded-md bg-gray-50">
                            {chartInfo.dataset.logo && (
                              <Image
                                src={chartInfo.dataset.logo}
                                alt={`${chartInfo.datasetName} logo`}
                                width={20}
                                height={20}
                                className="flex-shrink-0"
                              />
                            )}
                            <h3 className="font-semibold text-gray-700 whitespace-nowrap">
                              {chartInfo.datasetName}
                            </h3>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="w-72 bg-background text-foreground border border-black shadow-lg p-3">
                        {(() => {
                          // Split by periods first, then by HTML line breaks (same logic as table tooltips)
                          let firstPart = chartInfo.dataset.description.split('. ')[0];
                          firstPart = firstPart.split('<br>')[0];
                          firstPart = firstPart.split('<br/>')[0];
                          firstPart = firstPart.split('<BR>')[0];
                          
                          // Add period if it doesn't end with one and the original had more content
                          const hasMoreContent = chartInfo.dataset.description.length > firstPart.length;
                          const firstSentence = firstPart + (hasMoreContent && !firstPart.endsWith('.') ? '.' : '');
                          
                          return (
                            <div className="text-sm leading-relaxed text-wrap" dangerouslySetInnerHTML={{ __html: firstSentence }} />
                          );
                        })()}
                        {onShowDetails && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onShowDetails(chartInfo.datasetId);
                            }}
                            className="mt-3 px-3 py-1 bg-background text-foreground border border-foreground text-xs rounded hover:bg-foreground hover:text-background transition-colors"
                          >
                            Examples and Details
                          </button>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <div 
                    className="flex flex-col cursor-pointer"
                    onClick={() => {
                      if (onMobilePopup) {
                        // Split by periods first, then by HTML line breaks (same logic as table tooltips)
                        let firstPart = chartInfo.dataset.description.split('. ')[0];
                        firstPart = firstPart.split('<br>')[0];
                        firstPart = firstPart.split('<br/>')[0];
                        firstPart = firstPart.split('<BR>')[0];
                        
                        // Add period if it doesn't end with one and the original had more content
                        const hasMoreContent = chartInfo.dataset.description.length > firstPart.length;
                        const firstSentence = firstPart + (hasMoreContent && !firstPart.endsWith('.') ? '.' : '');
                        
                        onMobilePopup('dataset-info', { 
                          description: firstSentence, 
                          datasetId: chartInfo.datasetId 
                        });
                      }
                    }}
                  >
                    {/* Capability Category (Secondary Text) */}
                    {chartInfo.dataset.capabilities && chartInfo.dataset.capabilities.length > 0 ? (
                      <div className="flex items-center justify-center gap-1 mb-1 flex-wrap">
                        {chartInfo.dataset.capabilities
                          .map(capabilityId => BENCHMARK_TYPES[capabilityId])
                          .filter(capability => capability !== undefined)
                          .map((capability, idx) => (
                            <span key={idx} className="text-xs text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                              {capability.name}
                            </span>
                          ))
                        }
                      </div>
                    ) : null}
                    {/* Benchmark Name */}
                    <div className="flex items-center justify-center gap-2 w-full px-3 py-1 rounded-md bg-gray-50">
                      {chartInfo.dataset.logo && (
                        <Image
                          src={chartInfo.dataset.logo}
                          alt={`${chartInfo.datasetName} logo`}
                          width={20}
                          height={20}
                          className="flex-shrink-0"
                        />
                      )}
                      <h3 className="font-semibold text-gray-700 whitespace-nowrap">
                        {chartInfo.datasetName}
                      </h3>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Random Chance Legend */}
              {chartInfo.dataset.randomChance && (
                <div className="flex items-center justify-center gap-2 mb-0">
                  <div 
                    className="w-8 h-0.5 border-t-2 border-dashed border-muted-foreground"
                  ></div>
                  <span className="text-sm text-muted-foreground font-semibold">
                    Random: {chartInfo.dataset.randomChance}%
                  </span>
                </div>
              )}
              
              {/* Bar Chart */}
              <div className="h-80 overflow-visible">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartInfo.data}
                    margin={{
                      top: chartInfo.dataset.randomChance ? 30 : 40,
                      right: 10,
                      left: 30,
                      bottom: chartInfo.dataset.randomChance ? 43 : (isMobile ? 43 : chartBottomMargin[sectionType]),
                    }}
                  >
                    <XAxis 
                      dataKey="modelName" 
                      angle={-45}
                      textAnchor="end"
                      height={90}
                      tick={{ fontSize: 12, fill: '#374151', dy: 24, fontWeight: 600 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis hide />
                    <Bar 
                      dataKey="score"
                      radius={[4, 4, 0, 0]}
                    >
                      <LabelList content={createCustomLabel(chartInfo.data)} />
                      {chartInfo.data.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={PROVIDER_COLORS[entry.provider] || PROVIDER_COLORS['moonshot']} 
                        />
                      ))}
                    </Bar>
                    {/* Random Chance Reference Line - After Bar to render on top */}
                    {chartInfo.dataset.randomChance && (
                      <ReferenceLine 
                        y={chartInfo.dataset.randomChance} 
                        stroke="#6b7280" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                      />
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            )
          ))}
          </div>
          
          {/* View All Button - Show when not all charts are visible */}
          {!showAllCharts && chartsData.length > 1 && (
            <div className="mt-4">
              <button
                onClick={() => setShowAllCharts(true)}
                className="w-full py-3 flex items-center justify-center gap-2 text-foreground bg-gray-50 hover:bg-gray-100 rounded-md transition-colors border border-black"
              >
                <span className="text-sm font-medium">View All Benchmarks</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          )}
          
          {/* Collapse Button - Show when all charts are visible */}
          {showAllCharts && chartsData.length > 1 && (
            <div className="mt-4">
              <button
                onClick={() => setShowAllCharts(false)}
                className="w-full py-3 flex items-center justify-center gap-2 text-foreground bg-gray-50 hover:bg-gray-100 rounded-md transition-colors border border-black"
              >
                <span className="text-sm font-medium">Show Less</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-center h-96 text-gray-500">
          <div className="text-center">
            <p className="text-lg">No data available</p>
            <p className="text-sm">No flagship models or datasets selected</p>
          </div>
        </div>
      )}
    </div>
  );
};