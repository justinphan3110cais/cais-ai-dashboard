"use client";

import React from "react";
import Image from "next/image";
import { Dataset } from "@/lib/types";
import { getProviderLogo, getProviderInfo } from "@/app/constants";

interface ModelDetailsData {
  name: string;
  id?: string;
  provider: string;
  modelSize?: 'standard' | 'mini' | 'nano';
  releaseDate?: string;
  avgScore: number | null;
  categoriesData: {
    category: string;
    datasets: {
      name: string;
      score: number | null;
    }[];
  }[];
}

interface ModelDetailsTooltipProps {
  modelData: ModelDetailsData;
  datasets?: Dataset[]; // Optional for table mode
  onDatasetClick?: (datasetName: string) => void;
  onClose?: () => void;
  className?: string;
  showDatasetScores?: boolean; // Control whether to show dataset scores (default: true for timeline, false for table)
  isIndexMode?: boolean; // Whether to show average score at the bottom (Index mode)
}

export const ModelDetailsTooltip: React.FC<ModelDetailsTooltipProps> = ({
  modelData,
  datasets = [],
  onDatasetClick,
  onClose,
  className = "",
  showDatasetScores = true,
  isIndexMode = false
}) => {
  const providerInfo = getProviderInfo(modelData.provider);
  
  return (
    <div className={`bg-white text-foreground border-2 border-black rounded-lg shadow-lg p-3 w-56 ${className}`}>
      <div className="flex flex-col gap-1 mb-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Image
              src={getProviderLogo(modelData.provider).src || ''}
              alt={`${modelData.provider} logo`}
              width={20}
              height={20}
              className="rounded"
            />
            <p className="font-semibold text-xs text-foreground">{modelData.name}</p>
          </div>
          {modelData.releaseDate && (
            <p className="text-xs text-gray-600 whitespace-nowrap">
              {new Date(modelData.releaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
            </p>
          )}
        </div>
        {/* Provider info with flag in same column as logo */}
        <div className="flex items-center gap-2">
          <span className="text-xl">{providerInfo.flag}</span>
          <p className="text-xs text-gray-700">{providerInfo.displayName}</p>
        </div>
        {modelData.id && (
          <p className="text-xs text-muted-foreground ml-7">{modelData.id}</p>
        )}
      </div>
      
      {/* Only show dataset scores if showDatasetScores is true */}
      {showDatasetScores && modelData.categoriesData.map((cat, idx) => (
        <div key={idx} className="border-b pb-2 mb-2 last:border-b-0 last:mb-0 last:pb-0">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">{cat.category}</p>
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
                  {onDatasetClick ? (
                    <button
                      onClick={() => {
                        onDatasetClick(dataset.name);
                        onClose?.();
                      }}
                      className="hover:underline hover:decoration-dashed underline-offset-2 transition-colors"
                    >
                      {dataset.name}
                    </button>
                  ) : (
                    <span>{dataset.name}</span>
                  )}
                  : <span className="font-semibold">{dataset.score !== null ? dataset.score.toFixed(1) : 'N/A'}</span>
                </span>
              </div>
            );
          })}
        </div>
      ))}
      
      {/* Show Average when in Index mode */}
      {isIndexMode && modelData.avgScore !== null && (
        <div className="pt-2 mt-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-sm font-bold text-gray-900">Average:</span>
            <span className="text-base font-bold text-gray-900">{modelData.avgScore.toFixed(1)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

