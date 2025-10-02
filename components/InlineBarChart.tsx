"use client";

import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import Image from "next/image";
import { Dataset, Model } from "@/lib/types";
import { getProviderLogo, PROVIDER_COLORS } from "@/app/constants";

interface InlineBarChartProps {
  datasets: Dataset[];
  models: Model[];
  bgColor: string;
  onShowDetails?: (datasetId: string) => void;
}

export const InlineBarChart: React.FC<InlineBarChartProps> = ({
  datasets,
  models,
  bgColor,
  onShowDetails
}) => {
  const [selectedDataset, setSelectedDataset] = useState<string>(datasets[0]?.id || '');

  const selectedDatasetInfo = datasets.find(d => d.id === selectedDataset);
  
  // Prepare data for the bar chart
  const chartData = models
    .filter(model => model.scores[selectedDataset] !== null && model.scores[selectedDataset] !== undefined)
    .map(model => ({
      name: model.name,
      score: model.scores[selectedDataset],
      provider: model.provider,
      providerLogo: getProviderLogo(model.provider)
    }))
    .sort((a, b) => (b.score || 0) - (a.score || 0)); // Sort by score descending

  // Get single color for provider
  const getBarColor = (provider: string) => {
    return PROVIDER_COLORS[provider] || PROVIDER_COLORS['moonshot']; // Default to gray
  };

  // Custom label component for bars with provider logo
  const CustomLabel = (props: any) => {
    const { x, y, width, value, index } = props;
    const entry = chartData[index];
    
    return (
      <g>
        {/* Provider logo */}
        <foreignObject 
          x={x + width / 2 - 20} 
          y={y - 18} 
          width={14} 
          height={14}
        >
          <div className="flex justify-center items-center">
            <Image
              src={entry?.providerLogo.src || ''}
              alt={`${entry?.provider} logo`}
              width={12}
              height={12}
              className="rounded"
            />
          </div>
        </foreignObject>
        {/* Score text */}
        <text 
          x={x + width / 2 - 4} 
          y={y - 8} 
          fill="#374151" 
          textAnchor="start" 
          fontSize="12"
          fontWeight="500"
        >
          {value}
        </text>
      </g>
    );
  };

  return (
    <div className="p-6">
      {/* Dataset Selector - Horizontal buttons */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 justify-center">
          {datasets.map(dataset => (
            <button
              key={dataset.id}
              onClick={() => setSelectedDataset(dataset.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedDataset === dataset.id 
                  ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {dataset.logo && (
                <Image
                  src={dataset.logo}
                  alt={`${dataset.name} logo`}
                  width={16}
                  height={16}
                  className="flex-shrink-0"
                />
              )}
              {dataset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Content */}
      {chartData.length > 0 ? (
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 40,
                right: 30,
                left: 20,
                bottom: 80,
              }}
            >
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fontSize: 11, fill: '#374151' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide />
              <Tooltip 
                formatter={(value, name, props) => [
                  `${value}%`,
                  selectedDatasetInfo?.name
                ]}
                labelFormatter={(label) => `Model: ${label}`}
              />
              <Bar 
                dataKey="score" 
                radius={[4, 4, 0, 0]}
              >
                <LabelList content={<CustomLabel />} />
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.provider)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex items-center justify-center h-96 text-gray-500">
          <div className="text-center">
            <p className="text-lg">No data available</p>
            <p className="text-sm">No models have scores for the selected dataset</p>
          </div>
        </div>
      )}
      
      {/* Dataset Description */}
      {selectedDatasetInfo && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">{selectedDatasetInfo.name}</h3>
            {onShowDetails && (
              <button
                onClick={() => onShowDetails(selectedDatasetInfo.id)}
                className="px-3 py-1.5 bg-background text-foreground border border-foreground rounded-md hover:bg-gray-100 transition-colors text-sm font-medium"
              >
                Examples and Details
              </button>
            )}
          </div>
          <div 
            className="text-sm text-gray-700"
            dangerouslySetInnerHTML={{ __html: selectedDatasetInfo.description }}
          />
        </div>
      )}
    </div>
  );
};