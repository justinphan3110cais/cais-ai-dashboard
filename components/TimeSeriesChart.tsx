"use client";

import React, { useMemo } from 'react';
import { Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis, Line, LineChart, ComposedChart } from 'recharts';
import { Dataset, Model } from '@/lib/types';
import { getProviderLogo, PROVIDER_COLORS } from '@/app/constants';
import Image from 'next/image';

interface TimeSeriesChartProps {
  dataset: Dataset;
  models: Model[];
}

const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({ dataset, models }) => {
  // Prepare data: filter models with release dates and scores
  const chartData = useMemo(() => {
    return models
      .filter(model => {
        const hasReleaseDate = model.releaseDate;
        let score = model.scores[dataset.id];
        
        // Apply postprocessScore if it exists
        if (score !== null && score !== undefined && dataset.postprocessScore) {
          score = dataset.postprocessScore(score);
        }
        
        return hasReleaseDate && score !== null && score !== undefined;
      })
      .map(model => {
        let score = model.scores[dataset.id];
        
        // Apply postprocessScore if it exists
        if (score !== null && score !== undefined && dataset.postprocessScore) {
          score = dataset.postprocessScore(score);
        }
        
        return {
          date: new Date(model.releaseDate!).getTime(),
          dateStr: model.releaseDate!,
          score: score,
          name: model.name,
          provider: model.provider
        };
      })
      .sort((a, b) => a.date - b.date);
  }, [dataset, models]);

  // Calculate date density for dynamic spacing
  const { dateRanges, minDate, maxDate } = useMemo(() => {
    if (chartData.length === 0) return { dateRanges: [], minDate: 0, maxDate: 0 };
    
    const dates = chartData.map(d => d.date);
    const min = Math.min(...dates);
    const max = Math.max(...dates);
    const totalRange = max - min;
    
    // Group dates into buckets (e.g., by month)
    const bucketSize = totalRange / 12; // ~12 buckets
    const buckets: { [key: number]: number } = {};
    
    dates.forEach(date => {
      const bucketIndex = Math.floor((date - min) / bucketSize);
      buckets[bucketIndex] = (buckets[bucketIndex] || 0) + 1;
    });
    
    // Calculate weighted positions for dates
    const ranges = dates.map((date, idx) => {
      const bucketIndex = Math.floor((date - min) / bucketSize);
      const density = buckets[bucketIndex] || 1;
      
      // More models = more space allocated
      const weight = Math.sqrt(density);
      
      return {
        originalDate: date,
        weight: weight,
        index: idx
      };
    });
    
    return { dateRanges: ranges, minDate: min, maxDate: max };
  }, [chartData]);


  // Calculate smart label positions to avoid overlaps
  const labelPositions = useMemo(() => {
    if (chartData.length === 0) return new Map();
    
    // Map each model to its label position (right, left, top, bottom)
    const positions = new Map<string, { anchor: string; dx: number; dy: number }>();
    
    // Sort by score (highest first) to prioritize important models
    const sorted = [...chartData].sort((a, b) => b.score - a.score);
    
    // Track occupied regions in screen space (simplified)
    const occupied: Array<{ 
      date: number; 
      score: number; 
      position: string;
      name: string;
    }> = [];
    
    // Distance thresholds (in data units - approximate)
    const dateThreshold = (maxDate - minDate) * 0.05; // 5% of date range
    const scoreThreshold = 10; // 10 points
    
    for (const point of sorted) {
      const positions_to_try = [
        { anchor: 'start' as const, dx: 14, dy: 4, position: 'right' },
        { anchor: 'end' as const, dx: -14, dy: 4, position: 'left' },
        { anchor: 'middle' as const, dx: 0, dy: -14, position: 'top' },
        { anchor: 'middle' as const, dx: 0, dy: 20, position: 'bottom' },
        { anchor: 'start' as const, dx: 14, dy: -10, position: 'top-right' },
        { anchor: 'end' as const, dx: -14, dy: -10, position: 'top-left' },
      ];
      
      let bestPosition = positions_to_try[0];
      let minConflicts = Infinity;
      
      for (const pos of positions_to_try) {
        // Count conflicts with existing labels
        let conflicts = 0;
        
        for (const occ of occupied) {
          const dateDiff = Math.abs(point.date - occ.date);
          const scoreDiff = Math.abs(point.score - occ.score);
          
          // Check if this position would conflict
          const dateClose = dateDiff < dateThreshold;
          const scoreClose = scoreDiff < scoreThreshold;
          
          if (dateClose && scoreClose) {
            // Same position = conflict
            if (pos.position === occ.position) {
              conflicts += 2;
            } else {
              conflicts += 1;
            }
          }
        }
        
        if (conflicts < minConflicts) {
          minConflicts = conflicts;
          bestPosition = pos;
          if (conflicts === 0) break; // Found non-conflicting position
        }
      }
      
      positions.set(point.name, bestPosition);
      
      occupied.push({
        date: point.date,
        score: point.score,
        position: bestPosition.position,
        name: point.name
      });
    }
    
    return positions;
  }, [chartData, minDate, maxDate]);

  // Custom dot component with provider logo and smart label positioning
  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    
    if (!payload || !payload.provider || !payload.name) return null;
    
    const providerLogo = getProviderLogo(payload.provider);
    const providerColor = PROVIDER_COLORS[payload.provider.toLowerCase()] || '#6b7280';
    
    // Get smart position for this label
    const position = labelPositions.get(payload.name) || { anchor: 'start', dx: 14, dy: 4 };
    
    return (
      <g>
        {/* Provider logo only - no circle */}
        <foreignObject 
          x={cx - 7} 
          y={cy - 7} 
          width={14} 
          height={14}
        >
          <div className="flex justify-center items-center w-full h-full">
            <Image
              src={providerLogo.src}
              alt={`${payload.provider} logo`}
              width={14}
              height={14}
              className="rounded"
            />
          </div>
        </foreignObject>
        {/* Model name label - smart positioning to avoid overlaps */}
        <text
          x={cx + position.dx}
          y={cy + position.dy}
          fill={providerColor}
          fontSize="10"
          fontWeight="500"
          textAnchor={position.anchor}
        >
          {payload.name}
        </text>
      </g>
    );
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      // Only show tooltip for actual data points, not regression line
      if (!data.provider || !data.name || data.score === null || data.score === undefined) {
        return null;
      }
      
      return (
        <div className="bg-white border border-gray-300 rounded-lg p-3 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <Image
              src={getProviderLogo(data.provider).src}
              alt={`${data.provider} logo`}
              width={16}
              height={16}
            />
            <p className="font-semibold text-sm">{data.name}</p>
          </div>
          <p className="text-xs text-gray-600">Release: {data.dateStr}</p>
          <p className="text-xs text-gray-900 font-medium">Score: {data.score.toFixed(1)}</p>
        </div>
      );
    }
    return null;
  };

  // Format date for X-axis
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  if (chartData.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No data available with release dates for this benchmark.
      </div>
    );
  }

  // Calculate dynamic padding for X-axis based on density
  const xAxisPadding = useMemo(() => {
    if (chartData.length === 0) return { left: 0, right: 0 };
    
    const totalRange = maxDate - minDate;
    const msPerDay = 24 * 60 * 60 * 1000;
    const daysRange = totalRange / msPerDay;
    
    // More days = less padding needed per day
    // Fewer models spread over time = more padding
    const avgModelsPerMonth = chartData.length / (daysRange / 30);
    
    // Very tight padding - heavily clamped
    const paddingFactor = Math.max(0.01, Math.min(0.05, 0.5 / avgModelsPerMonth));
    
    return {
      left: paddingFactor,
      right: paddingFactor
    };
  }, [chartData, minDate, maxDate]);

  // Calculate Y-axis domain (max score + 10)
  const yAxisDomain = useMemo(() => {
    if (chartData.length === 0) return [0, 100];
    
    const maxScore = Math.max(...chartData.map(d => d.score));
    return [0, Math.min(100, maxScore + 10)];
  }, [chartData]);


  return (
    <div className="p-6">
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart
          data={chartData}
          margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            type="number" 
            dataKey="date" 
            name="Release Date"
            domain={[
              (dataMin: number) => dataMin - (maxDate - minDate) * xAxisPadding.left,
              (dataMax: number) => dataMax + (maxDate - minDate) * xAxisPadding.right
            ]}
            tickFormatter={formatDate}
            label={{ value: 'Release Date', position: 'insideBottom', offset: -10, style: { fontSize: 12 } }}
            angle={-45}
            textAnchor="end"
            height={80}
            tick={{ fontSize: 10 }}
          />
          <YAxis 
            type="number" 
            name="Score"
            label={{ value: 'Score', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
            domain={yAxisDomain}
            tick={{ fontSize: 11 }}
          />
          <ZAxis range={[64, 64]} />
          <Tooltip 
            content={<CustomTooltip />}
            cursor={false}
          />
          
          {/* Scatter plot of actual data points */}
          <Scatter 
            dataKey="score"
            shape={<CustomDot />}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimeSeriesChart;

