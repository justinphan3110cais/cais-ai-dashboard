"use client";

import React, { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, LabelList } from 'recharts';
import Image from "next/image";
import { Dataset, Model } from "@/lib/types";
import { getProviderLogo, PROVIDER_COLORS, BENCHMARK_TYPES } from "@/app/constants";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChartFilterBar } from "@/components/ui/ChartFilterBar";

interface InlineBarChartProps {
  datasets: Dataset[];
  models: Model[];
  onShowDetails?: (datasetId: string) => void;
}

export const InlineBarChart: React.FC<InlineBarChartProps> = ({
  datasets,
  models,
  onShowDetails
}) => {
  const [includedDatasets, setIncludedDatasets] = useState<Record<string, boolean>>(
    datasets.reduce((acc, dataset) => ({ ...acc, [dataset.id]: true }), {})
  );

  // Get default selected models (flagship models with standard or mini size from default providers)
  const defaultSelectedModels = useMemo(() => {
    const defaultProviders = ["openai", "anthropic", "xai", "google"];
    return models
      .filter(model => 
        model.flagship === true && 
        (model.model_size === 'standard' || model.model_size === 'mini') &&
        defaultProviders.includes(model.provider.toLowerCase())
      )
      .map(model => model.name);
  }, [models]);

  // Chart filters - Initialize with default providers
  const [chartFilters, setChartFilters] = useState({
    selectedProviders: ["Anthropic", "Google", "OpenAI", "xAI"], // Default providers explicitly selected
    selectedModels: defaultSelectedModels
  });

  // Toggle dataset inclusion
  const toggleDatasetInclusion = (datasetId: string) => {
    setIncludedDatasets(prev => ({
      ...prev,
      [datasetId]: !prev[datasetId]
    }));
  };

  // Filter models based on chart filters
  const filteredModels = useMemo(() => {
    return models.filter(model => {
      // Filter by provider (case-insensitive)
      const providerMatch = chartFilters.selectedProviders.some(
        p => p.toLowerCase() === model.provider.toLowerCase()
      );
      
      // Filter by selected models
      const modelMatch = chartFilters.selectedModels.includes(model.name);
      
      return providerMatch && modelMatch;
    });
  }, [models, chartFilters]);

  // Prepare data: For each dataset, create chart data with model names on X-axis
  const chartsData = useMemo(() => {
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
        .sort((a, b) => (b.score || 0) - (a.score || 0)); // Sort by score descending
        
        return {
          datasetName: dataset.name,
          datasetId: dataset.id,
          dataset: dataset,
          data: modelScores
        };
      });
  }, [datasets, filteredModels]);

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
    .sort((a, b) => (b.score || 0) - (a.score || 0)); // Sort by score descending
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
          {/* Score text - centered on top of bar */}
          <text 
            x={Number(x) + Number(width) / 2} 
            y={Number(y) - 8} 
            fill="#374151" 
            textAnchor="middle" 
            fontSize="10"
            fontWeight="500"
          >
            {typeof value === 'number' ? value.toFixed(1) : value}
          </text>
          {/* Provider logo - positioned between bar and model name */}
          <foreignObject 
            x={Number(x) + Number(width) / 2 - 7} 
            y={Number(y) + Number(height) + 8} 
            width={14} 
            height={14}
          >
            <div className="flex justify-center items-center">
              <Image
                src={providerLogo.src || ''}
                alt={`${entry.provider} logo`}
                width={12}
                height={12}
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
      />

      {/* Chart Content - One chart per benchmark with model names on X-axis */}
      {chartsData.length > 0 && filteredModels.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Individual Benchmark Charts */}
          {chartsData.map((chartInfo) => (
            <div key={chartInfo.datasetId} className="flex flex-col">
              {/* Benchmark Title with Logo, Hover, and Toggle Button */}
              <div className="flex items-center justify-center mb-3 gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex flex-col items-center justify-center cursor-pointer">
                        {/* Capability Category (Secondary Text) */}
                        {chartInfo.dataset.capabilities && chartInfo.dataset.capabilities.length > 0 ? (
                          <div className="flex items-center gap-1 mb-1">
                            {chartInfo.dataset.capabilities
                              .map(capabilityId => BENCHMARK_TYPES[capabilityId])
                              .filter(capability => capability !== undefined)
                              .map((capability, idx) => (
                                <span key={idx} className="text-xs text-muted-foreground uppercase tracking-wide">
                                  {capability.name}
                                </span>
                              ))
                            }
                          </div>
                        ) : null}
                        {/* Benchmark Name */}
                        <div className="flex items-center gap-2">
                          {chartInfo.dataset.logo && (
                            <Image
                              src={chartInfo.dataset.logo}
                              alt={`${chartInfo.datasetName} logo`}
                              width={20}
                              height={20}
                              className="flex-shrink-0"
                            />
                          )}
                          <h3 className="font-semibold text-gray-900 border-b border-dashed border-gray-600">
                            {chartInfo.datasetName}
                          </h3>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="w-72 bg-white text-black border border-gray-200 shadow-lg p-3">
                      {(() => {
                        const sentences = chartInfo.dataset.description.split('. ');
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
              </div>
              
              {/* Bar Chart */}
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartInfo.data}
                    margin={{
                      top: 30,
                      right: 10,
                      left: 10,
                      bottom: 60,
                    }}
                  >
                    <XAxis 
                      dataKey="modelName" 
                      angle={-45}
                      textAnchor="end"
                      height={60}
                      tick={{ fontSize: 10, fill: '#374151', dy: 16 }}
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
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}

          {/* Average Chart - Last Position */}
          <div className="flex flex-col">
            {/* Average Title */}
            <h3 className="text-center font-semibold text-gray-900 mb-2">
              Average
            </h3>
            
            {/* Checkboxes below Average title */}
            <div className="mb-3">
              <div className="flex flex-wrap gap-2 justify-center items-center">
                {datasets.map(dataset => (
                  <label key={dataset.id} className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includedDatasets[dataset.id] || false}
                      onChange={() => toggleDatasetInclusion(dataset.id)}
                      className="w-3 h-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      style={{ accentColor: includedDatasets[dataset.id] ? '#2563eb' : '#9ca3af' }}
                    />
                    <span className="text-xs text-gray-700">{dataset.name}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Average Chart */}
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={averageData}
                  margin={{
                    top: 30,
                    right: 10,
                    left: 10,
                    bottom: 60,
                  }}
                >
                  <XAxis 
                    dataKey="modelName" 
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    tick={{ fontSize: 10, fill: '#374151', dy: 16 }}
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
        </div>
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